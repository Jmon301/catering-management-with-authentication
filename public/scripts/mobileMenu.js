const smallNavigation = document.querySelector(".small-navigation");
const burgerMenu = document.querySelector(".burger-menu");
burgerMenu.addEventListener('click', () => { 
    smallNavigation.classList.remove("invisible");
    smallNavigation.classList.add("visible");
});

const closeButton = document.querySelector("#small-menu-close-button");
closeButton.addEventListener('click', () => {
    smallNavigation.classList.add("invisible");
    smallNavigation.classList.remove("visible");
});


