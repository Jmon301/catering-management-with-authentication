const smallNavigation = document.querySelector(".small-navigation");
const body = document.querySelector('body');
const burgerMenu = document.querySelector(".burger-menu");
burgerMenu.addEventListener('click', () => { 
    smallNavigation.classList.remove("invisible");
    smallNavigation.classList.add("visible");
    body.classList.add("lock-screen");
});

const closeButton = document.querySelector("#small-menu-close-button");
closeButton.addEventListener('click', () => {
    smallNavigation.classList.add("invisible");
    smallNavigation.classList.remove("visible");
    body.classList.remove("lock-screen");
});


