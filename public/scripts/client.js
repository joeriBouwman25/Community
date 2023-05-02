const socket = io();
const chatForm = document.querySelector(".chatForm");
const chatInput = document.querySelector(".chatInput");
const ul = document.querySelector("ul");
const user = document.getElementById("user");
const loadingState = document.querySelector(".loading");
const element = document.querySelector(".door");

if (element) {
  element.addEventListener("click", toggleDoor);
  toggleDoor();

  function toggleDoor() {
    element.classList.toggle("doorOpen");
  }
}

socket.on("start", (data) => {
  console.log(data);
});

socket.on("chat message", (data) => {
  displayMessage(data);
});

if (chatForm)
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("chat message", {
      value: chatInput.value,
      user: user.textContent,
    });
    chatInput.value = "";
  });

export const displayMessage = (data) => {
  const li = document.createElement("li");
  li.innerHTML = `
      <p><span>${data.user}:</span></p>
      <p>${data.value}</p>
      `;
  if (user.textContent === data.user) {
    li.className = "outgoing";
  } else {
    li.className = "incoming";
  }
  ul.appendChild(li);

  // scroll to the bottom
  ul.scrollTo(0, document.body.scrollHeight + 3);
};

if (loadingState) {
  let stateCheck = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(stateCheck);
      document.querySelector(".hidden").classList.remove("hidden");
      loadingState.classList.add("hidden");
    }
  }, 100);
}
