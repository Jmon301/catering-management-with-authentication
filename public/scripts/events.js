const wrapper = document.querySelector("#wrapper");
const eventsContainer = document.querySelector("#events-container");
const createEventButton = document.querySelector("#create-event-button");

// Retrieve all events from the database
const getAllEvents = async () => {
    try {
        const response = await fetch("./getEvents");
        const jsonData = await response.json();

        jsonData.forEach(item => {

            const dateAndTime = new Date(item.date_time);
            const year = dateAndTime.getFullYear();
            const month = dateAndTime.toLocaleString("en-US", { month: "short" });
            const day = dateAndTime.getDate(); 

            const date = `${month}-${day}-${year}`;
            const formattedTime = dateAndTime.toTimeString();
            const time = formattedTime.substring(0, 5);
            const dateTime = `${date} at ${time}`;

            const eventContainer = document.createElement("div");
            const eventContent = 
            `
                <h2 id="event-title">${item.event_name}</h2>
                <p id="event-id">Event ID: ${item.event_id}</p>
                <p id="event-date-time">Date and Time: ${dateTime}</p>
                <p id="event-guests">Number of Guests: ${item.number_guests}</p>
                <button class="edit-event-button" id="${item.event_id}">Edit</button>
                <button class="delete-event-button" id="${item.event_id}">Delete</button>
            `;
            eventContainer.innerHTML = eventContent;
            eventsContainer.appendChild(eventContainer);
        })

        const editButtons = document.querySelectorAll(".edit-event-button"); 
        const deleteButtons = document.querySelectorAll(".delete-event-button");    

        editButtons.forEach(item => {
            item.addEventListener('click', (e) =>{
                e.preventDefault;
                renderEditEvent(item.id);
            });
        });

        deleteButtons.forEach(item => {
            item.addEventListener('click', (e) =>{
                e.preventDefault;
                deleteEvent(item.id);
            });
        });
    }
    catch(error){
        console.error(error.message);
    }
}

// Render the create event container
const renderCreateEvent = () => {
    destroyEditContainer();
    destroyNewEventContainer();
    const newEventContainer = document.createElement("div");
    newEventContainer.id = "new-event-container";

    const newEventContent = 
    `
        <h2 id="new-event-title">Create Event</h2>
            <p><span>Event Name: <input id="new-event-name" type="text" required></span></p>
            <p><span>Number of Guests: <input id="new-event-guests" type="number" required></span></p>
            <p><span>Event Date: <input id="new-event-date" type="date" required></span></p>
            <p><span>Event Time: <input id="new-event-time" type="time" required></span></p>
            <p><span>Cuisine: <input id="new-event-cuisine" type="text" required></span></p>
            <p><span>Notes: <input id="new-event-notes" type="text"></span>
            <span><button id="save-event-button">Save</button><button id="cancel-event-button">Cancel</button></span></p>
    `;
    newEventContainer.innerHTML = newEventContent;
    wrapper.appendChild(newEventContainer);

    const saveButton = document.querySelector("#save-event-button");
    const cancelButton = document.querySelector("#cancel-event-button");

    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        saveNewEvent();
        destroyNewEventContainer();
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        destroyNewEventContainer();
    });
}

// Save an event in the database
const saveNewEvent = async () => {
    const event_name = document.querySelector("#new-event-name").value;
    const number_guests = document.querySelector("#new-event-guests").value;
    const date = document.querySelector("#new-event-date").value;
    const time = document.querySelector("#new-event-time").value;
    const date_time = `${date} ${time}:00`;
    const cuisine = document.querySelector("#new-event-cuisine").value;
    const notes = document.querySelector("#new-event-notes").value;

    try {
        const body = { event_name, number_guests, date_time, cuisine, notes};
        const response  = await fetch("./addEvent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
    destroyNewEventContainer();
    getEvents();
    } catch (error) {
        console.error(error.message)
    }
}

// Render the edit event container
const renderEditEvent = async (id) => {
    destroyEditContainer();
    destroyNewEventContainer();
    const eventToEdit = await getAnEvent(id);
    console.log(eventToEdit);

    const dateAndTime = new Date(eventToEdit.date_time);
    const formattedDateTime = dateAndTime.toISOString()
    const formattedTime = dateAndTime.toTimeString()
    const date = formattedDateTime.substring(0, 10);
    const time = formattedTime.substring(0, 8);

    const editContainer = document.createElement("div");
    editContainer.id = "edit-container";

    const editContent = 
    `
        <h2 id="edit-title">Edit Event</h2>
        <p><span>Event Name: <input id="edit-event-name" type="text" value="${eventToEdit.event_name}"} required></span></p>
        <p><span>Number of Guests: <input id="edit-guests-number" type="number" value=${eventToEdit.number_guests} required></span></p>
        <p><span>Date: <input id="edit-date" type="date" value=${date} required></span></p>
        <p><span>Time: <input id="edit-time" type="time" value=${time} required></span></p>
        <p><span>Cuisine: <input id="edit-cuisine" type="text" value=${eventToEdit.cuisine} required></span></p>
        <p><span>Notes: <input id="edit-notes" type="text" value="${eventToEdit.notes}"></span></p>
        <span><button id="update-event-button">Update</button><button id="cancel-update-button">Cancel</button>
    `;

    editContainer.innerHTML = editContent;
    wrapper.appendChild(editContainer);

    const updateButton = document.querySelector("#update-event-button");
    const cancelButton = document.querySelector("#cancel-update-button");

    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        updateEvent(id);
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        destroyEditContainer();
    });
}

// Retrieve a single event from the database
const getAnEvent = async (id) => {
    try {
        const response = await fetch(`./getEvent/${id}`);
        const jsonData = await response.json();  
        return jsonData;
    } catch (err) {
        console.error(err.message)
    }
}

// Updates an event in the database
const updateEvent = async (id) => {
    const event_name = document.querySelector("#edit-event-name").value;
    const number_guests = document.querySelector("#edit-guests-number").value;
    const date = document.querySelector("#edit-date").value;
    const time = document.querySelector("#edit-time").value;
    const date_time = `${date} ${time}:00`;
    const cuisine = document.querySelector("#edit-cuisine").value;
    const notes = document.querySelector("#edit-notes").value;

    try {      
        const body = {id, event_name, number_guests, date_time, cuisine, notes};
        const response = await fetch(`./updateEvent/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(() => {
            destroyEditContainer();
            getAllEvents();
        })
    } catch (err) {
        console.error(err.message)
    }
}

// Delete an event
const deleteEvent = async (id) => {
    console.log(id)
    try {
        const deleteEvent = await fetch(`./deleteEvent/${id}`, {
            method: "DELETE"
        });
        destroyEventsContainer(), getAllEvents();
    } catch (err) {
        console.log(err.message)
    }
}

// Removes all the contents of the events containe
const destroyEventsContainer = () => {
    eventsContainer.innerHTML = '';
}

// Removes the create new event container
const destroyNewEventContainer = () => {
    if(document.querySelector("#new-event-container")){
        const newEventContainer = document.querySelector("#new-event-container");
        wrapper.removeChild(newEventContainer);
    }
}


// Removes the edit event container
const destroyEditContainer = () => {
    if(document.querySelector("#edit-container")){
        const editContainer = document.querySelector("#edit-container");
        wrapper.removeChild(editContainer);
    }
}


// Detects clicks on the create event button
createEventButton.addEventListener('click', (e) => {
    e.preventDefault();
    renderCreateEvent();
})


// Retrieves all events on start
getAllEvents();