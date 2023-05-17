const socket = io();
const chatForm = document.querySelector(".chatForm");
const chatInput = document.querySelector(".chatInput");
const ul = document.querySelector("ul");
const user = document.getElementById("user");
const loadingState = document.querySelector(".loading");
const groupLabels = document.querySelectorAll(".chooseGroups label");
const groupInputs = document.querySelectorAll(".chooseGroups input");
const tabs = document.querySelectorAll("footer nav a");

const current = window.location.href;

if (tabs) {
  tabs.forEach((tab) => {
    if (current === tab.href) {
      tab.classList.add("activeLink");
    }
  });
}

const checkForm = () => {
  const startButton = document.getElementById("startBtn");

  // Check if any checkboxes are checked
  const checked = Array.from(groupInputs).some((input) => input.checked);

  // Disable submit button if no checkboxes are checked
  if (!checked) {
    startButton.disabled = true;
    startButton.style.opacity = "0.5";
  } else {
    startButton.disabled = false;
    startButton.style.opacity = "1";
  }
};

if (groupLabels) {
  groupInputs.forEach((input) => {
    input.addEventListener("change", checkForm);
  });

  groupLabels.forEach((label) => {
    label.addEventListener("click", () => {
      if (label.className === "active") {
        label.innerHTML = `<i id="joinIcon" class="fa-regular fa-heart-circle-plus"></i> Geïntereseerd`;
        label.classList.remove("active");
      } else {
        label.innerHTML = `<i id="joinIcon" class="fa-solid fa-heart-circle-check"></i> Geïntereseerd`;
        label.classList.add("active");
      }
    });
  });
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
      <h3><span>${data.user}</h3>
      <p>${data.value}</p>
      `;
  if (user.textContent === data.user) {
    li.className = "outgoing";
  } else {
    li.className = "incoming";
  }
  ul.appendChild(li);

  // scroll to the bottom
  window.scrollTo(0, document.body.scrollHeight + 15);
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
