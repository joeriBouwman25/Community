import { nextStep, prevStep } from "./modules/onboarding.js";
import {
  handleLike,
  removeLoadingState,
  toggleEditMenu,
} from "./modules/prikbord.js";
import { toggleTabs } from "./modules/groups.js";
const socket = io();

const ul = document.querySelector("ul");
const user = document.getElementById("user");

if (window.location.pathname === "/") {
  localStorage.clear();
}

const isOnboarding = document.getElementById("progressFooter");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const progress = document.getElementById("progress");
if (isOnboarding) {
  let progressWidth = 0;

  nextButton.addEventListener("click", () => {
    progressWidth += 20;
    progress.style.width = progressWidth + "%";
    nextStep(progressWidth);
  });

  prevButton.addEventListener("click", () => {
    progressWidth -= 20;
    progress.style.width = progressWidth + "%";
    prevStep(progressWidth);
  });
}

const uploadImage = document.querySelector(".post #image");
if (uploadImage) {
  uploadImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const element = `<img id="postImage" src="${URL.createObjectURL(
      file
    )}" alt="image">`;
    if (document.getElementById("postImage")) {
      document.getElementById("postImage").remove();
    }
    document
      .getElementById("imageField")
      .insertAdjacentHTML("beforeend", element);
  });
}

const hasToast = document.querySelectorAll(".toast");
if (hasToast) {
  const showToast = () => {
    hasToast.forEach((toast) => toast.classList.remove("toast"));
  };
  setTimeout(showToast, 2000);
}

const memberList = document.querySelector(".members ul");
const memberCount = document.querySelectorAll(".members ul li");
const showMoreButton = document.getElementById("showAllMembers");
if (showMoreButton) {
  const showMoreH3 = document.querySelector("#showAllMembers h3");
  const showMoreI = document.querySelector("#showAllMembers i");
  if (memberCount.length > 4) {
    memberList.classList.add("filter-list");
    showMoreButton.classList.remove("hidden");
    showMoreButton.addEventListener("click", () => {
      memberList.classList.toggle("filter-list");
      if (memberList.className === "filter-list") {
        showMoreH3.textContent = `Laat alle zien`;
        showMoreI.className = "fa-solid fa-caret-down";
      } else {
        showMoreH3.textContent = `Laat minder zien`;
        showMoreI.className = "fa-solid fa-caret-up";
      }
    });
  }
}

const check = document.getElementById("tabNav");
if (check) {
  toggleTabs();
}

const upButton = document.getElementById("newMessage");
if (upButton) {
  upButton.addEventListener("click", () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    upButton.classList.add("hidden");
  });
}

socket.on("new post", (post) => {
  const content = `
  <li>
    <article>
      <header>
        <img src="/images/${post.avatar}" alt="profielfoto" />
        <h3>${post.user}</h3>
      </header>
      <h2>${post.title}</h2>
      <p>${post.message}</p>
      <footer>
        <label class="likes" for="">
          <i class="fa-regular fa-thumbs-up"></i>
          <p>3</p>
        </label>
        <a href="/reactions/${post.title}">
          <label for="">
            <i class="fa-regular fa-message"></i>
            Reageer
          </label>
        </a>
      </footer>
    </article>
  </li>`;
  upButton.classList.remove("hidden");

  ul.insertAdjacentHTML("beforeend", content);
});

const deletePostButtons = document.querySelectorAll("#deletePost");
const updatePostButtons = document.querySelectorAll("#editReaction");
const dialogs = document.getElementsByClassName("dialog");
const editButtons = document.querySelectorAll("#editable");
const menu = document.getElementsByClassName("editable");
const saveButton = document.getElementsByClassName("updateButton");
const input = document.querySelectorAll("#reaction");
if (editButtons) {
  editButtons.forEach((button, index) =>
    button.addEventListener("click", () => {
      toggleEditMenu(menu, index);
    })
  );

  deletePostButtons.forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", (e) => {
      toggleEditMenu(menu, index);
      dialogs[index].showModal();
    });
  });

  updatePostButtons.forEach((updateButton, index) => {
    updateButton.addEventListener("click", () => {
      const p = document.querySelectorAll("#reactionP");

      p[index].classList.add("hidden");
      input[index].classList.remove("hidden");
      input[index].disabled = false;
      input[index].focus();
      saveButton[index].classList.remove("hidden");
      menu[index].classList.add("hidden");
    });
  });

  if (document.getElementsByClassName("reaction").length > 0) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
}

const likeButtons = document.querySelectorAll("footer .likes");
if (likeButtons) {
  likeButtons.forEach((likeButton) => {
    const icon = likeButton.querySelector("i");
    const likes = likeButton.querySelector("p");
    likeButton.addEventListener("click", () => {
      handleLike(icon, likes);
    });
  });
}

const current = window.location.href;
const pages = document.querySelectorAll("footer nav a");
if (pages) {
  pages.forEach((tab) => {
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

const groupLabels = document.querySelectorAll(".onboardingLabel");
const groupInputs = document.querySelectorAll(".onboardingInput");
if (groupLabels) {
  groupInputs.forEach((input) => {
    input.addEventListener("change", checkForm);
  });

  groupLabels.forEach((label) => {
    label.addEventListener("click", () => {
      if (label.className === "onboardingLabel active") {
        label.innerHTML = `<i id="joinIcon" class="fa-regular fa-heart-circle-plus"></i> Geïntereseerd`;
        label.classList.remove("active");
      } else {
        label.innerHTML = `<i id="joinIcon" class="fa-solid fa-heart-circle-check"></i> Geïntereseerd`;
        label.classList.add("active");
      }
    });
  });
}

const isTyping = (data) => {
  const message = `<p id="isTyping">${data}</p>`;
  chatForm.insertAdjacentHTML("beforebegin", message);
  let counter = 0;
  let stateCheck = setInterval(() => {
    counter++;
    if (counter === 1) {
      clearInterval(stateCheck);
      document.getElementById("isTyping").remove();
      counter = 0;
    }
  }, 1000);
};

socket.on("start", (data) => {
  console.log(data);
});

socket.on("chat message", (data) => {
  localStorage.setItem("message", data.value);
  localStorage.setItem("user", data.user);
  displayMessage(data);
});

socket.on("typing", (data) => {
  isTyping(data);
});

const notification = document.getElementById("notification");
socket.on("chat notification", (data) => {
  if (pages) {
    notification.classList.remove("hidden");
  }
});
const checkInput = (e, element) => {
  e.target.value.replace(/\s/g, "").length
    ? element.classList.add("activeButton")
    : element.classList.remove("activeButton");
};

const reactionForm = document.querySelector(".reactionForm");
const updateInput = document.querySelector(".updateInput");
const updateButton = document.querySelector(".updateForm button");
const reactionInput = document.querySelector(".reactionForm input");
const reactionButton = document.querySelector(".reactionForm button");
if (updateInput) {
  updateInput.addEventListener("input", (e) => {
    checkInput(e, updateButton);
  });
}
if (reactionForm) {
  reactionInput.addEventListener("input", (e) => {
    checkInput(e, reactionButton);
  });
}

const chatForm = document.querySelector(".chatForm");
const chatInput = document.querySelector(".chatInput");
const chatButton = document.querySelector(".chatForm button");
const mediaInput = document.querySelector(".chatForm input[type='file']");
if (chatForm) {
  document.addEventListener("touchmove", (e) => {
    e.preventDefault();
  });

  chatInput.addEventListener("focus", () => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });

  chatInput.addEventListener("input", (e) => {
    checkInput(e, chatButton);
    socket.emit(
      "typing",
      "De beheerder is aan het typen<span></span><span></span><span></span>"
    );
  });

  mediaInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const li = document.createElement("li");
    li.className = "outgoing";

    li.innerHTML = `<h3><span>${
      document.getElementById("user").textContent
    }</h3>
    <img id="chatImg" src="${URL.createObjectURL(file)}" alt="image">`;

    ul.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight + 15);

    socket.emit("upload", {
      type: "file",
      value: file.name,
      file: file,
      user: user.textContent,
    });
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    socket.emit("chat message", {
      type: "message",
      value: chatInput.value,
      user: user.textContent,
    });

    chatInput.value = "";
    chatInput.value.replace(/\s/g, "").length
      ? chatButton.classList.add("activeButton")
      : chatButton.classList.remove("activeButton");
  });
}

export const displayMessage = (data) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <h3><span>${data.user}</h3>
    <p>${data.value}</p>
    `;

  user.textContent === data.user
    ? (li.className = "outgoing")
    : (li.className = "incoming");

  ul.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight + 15);
};

const loadingState = document.querySelector(".loading");
if (loadingState) {
  removeLoadingState(loadingState);
}
