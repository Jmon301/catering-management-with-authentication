const wrapper = document.querySelector("#wrapper");
const activitiesContainer = document.querySelector("#activities-container");
const createActivityButton = document.querySelector("#create-activity-button");

// Retrieve all the activities from the database
const getActivities = async () => {
    destroyTableActivities();
    const table = 
        `<table id="table">
                <thead>
                    <tr>
                        <th id="activity-header">Activity</th>
                        <th id="activity-date-time">Date and Time</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        `;

        const activitiesTable = document.createElement("div");
        activitiesTable.innerHTML = table;
        activitiesContainer.appendChild(activitiesTable);

    try {
        const response = await fetch("./getActivities");
        const jsonData = await response.json();

        const tableBody = document.querySelector("#table-body");

        jsonData.forEach(item =>{
            const newRow = document.createElement("tr");

            const activityName = document.createElement("td");
            activityName.innerHTML = item.activity_name;

            const dateAndTime = new Date(item.date_time);
            const year = dateAndTime.getFullYear();
            const month = dateAndTime.toLocaleString("en-US", { month: "short" });
            const day = dateAndTime.getDate(); 

            const date = `${month}-${day}-${year}`;
            const formattedTime = dateAndTime.toTimeString();
            const time = formattedTime.substring(0, 5);

            const dateTime = document.createElement("td");
            dateTime.innerHTML = `${date} ${time}`;

            const editActivityButton = document.createElement("span");
            editActivityButton.innerHTML = "Edit";
            editActivityButton.className = "edit-activity-button";
            editActivityButton.id = item.activity_id;

            const deleteActivityButton = document.createElement("span");
            deleteActivityButton.innerHTML = "Delete";
            deleteActivityButton.className = "delete-activity-button";
            deleteActivityButton.id = item.activity_id;

            newRow.appendChild(activityName);
            newRow.appendChild(dateTime);
            newRow.appendChild(editActivityButton);
            newRow.appendChild(deleteActivityButton);

            tableBody.appendChild(newRow);
        });

        const allEditButtons = document.querySelectorAll(".edit-activity-button");
        allEditButtons.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                applyOverlay();
                renderEditActivity(item.id);
            })
        });

        const allDeleteButtons = document.querySelectorAll(".delete-activity-button");
        allDeleteButtons.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                applyOverlay();
                renderDeleteConfirmation(item.id);
            })
        });
    }
    catch(error){
        console.error(error.message);
    }
}

// Stores a new activity in the database
const saveNewActivity = async () => {
    const activity_name = document.querySelector("#new-activity-input").value;
    const date = document.querySelector("#new-activity-date-input").value;
    const time = document.querySelector("#new-activity-time-input").value;
    const date_time = `${date} ${time}:00`;

    try {
        const body = { activity_name, date_time };
        const response  = await fetch("./addActivity", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
    destroyNewActivity();
    destroyOverlay();
    getActivities();
    } catch (error) {
        console.error(error.message)
    }
}

// Retrieves the activity to edit
const getActivityToEdit = async (id) => {
    try {
        const response = await fetch(`./getActivity/${id}`);
        const jsonData = await response.json();
        return jsonData;
    } catch (err) {
        console.error(err.message)
    }
}

// Renders the activity edition section
const renderEditActivity = async (activityId) => {
    destroyNewActivity();
    destroyEditContainer();
    const activityToEdit = await getActivityToEdit(activityId);

    const dateAndTime = new Date(activityToEdit.date_time);
    const formattedDateTime = dateAndTime.toISOString()
    const formattedTime = dateAndTime.toTimeString()
    const date = formattedDateTime.substring(0, 10);
    const time = formattedTime.substring(0, 8);

    const editActivityContainer = document.createElement("div");
    editActivityContainer.id = "edit-activity-container";

    const editTitle = document.createElement("h2");
    editTitle.id = "edit-title";
    editTitle.innerHTML = "Edit Activity";
    editActivityContainer.appendChild(editTitle);

    const editActivityName = document.createElement("textarea");
    editActivityName.id = "edit-activity-name";
    editActivityName.type = "text";
    editActivityName.value = activityToEdit.activity_name;
    editActivityContainer.appendChild(editActivityName);

    const editDate = document.createElement("input");
    editDate.id = "edit-date";
    editDate.type = "date";
    editDate.value = date;
    editDate.required = true;
    editActivityContainer.appendChild(editDate);

    const editTime = document.createElement("input");
    editTime.id = "edit-time";
    editTime.type = "time";
    editTime.value = time;
    editTime.required = true;
    editActivityContainer.appendChild(editTime);

    const butttonsContainer = document.createElement("div");
    butttonsContainer.className = "create-buttons-container";
    editActivityContainer.appendChild(butttonsContainer);

    const updateActivityButton = document.createElement("button");
    updateActivityButton.id = "update-activity-button";
    updateActivityButton.innerHTML = "Save";
    butttonsContainer.appendChild(updateActivityButton);

    const cancelUpdate = document.createElement("button");
    cancelUpdate.id = "cancel-update-button";
    cancelUpdate.innerHTML = "Cancel";
    butttonsContainer.appendChild(cancelUpdate);

    wrapper.appendChild(editActivityContainer);

    updateActivityButton.addEventListener('click', (e) => {
        e.preventDefault();
        // updateActivity(activityId);
        inputValidation("update", activityId);
    });

    cancelUpdate.addEventListener('click', (e) => {
        e.preventDefault();
        destroyOverlay();
        destroyEditContainer();
     });
}

// Updates the activity in the database
const updateActivity = async (id) => {
    const activity_name = document.querySelector("#edit-activity-name").value;
    const date = document.querySelector("#edit-date").value;
    const time = document.querySelector("#edit-time").value;
    const date_time = `${date} ${time}`;

    try {      
        const body = {id, activity_name, date_time};
        const response = await fetch(`./updateActivity/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
        destroyEditContainer();
        getActivities();
        destroyOverlay();
    } catch (err) {
        console.error(err.message)
    }
}

// Create a new activity
const renderNewActivity = () => {
    destroyEditContainer();
    destroyNewActivity();
    const newActivityContainer = document.createElement("div");
    newActivityContainer.id = "new-activity-container";

    const newActivityTitle = document.createElement("h2");
    newActivityTitle.id = "new-activity-title";
    newActivityTitle.innerHTML = "Create New Activity";
    newActivityContainer.appendChild(newActivityTitle);

    const newActivityInput = document.createElement("textarea");
    newActivityInput.id = "new-activity-input";
    newActivityInput.placeholder = "Create New Activity";
    newActivityContainer.appendChild(newActivityInput);

    const newActivityDate = document.createElement("input");
    newActivityDate.id = "new-activity-date-input";
    newActivityDate.type = "date";
    newActivityDate.required = true;
    newActivityContainer.appendChild(newActivityDate);

    const newActivityTime = document.createElement("input");
    newActivityTime.id = "new-activity-time-input";
    newActivityTime.type = "time";
    newActivityTime.required = true;
    newActivityContainer.appendChild(newActivityTime);

    const createActivitybuttonsContainer = document.createElement("div");
    createActivitybuttonsContainer.className = "create-buttons-container";
    newActivityContainer.appendChild(createActivitybuttonsContainer);

    const saveButton = document.createElement("button");
    saveButton.id = "save-activity-button";
    saveButton.innerHTML = "Save";
    createActivitybuttonsContainer.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-activity-button";
    cancelButton.innerHTML = "Cancel";
    createActivitybuttonsContainer.appendChild(cancelButton);

    wrapper.appendChild(newActivityContainer);

    saveButton.addEventListener('click', () => {
        // saveNewActivity();
        inputValidation("create");        
    })

    cancelButton.addEventListener('click', () => {
        destroyOverlay();
        destroyNewActivity();
    })
}

// Render the delete confirmation
const renderDeleteConfirmation = async (id) => {
    // Instantiates the DeleteMessage class and uses it to render a message
    const message = new DeleteMessage("Activity Deletion", `Are you sure you want to delete this activity?`, "Ok", "Cancel");
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
        deleteActivity(id);
    });
}

// Delete an activity
const deleteActivity = async (id) => {
    try {
        const deleteActivity = await fetch(`./deleteActivity/${id}`, {
            method: "DELETE"
        });
        destroyTableActivities(), getActivities();
    } catch (err) {
        console.error(err.message)
    }
    // Instantiates the ConfirmationMessage class and uses it to render a message
   const message = new ConfirmationMessage("Activity Deleted", `The activity with ID: ${id} has been deleted`, "Ok");
   message.renderMessage(message);
}

// Clear all the values in the activities table
const destroyTableActivities = () => {
    activitiesContainer.innerHTML = '';
}

// Remove the new activity container
const destroyNewActivity = () => {
    if(document.querySelector("#new-activity-container")){
        const newActivityContainer = document.querySelector("#new-activity-container");
        newActivityContainer.innerHTML = '';
        wrapper.removeChild(newActivityContainer);
    }
}

// Remove the edit activity container
const destroyEditContainer = () => {
    if(document.querySelector("#edit-activity-container")){
        const editActivityContainer = document.querySelector("#edit-activity-container");
        editActivityContainer.innerHTML = '';
        wrapper.removeChild(editActivityContainer);
    }
}

// Calls the function that renders the new activity container
createActivityButton.addEventListener('click', (e) => {
    e.preventDefault();
    applyOverlay();
    renderNewActivity();
})

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


// Validates that the important fields are not empty
const inputValidation = (origin, id) => {
    switch(origin){
        case (origin = "create"):
            if(
                document.querySelector("#new-activity-input").value == '' ||
                document.querySelector("#new-activity-date-input").value == '' ||
                document.querySelector("#new-activity-time-input").value == ''
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

                    document.getElementById("new-activity-container").classList.add("sub-wrapper-overlay");
                    document.getElementById("overlay").style.display = "block";
                    document.querySelector(".invalid-input button").addEventListener('click', () => {
                        wrapper.removeChild(invalidInput);
                        document.getElementById("new-activity-container").classList.remove("sub-wrapper-overlay");
                        document.getElementById("overlay").style.display = "none";
                        const buttons = document.querySelectorAll("button")
                        buttons.forEach(item => {
                            item.disabled = false;
                        });
                    })
                }
            else{
                saveNewActivity();
            }
            break;
        case(origin="update"):
        if(
            document.querySelector("#edit-activity-name").value == '' ||
            document.querySelector("#edit-date").value == '' ||
            document.querySelector("#edit-time").value == ''
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

                document.getElementById("edit-activity-container").classList.add("sub-wrapper-overlay");
                document.getElementById("overlay").style.display = "block";
                document.querySelector(".invalid-input button").addEventListener('click', () => {
                    wrapper.removeChild(invalidInput);
                    document.getElementById("edit-activity-container").classList.remove("sub-wrapper-overlay");
                    document.getElementById("overlay").style.display = "none";
                    const buttons = document.querySelectorAll("button")
                    buttons.forEach(item => {
                        item.disabled = false;
                    });
                })
            }
        else{
            updateActivity(id);
        }
        break;
    }
}

// Retrieves all the activities on start
getActivities();