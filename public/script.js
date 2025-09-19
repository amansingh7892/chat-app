const socket = io();
const loginContainer = document.getElementById("login-container");
const chatContainer = document.getElementById("chat-container");
const joinBtn = document.getElementById("join-btn");
const roomInput = document.getElementById("room-id");
const form = document.getElementById("chat-form");
const input = document.getElementById("msg");
const messages = document.getElementById("messages");

let roomId = "";
let mySocketId = "";

// Helper for timestamp
function getTime() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  return `${h}:${m}`;
}

// Join room
joinBtn.addEventListener("click", () => {
  roomId = roomInput.value.trim();
  if (!roomId) return;
  loginContainer.style.display = "none";
  chatContainer.style.display = "block";
  socket.emit("joinRoom", roomId);
});

// Store my socket ID
socket.on("connect", () => {
  mySocketId = socket.id;
});

// Send message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  // Show sender message
  appendMessage(msg, true);

  // Send to server
  socket.emit("chat message", { roomId, message: msg });
  input.value = "";
});

// Receive message
socket.on("chat message", ({ message, sender }) => {
  const isMine = sender === mySocketId;
  if (!isMine) appendMessage(message, false);
});

// Append message to chat
function appendMessage(msg, isMine) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(isMine ? "sent" : "received");
  div.innerHTML = `${msg} <span class="time">${getTime()}</span>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
