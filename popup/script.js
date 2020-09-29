const button = document.querySelector("button");
const actionMenu = document.querySelector("#action-menu");
const trackingIDInput = document.querySelector("#trackingID");
const trackedForInput = document.querySelector("#trackedFor");
button.addEventListener("click", () => {
  if (trackingIDInput && trackedForInput) {
    const trackingID = trackingIDInput.value;
    const trackedFor = trackedForInput.value;

    browser.storage.local
      .set({
        [trackingID]: trackedFor,
        currentTrackingID: trackingID,
      })
      .then(() => {
        trackingIDInput.value = "";
        trackedForInput.value = "";
        browser.tabs.create({
          url: "https://www.bluedart.com/web/guest/tracking",
        });
        window.close();
      });
  }
});
function render() {
  browser.storage.local.get((data) => {
    const tableContainer = document.querySelector("#table-container");
    tableContainer.innerHTML = "";
    if (tableContainer) {
      for (let key in data) {
        if (key === "currentTrackingID") {
          continue;
        }

        const idElm = document.createElement("span");
        idElm.innerText = key;
        const forElm = document.createElement("span");
        forElm.innerText = data[key];
        const menuElm = document.createElement("div");
        menuElm.classList.add("menu-item");
        menuElm.classList.add("clickable");
        menuElm.onclick = (event) => {
          event.stopPropagation();
          clearSelection();
          if (actionMenu.style.top !== "-999px") {
            actionMenu.style.top = "-999px";
            event.target.classList.remove("selected");
          } else {
            event.target.classList.add("selected");
            const {
              top,
              left,
              width,
              height,
            } = event.target.getBoundingClientRect();
            if (top + actionMenu.offsetHeight >= window.innerHeight) {
              actionMenu.style.top = top - height + "px";
            } else {
              actionMenu.style.top = top + height + "px";
            }
            actionMenu.style.left = left - width + "px";
            actionMenu.setAttribute("data-tracking-id", key);
            actionMenu.setAttribute("data-tracking-value", data[key]);
          }
        };

        const row = document.createElement("div");
        row.classList.add("row");
        row.append(idElm, forElm, menuElm);

        tableContainer.appendChild(row);
      }
    }
  });
}

document.addEventListener("click", (ev) => {
  if (!ev.target.contains(actionMenu)) {
    clearSelection();
    actionMenu.style.top = "-999px";
  }
});

actionMenu.addEventListener("click", (ev) => {
  ev.stopPropagation();
  const alt = ev.target.getAttribute("alt");
  if (alt === "Track") {
    browser.storage.local
      .set({
        currentTrackingID: actionMenu.getAttribute("data-tracking-id"),
      })
      .then(() => {
        browser.tabs.create({
          url: "https://www.bluedart.com/web/guest/tracking",
        });
        window.close();
      });
  } else if (alt === "Edit") {
    trackingIDInput.value = actionMenu.getAttribute("data-tracking-id");
    trackedForInput.value = actionMenu.getAttribute("data-tracking-value");
    clearSelection();
    actionMenu.style.top = "-999px";
  } else if (alt === "Remove") {
    browser.storage.local.remove(actionMenu.getAttribute("data-tracking-id"));
    clearSelection();
    actionMenu.style.top = "-999px";
    render();
  }
});

function clearSelection() {
  const allMenuItems = document.querySelectorAll(".menu-item");
  actionMenu.removeAttribute("data-tracking-id");
  actionMenu.removeAttribute("data-tracking-value");
  if (allMenuItems) {
    allMenuItems.forEach((elem) => {
      elem.classList.remove("selected");
    });
  }
}

render();
