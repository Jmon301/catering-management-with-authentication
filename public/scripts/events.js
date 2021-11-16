const wrapper = document.querySelector("#wrapper");
const eventsContainer = document.querySelector("#events-container");
const createEventButton = document.querySelector("#create-event-button");

// Retrieve all events from the database
const getAllEvents = async () => {
    destroyEventsContainer();
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
            eventContainer.id="event-container"; 
            const eventContent = 
            `
                <h2 id="event-title">${item.event_name}</h2>
                <div id="event-info">
                    <p id="event-id">Event ID: <span>${item.event_id}</span></p>
                    <p id="event-date">Date: <span>${date}</span></p>
                    <p id="event-time">Time: <span>${time}</span></p>
                    <p id="event-guests">Number of Guests: <span>${item.number_guests}</span></p>
                    <p id="event-notes">Notes: <span>${item.notes}</span></p>
                </div>
                <div id="event-buttons">
                    <span class="edit-event-button" id="${item.event_id}">Edit</span>
                    <span class="delete-event-button" id="${item.event_id}">Delete</button></span>
                </div>
                    `;
            eventContainer.innerHTML = eventContent;
            eventsContainer.appendChild(eventContainer);
        })
        const editButtons = document.querySelectorAll(".edit-event-button"); 
        const deleteButtons = document.querySelectorAll(".delete-event-button");    

        editButtons.forEach(item => {
            item.addEventListener('click', (e) =>{
                e.preventDefault;
                applyOverlay();
                renderEditEvent(item.id);
            });
        });

        deleteButtons.forEach(item => {
            item.addEventListener('click', (e) =>{
                e.preventDefault;
                renderDeleteConfirmation(item.id);
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
        <div>
            <input id="new-event-name" type="text" placeholder="Event's Name" required>
            <input id="new-event-guests" type="number" placeholder="Number of Guests" required>
            <input id="new-event-date" type="date" placeholder= required>
            <input id="new-event-time" type="time" required>
            <input id="new-event-cuisine" type="text" placeholder="Cuisine" required>
            <textarea id="new-event-notes" rows="3" placeholder="Notes"></textarea>
        </div>
        <div id="new-event-buttons">
            <span><button id="save-event-button">Save</button><button id="cancel-event-button">Cancel</button></span></p>
        </div>
                `;
    newEventContainer.innerHTML = newEventContent;
    wrapper.appendChild(newEventContainer);

    const saveButton = document.querySelector("#save-event-button");
    const cancelButton = document.querySelector("#cancel-event-button");

    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        // saveNewEvent();
        inputValidation("create");
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        destroyNewEventContainer();
        destroyOverlay();
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
    destroyOverlay();
    getAllEvents();
    } catch (error) {
        console.error(error.message)
    }
}

// Render the edit event container
const renderEditEvent = async (id) => {
    destroyEditContainer();
    destroyNewEventContainer();
    applyOverlay();
    const eventToEdit = await getAnEvent(id);
    const dateAndTime = new Date(eventToEdit.date_time);
    const formattedDateTime = dateAndTime.toISOString()
    const formattedTime = dateAndTime.toTimeString()
    const date = formattedDateTime.substring(0, 10);
    const time = formattedTime.substring(0, 8);
    const editContainer = document.createElement("div");
    editContainer.id = "edit-event-container";

    const editContent = 
    `
        <h2 id="edit-title">Edit Event</h2>
        <div>
            <input id="edit-event-name" type="text" value="${eventToEdit.event_name}"} required>
            <input id="edit-guests-number" type="number" value=${eventToEdit.number_guests} required>
            <input id="edit-date" type="date" value=${date} required>
            <input id="edit-time" type="time" value=${time} required>
            <input id="edit-cuisine" type="text" value=${eventToEdit.cuisine} required>
            <textarea id="edit-event-notes" rows="3">${eventToEdit.notes}</textarea>
        </div>
        <div id="edit-event-buttons">
            <span>
                <button id="update-event-button">Update</button><button id="cancel-update-button">Cancel</button>
            </span>
        </div>
    `;

    editContainer.innerHTML = editContent;
    wrapper.appendChild(editContainer);

    const updateButton = document.querySelector("#update-event-button");
    const cancelButton = document.querySelector("#cancel-update-button");

    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        // updateEvent(id);
        inputValidation("update", id);
    });

    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        destroyEditContainer();
        destroyOverlay();
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
    const date_time = `${date} ${time}`;
    const cuisine = document.querySelector("#edit-cuisine").value;
    const notes = document.querySelector("#edit-event-notes").value;

    try {      
        const body = {id, event_name, number_guests, date_time, cuisine, notes};
        const response = await fetch(`./updateEvent/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(() => {
            destroyEditContainer();
            destroyOverlay();
            getAllEvents();
        })
    } catch (err) {
        console.error(err.message)
    }
}

// Render the delete confirmation
const renderDeleteConfirmation = async (id) => {
    applyOverlay();
    // Instantiates the DeleteMessage class and uses it to render a message
    const message = new DeleteMessage("Event Deletion", `Are you sure you want to delete this event?`, "Ok", "Cancel");
    message.renderMessage(message);

    const messageContainer = document.querySelector("#delete-message-container");
    const cancelButton = document.querySelector("#message-cancel-button");
    const confirmationButton = document.querySelector("#message-confirmation-button");
    cancelButton.addEventListener('click', () => {
        wrapper.removeChild(messageContainer);
        destroyOverlay();
        return;
    });

    confirmationButton.addEventListener('click', () => {
        wrapper.removeChild(messageContainer);
        deleteEvent(id);
    });
}

// Delete an event
const deleteEvent = async (id) => {
    try {
        const deleteEvent = await fetch(`./deleteEvent/${id}`, {
            method: "DELETE"
        });
        destroyEventsContainer();
        getAllEvents();
    } catch (err) {
        console.error(err.message)
    }
    // Instantiates the ConfirmationMessage class and uses it to render a message
   const message = new ConfirmationMessage("Event Deleted", `The event with ID: ${id} has been deleted`, "Ok");
   message.renderMessage(message);
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
    if(document.querySelector("#edit-event-container")){
        const editContainer = document.querySelector("#edit-event-container");
        wrapper.removeChild(editContainer);
    }
}

// Apply an overlay to the background
const applyOverlay = () => {
    document.getElementById("sub-wrapper").classList.add("sub-wrapper-overlay")
    document.getElementById("overlay").style.display = "block";
}

// Removes the overlay from the background
const destroyOverlay = () => {
    document.getElementById("sub-wrapper").classList.remove("sub-wrapper-overlay");
    document.getElementById("overlay").style.display = "none";
}

// Detects clicks on the create event button
createEventButton.addEventListener('click', (e) => {
    e.preventDefault();
    applyOverlay();
    renderCreateEvent();
})

// Validates that the important fields are not empty
const inputValidation = (origin, id) => {
    switch(origin){
        case (origin = "create"):
            if(
                document.querySelector("#new-event-name").value == '' ||
                document.querySelector("#new-event-guests").value == '' ||
                document.querySelector("#new-event-date").value == '' ||
                document.querySelector("#new-event-time").value == '' ||
                document.querySelector("#new-event-cuisine").value == ''
                ){  
                    // Disable buttons
                    const buttons = document.querySelectorAll("button")
                    buttons.forEach(item => {
                        item.disabled = true;
                    });

                    const invalidInput = document.createElement("div");
                    invalidInput.className = "invalid-input";
                    const content = 
                    `
                        <h2>Invalid Input</h2>
                        <p>Please make sure that all the required fields have been completed.</p>
                        <button>Ok</button>
                    `;
                    invalidInput.innerHTML = content;
                    wrapper.appendChild(invalidInput);

                    document.getElementById("new-event-container").classList.add("sub-wrapper-overlay");
                    document.getElementById("overlay").style.display = "block";
                    document.querySelector(".invalid-input button").addEventListener('click', () => {
                        wrapper.removeChild(invalidInput);
                        document.getElementById("new-event-container").classList.remove("sub-wrapper-overlay");
                        document.getElementById("overlay").style.display = "none";
                        const buttons = document.querySelectorAll("button")
                        buttons.forEach(item => {
                            item.disabled = false;
                        });
                    })
                }
            else{
                saveNewEvent();
            }
            break;
        case(origin="update"):
        if(
            document.querySelector("#edit-event-name").value == '' ||
            document.querySelector("#edit-guests-number").value == '' ||
            document.querySelector("#edit-date").value == '' ||
            document.querySelector("#edit-time").value == '' ||
            document.querySelector("#edit-cuisine").value == ''
            ){  
                // Disable buttons
                const buttons = document.querySelectorAll("button")
                buttons.forEach(item => {
                    item.disabled = true;
                });

                const invalidInput = document.createElement("div");
                invalidInput.className = "invalid-input";
                const content = 
                `
                    <h2>Invalid Input</h2>
                    <p>Please make sure that all the required fields have been completed.</p>
                    <button>Ok</button>
                `;
                invalidInput.innerHTML = content;
                wrapper.appendChild(invalidInput);

                document.getElementById("edit-event-container").classList.add("sub-wrapper-overlay");
                document.getElementById("overlay").style.display = "block";
                document.querySelector(".invalid-input button").addEventListener('click', () => {
                    wrapper.removeChild(invalidInput);
                    document.getElementById("edit-event-container").classList.remove("sub-wrapper-overlay");
                    document.getElementById("overlay").style.display = "none";
                    const buttons = document.querySelectorAll("button")
                    buttons.forEach(item => {
                        item.disabled = false;
                    });
                })
            }
        else{
            updateEvent(id);
        }
        break;
    }
}

// Retrieves all events on start
getAllEvents();