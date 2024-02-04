document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu__item");
  const hamburger = document.querySelector(".hamburger-menu");
  const menu = document.querySelector(".menu");

  hamburger.addEventListener("click", function () {
    menu.classList.toggle("menu-active");
  });

  const isMobileDevice = () => {
    return window.matchMedia("(max-width: 767px)").matches;
  };

  menuItems.forEach((item) => {
    const link = item.querySelector(".menu__link--has-arrow");
    const submenu = item.querySelector(".submenu");

    if (link && submenu) {
      item.addEventListener("mouseenter", function () {
        if (!isMobileDevice()) {
          showSubmenu(link, submenu);
        }
      });

      item.addEventListener("mouseleave", function () {
        if (!isMobileDevice()) {
          hideSubmenu(link, submenu);
        }
      });

      item.addEventListener("click", function () {
        if (isMobileDevice()) {
          if (submenu.classList.contains("submenu-active")) {
            hideSubmenu(link, submenu);
          } else {
            showSubmenu(link, submenu);
          }
        }
      });
    }
  });

  function showSubmenu(link, submenu) {
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
  }

  function hideSubmenu(link, submenu) {
    link.classList.remove("menu__link--arrow-up");
    submenu.style.display = "none";
    submenu.classList.remove("submenu-active");
  }
});
