const chatWindow = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendBtn");

const socket = new WebSocket("wss://echo-ws-service.herokuapp.com");

socket.addEventListener("open", (event) => {
  console.log("WebSocket connection opened.");
});

socket.addEventListener("message", (event) => {
  const message = event.data;
  console.log(`WebSocket received message: ${message}`);
  chatWindow.innerHTML += `<p>${message}</p>`;
});

socket.addEventListener("close", (event) => {
  console.log("WebSocket connection closed.");
});

sendButton.addEventListener("click", (event) => {
  const message = messageInput.value;
  socket.send(message);
  console.log(`WebSocket sent message: ${message}`);
  chatWindow.innerHTML += `<p><strong>Вы:</strong> ${message}</p>`;
  messageInput.value = "";
});

const geolocationBtn = document.querySelector('#geolocation-btn');

geolocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    chatWindow.insertAdjacentHTML('beforeend', '<div>Geolocation is not supported by your browser</div>');
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const mapLink = `<a href="https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15" target="_blank">View on OpenStreetMap</a>`;
      chatWindow.insertAdjacentHTML('beforeend', `<div>Current Location: ${mapLink}</div>`);
      // Отправляем данные на сервер
      const message = { type: 'location', data: { latitude, longitude } };
      socket.send(JSON.stringify(message));
    }, () => {
      chatWindow.insertAdjacentHTML('beforeend', '<div>Unable to retrieve your location</div>');
    });
  }
});