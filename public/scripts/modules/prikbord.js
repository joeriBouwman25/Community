export const handleLike = (icon, likes) => {
  if (icon.className === "fa solid fa-thumbs-up") {
    icon.className = "fa-regular fa-thumbs-up";
    icon.style.color = "#607d8b";
    likes.textContent--;
  } else {
    icon.className = "fa solid fa-thumbs-up";
    icon.style.color = "#007aff";
    likes.textContent++;
  }
};

export const toggleEditMenu = (menu, index) => {
  menu[index].classList.toggle("hidden");
};

export const removeLoadingState = (loadingState) => {
  let stateCheck = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(stateCheck);
      document.querySelector(".hidden").classList.remove("hidden");
      loadingState.classList.add("hidden");
    }
  }, 100);
};
