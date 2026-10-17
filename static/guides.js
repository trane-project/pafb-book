// Without JavaScript the tier links navigate to the five visible diagrams.
document.querySelectorAll(".visual-guide[data-default-tab]").forEach((guide) => {
  const tablist = guide.querySelector(".visual-guide-tabs");
  const tabs = Array.from(tablist.querySelectorAll("a"));
  const panels = tabs.map((tab) => guide.querySelector(tab.getAttribute("href")));

  const selectTab = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (focus) tabs[index].focus();
  };

  tablist.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panels[index].id);
    panels[index].setAttribute("role", "tabpanel");
    panels[index].setAttribute("aria-labelledby", tab.id);
    panels[index].tabIndex = 0;

    tab.addEventListener("click", (event) => {
      event.preventDefault();
      selectTab(index);
    });

    tab.addEventListener("keydown", (event) => {
      let next;
      switch (event.key) {
        case "ArrowRight":
          next = (index + 1) % tabs.length;
          break;
        case "ArrowLeft":
          next = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
        case " ":
          next = index;
          break;
        default:
          return;
      }
      event.preventDefault();
      selectTab(next, true);
    });
  });

  const initial = panels.findIndex((panel) => panel.id === guide.dataset.defaultTab);
  selectTab(initial < 0 ? 0 : initial);
});
