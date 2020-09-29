const trackingIdField = document.querySelector("#trackingNo");

if (trackingIdField) {
  browser.storage.local.get("currentTrackingID").then((data) => {
    trackingIdField.innerHTML = data.currentTrackingID;
    setTimeout(() => {
      const goBtn = document.querySelector("#goBtn");
      if (goBtn) {
        goBtn.click();
      }
    }, 200);
  });
}
