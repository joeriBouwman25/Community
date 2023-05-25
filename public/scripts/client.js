const socket = io();

const ul = document.querySelector("ul");
const user = document.getElementById("user");
const tabs = document.querySelectorAll("footer nav a");

const memberList = document.querySelector(".members ul");
const memberCount = document.querySelectorAll(".members ul li");
const showMoreButton = document.getElementById("showMore");
if (memberCount) {
  if (memberCount.length > 4) {
    memberList.classList.add("filter-list");
    showMoreButton.classList.remove("hidden");
    showMoreButton.addEventListener("click", () => {
      memberList.classList.toggle("filter-list");
      memberList.className === "filter-list"
        ? (showMoreButton.innerHTML = `Laat alle leden zien
      <i class="fa-solid fa-caret-down"></i>`)
        : (showMoreButton.innerHTML = `Laat minder zien
        <i class="fa-solid fa-caret-up"></i>`);
    });
  }
}

const groupTabs = document.querySelectorAll(".groupTabs h2");
const groupSections = document.querySelectorAll(".groups section");
if (groupTabs) {
  groupTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      if (!tab.classList.contains("activeTab")) {
        groupTabs.forEach((tab) => {
          tab.classList.remove("activeTab");
        });
        tab.classList.add("activeTab");

        groupSections.forEach((section) => {
          section.classList.add("hidden");
        });
        groupSections[index].classList.remove("hidden");
      }
    });
  });
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
const dialogs = document.getElementsByClassName("dialog");
const editButtons = document.querySelectorAll("#editable");
const menu = document.getElementsByClassName("editable");
if (editButtons) {
  editButtons.forEach((button, index) =>
    button.addEventListener("click", () => {
      menu[index].classList.toggle("hidden");
    })
  );

  deletePostButtons.forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", (e) => {
      menu[index].classList.toggle("hidden");
      dialogs[index].showModal();
    });
  });
}

const likeButtons = document.querySelectorAll("footer .likes");
if (likeButtons) {
  likeButtons.forEach((likeButton) => {
    const icon = likeButton.querySelector("i");
    const likes = likeButton.querySelector("p");
    likeButton.addEventListener("click", () => {
      if (icon.className === "fa solid fa-thumbs-up") {
        icon.className = "fa-regular fa-thumbs-up";
        icon.style.color = "#607d8b";
        likes.textContent--;
      } else {
        icon.className = "fa solid fa-thumbs-up";
        icon.style.color = "#007aff";
        likes.textContent++;
      }
    });
  });
}

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

const groupLabels = document.querySelectorAll(".onboarding-groups label");
const groupInputs = document.querySelectorAll(".onboarding-groups input");
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

const chatForm = document.querySelector(".chatForm");
const chatInput = document.querySelector(".chatInput");
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

const loadingState = document.querySelector(".loading");
if (loadingState) {
  let stateCheck = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(stateCheck);
      document.querySelector(".hidden").classList.remove("hidden");
      loadingState.classList.add("hidden");
    }
  }, 100);
}

// const showMore = document.getElementById("textContainer");
// if (showMore) {
//   showMoreOrLessText("textContainer", 80);
// }

// function showMoreOrLessText(containerId, characterLimit) {
//   const container = document.getElementById(containerId);
//   const content = container.innerHTML;

//   if (content.length > characterLimit) {
//     const truncatedContent = content.slice(0, characterLimit);
//     const showMoreButton = document.createElement("button");
//     showMoreButton.textContent = "Show More";
//     showMoreButton.addEventListener("click", () => {
//       container.innerHTML === content
//         ? (container.innerHTML = truncatedContent)
//         : (container.innerHTML = content);
//     });

//     container.innerHTML = truncatedContent;
//   }
//   container.appendChild(showMoreButton);
// }
