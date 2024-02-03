document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu__item");
  const hamburger = document.querySelector(".hamburger-menu");
  const menu = document.querySelector(".menu");

  hamburger.addEventListener("click", function () {
    menu.classList.toggle("menu-active");
  });

  menuItems.forEach((item) => {
    const link = item.querySelector(".menu__link--has-arrow");
    const submenu = item.querySelector(".submenu");

    if (link && submenu) {
      item.addEventListener("mouseenter", function () {
        const rect = link.getBoundingClientRect();
        const submenuBefore = window.getComputedStyle(submenu, "::before");
        const triangleLeft =
          rect.left +
          rect.width / 2 -
          parseFloat(submenuBefore.getPropertyValue("border-left-width"));

        submenu.style.setProperty("--triangle-left", triangleLeft + "px");

        link.classList.add("menu__link--arrow-up");
        submenu.style.display = "flex";
        submenu.classList.add("submenu-active");
      });

      item.addEventListener("mouseleave", function () {
        link.classList.remove("menu__link--arrow-up");
        submenu.style.display = "none";
        submenu.classList.remove("submenu-active");
      });
    }
  });
});
