//@unocss-include
export const showSideNavigation = function () {
  const sideNavigation = document.querySelector("#side-navigation")!;
  const closeButton = document.querySelector("#close-button")!;

  sideNavigation.classList.remove("hidden");

  sideNavigation.firstElementChild!.addEventListener(
    "click",
    function (event) {
      if (event.target === closeButton || closeButton.contains(event.target as Node))
        return;

      event.stopPropagation();
    }
  );

  function hideOnOverlayClicked() {
    hideSideNavigation();
    sideNavigation.removeEventListener("click", hideOnOverlayClicked);
  }

  sideNavigation.addEventListener("click", hideOnOverlayClicked);
};

//@unocss-include
export const hideSideNavigation = function () {
  const sideNavigation = document.querySelector("#side-navigation") as
    | HTMLDivElement
    | undefined
    | null;

  const container = sideNavigation?.firstElementChild as
    | HTMLDivElement
    | undefined
    | null;

  if (sideNavigation && container) {
    // container.classList.add("animate-slide-out-left");

    // container.onanimationend = function(){
    //   console.log("Fuckkkkk")
    //     container.classList.remove("animate-slide-out-left");

    //     container.classList.add("animate-slide-in-left");

    //     container.onanimationend = null;
    // }
    sideNavigation.classList.add("hidden");
  }
};

