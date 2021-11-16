// Links to the sections 
const eventsContainer = document.querySelector("#events-link-container");
eventsContainer.addEventListener('click', () => {
    window.location.href = "/events";
});

const recipesContainer = document.querySelector("#recipes-link-container");
recipesContainer.addEventListener('click', () => {
    window.location.href = "/recipes";
})

const scheduleContainer = document.querySelector("#schedule-link-container");
scheduleContainer.addEventListener('click', () => {
    window.location.href = "/schedule";
})

const tasksContainer = document.querySelector("#tasks-link-container");
tasksContainer.addEventListener('click', () => {
    window.location.href = "/tasks";
})