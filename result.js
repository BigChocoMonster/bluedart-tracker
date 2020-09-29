const panelBody = document.querySelector(".panel-body");
const navs = document.querySelectorAll('a[data-toggle="tab"]');
if (navs && navs[1]) {
  navs[1].click();
  setTimeout(() => {
    panelBody.scrollIntoView({ behavior: "smooth" });
  }, 200);
}
