const onboardingSections = document.querySelectorAll(".onboarding article");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const progress = document.getElementById("progress");

export const nextStep = (progressWidth) => {
  if (progressWidth === 20) {
    onboardingSections[4].classList.add("inActive");
    prevButton.classList.remove("hidden");
  } else if (progressWidth === 40) {
    onboardingSections[3].classList.add("inActive");
  } else if (progressWidth === 60) {
    onboardingSections[2].classList.add("inActive");
  } else if (progressWidth === 80) {
    onboardingSections[1].classList.add("inActive");
    const newLink = document.createElement("a");
    newLink.id = "newLink";
    newLink.href = "/chooseGroups";
    prevButton.insertAdjacentElement("afterend", newLink);
    newLink.insertAdjacentElement("beforeend", nextButton);
  } else if (progressWidth === 100) {
    onboardingSections[0].classList.add("inActive");
  }
};

export const prevStep = (progressWidth) => {
  if (progressWidth === 0) {
    onboardingSections[4].classList.remove("inActive");
    prevButton.classList.add("hidden");
  } else if (progressWidth === 20) {
    onboardingSections[3].classList.remove("inActive");
  } else if (progressWidth === 40) {
    onboardingSections[2].classList.remove("inActive");
  } else if (progressWidth === 60) {
    onboardingSections[1].classList.remove("inActive");
    document.getElementById("newLink").replaceWith(nextButton);
  } else if (progressWidth === 80) {
    onboardingSections[0].classList.remove("inActive");
  }
};
