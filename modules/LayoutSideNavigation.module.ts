export const showSideNavigation = function () {
  const sideNavigation =
    document.querySelector("#side-navigation");

  if (sideNavigation) sideNavigation.classList.remove("hidden");
};

export const hideSideNavigation = function () {
    const sideNavigation =
    document.querySelector("#side-navigation") as HTMLDivElement  | undefined | null;

    const container = sideNavigation?.firstElementChild  as HTMLDivElement  | undefined | null;

  if (sideNavigation && container){
    container.classList.add("lt-md:animate-slide-out-left");

    container.onanimationend = function(){
        container.classList.remove("lt-md:animate-slide-out-left");

        container.classList.add("lt-md:animate-slide-in-left");
        sideNavigation.classList.add("hidden");

        container.onanimationend = null;
    }
  }
};
