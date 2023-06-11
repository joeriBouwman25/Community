export const toggleTabs = () => {
  const groupTabs = document.querySelectorAll(".groupTabs h2");
  const groupSections = document.querySelectorAll(".groups section");
  groupTabs.forEach((tab) => tab.classList.remove("activeTab"));
  groupSections.forEach((section) => section.classList.add("hidden"));

  if (typeof Storage === "undefined") {
    console.error("Local storage is not supported.");
  }

  let activeTab = localStorage.getItem("activeTab");
  if (activeTab !== "ontdekken") {
    groupTabs[0].classList.add("activeTab");
    groupSections[0].classList.remove("hidden");
  } else {
    groupTabs[1].classList.add("activeTab");
    groupSections[1].classList.remove("hidden");
  }

  groupTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      if (!tab.classList.contains("activeTab")) {
        groupTabs.forEach((tab) => tab.classList.remove("activeTab"));
        groupSections.forEach((section) => section.classList.add("hidden"));

        activeTab === "ontdekken"
          ? (activeTab = "mijngroepen")
          : (activeTab = "ontdekken");
      }

      tab.classList.add("activeTab");
      groupSections[index].classList.remove("hidden");

      localStorage.setItem("activeTab", activeTab);
    });
  });
};
