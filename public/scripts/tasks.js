const wrapper = document.querySelector("#wrapper");
const tasksContainer = document.querySelector("#tasks-container");
const createTaskButton = document.querySelector("#create-task-button");
const reportsButton = document.querySelector("#reports-button");

// Retrieve all the tasks from the database
const getTasks = async () => {
    destroyTableTasks();
    const table = 
        `<table id="table">
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Assigned Cook</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        `;

        const tasksTable = document.createElement("div");
        tasksTable.innerHTML = table;
        tasksContainer.appendChild(tasksTable);

    try {
        const response = await fetch("./getTasks");
        const jsonData = await response.json();

        const tableBody = document.querySelector("#table-body");

        jsonData.forEach(item =>{
            if(item.completed === true){
                return;
            }
            const newRow = document.createElement("tr");

            const taskName = document.createElement("td");
            taskName.innerHTML = item.task_name;

            const assignedCook = document.createElement("td");
            assignedCook.innerHTML = item.assigned_cook;

            const completeTaskButton = document.createElement("button");
            completeTaskButton.innerHTML = "Completed";
            completeTaskButton.className = "complete-task-button";
            completeTaskButton.id = item.task_id;

            const editTaskButton = document.createElement("button");
            editTaskButton.innerHTML = "Edit";
            editTaskButton.className = "edit-task-button";
            editTaskButton.id = item.task_id;

            const deleteTaskButton = document.createElement("button");
            deleteTaskButton.innerHTML = "Delete";
            deleteTaskButton.className = "delete-task-button";
            deleteTaskButton.id = item.task_id;

            newRow.appendChild(taskName);
            newRow.appendChild(assignedCook);
            newRow.appendChild(completeTaskButton);
            newRow.appendChild(editTaskButton);
            newRow.appendChild(deleteTaskButton);

            tableBody.appendChild(newRow);
        });

        const allCompleteButtons = document.querySelectorAll(".complete-task-button");
        allCompleteButtons.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                completeTask(item.id);
            })
        });

        const allEditButtons = document.querySelectorAll(".edit-task-button");
        allEditButtons.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                renderEditTask(item.id);
            })
        });

        const allDeleteButtons = document.querySelectorAll(".delete-task-button");
        allDeleteButtons.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                renderDeleteConfirmation(item.id);
            })
        });
    }
    catch(error){
        console.error(error.message);
    }
}

// Stores a new task in the database
const saveNewTask = async () => {
    const task_name = document.querySelector("#new-task-input").value;
    const assigned_cook = document.querySelector("#new-assigned-cook-input").value;
    const timeNow = Date.now();
    const timestampNow = new Date(timeNow);
    const date = timestampNow.toLocaleDateString();
    const time = timestampNow.toLocaleTimeString();
    const timestamp = `${date} ${time}`;
    const completed = false;

    try {
        const body = { task_name, assigned_cook, timestamp, completed };
        const response  = await fetch("./addTask", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
    destroyNewTask();
    getTasks();
    } catch (error) {
        console.error(error.message)
    }

    // Instantiates the ConfirmationMessage class and uses it to render a message
    const message = new ConfirmationMessage("New Task", `The task ${task_name} has been created`, "Ok");
    message.renderMessage(message);

}

// Retrieves the task to edit
const getTaskToEdit = async (id) => {
    try {
        const response = await fetch(`./getTask/${id}`);
        const jsonData = await response.json();
        return jsonData;
    } catch (err) {
        console.error(err.message)
    }
}

// Renders the task edition section
const renderEditTask = async (taskId) => {
    destroyNewTask();
    destroyEditContainer();

    const taskToEdit = await getTaskToEdit(taskId);

    const editTaskContainer = document.createElement("div");
    editTaskContainer.id = "edit-task-container";

    const editTaskTitle = document.createElement("h2");
    editTaskTitle.id = "edit-task-title";
    editTaskTitle.innerHTML = "Edit Task";
    editTaskContainer.appendChild(editTaskTitle);

    const editTaskName = document.createElement("input");
    editTaskName.id = "edit-task-name";
    editTaskName.value = taskToEdit.task_name;
    editTaskContainer.appendChild(editTaskName);

    const editAssignedCook = document.createElement("input");
    editAssignedCook.id = "edit-assigned-cook";
    editAssignedCook.value = taskToEdit.assigned_cook;
    editTaskContainer.appendChild(editAssignedCook);

    const updateTaskButton = document.createElement("button");
    updateTaskButton.id = "update-task-button";
    updateTaskButton.innerHTML = "Save";
    editTaskContainer.appendChild(updateTaskButton);

    const cancelUpdate = document.createElement("button");
    cancelUpdate.id = "cancel-update-button";
    cancelUpdate.innerHTML = "Cancel";
    editTaskContainer.appendChild(cancelUpdate);

    wrapper.appendChild(editTaskContainer);

    updateTaskButton.addEventListener('click', (e) => {
       e.preventDefault();
        updateTask(taskId);
    });

    cancelUpdate.addEventListener('click', () => {
        e.preventDefault();
        destroyEditContainer();
     });

}

// Updates the task in the database
const updateTask = async (id) => {
    const task_name = document.querySelector("#edit-task-name").value;
    const assigned_cook = document.querySelector("#edit-assigned-cook").value;
    const completed = false;

    try {      
        const body = {id, task_name, assigned_cook, completed};
        const response = await fetch(`./updateTask/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(() => {
            destroyEditContainer();
            getTasks();
        })
    } catch (err) {
        console.error(err.message)
    }

    // Instantiates the ConfirmationMessage class and uses it to render a message
    const message = new ConfirmationMessage("Task Updated", `The task with ID: ${id} has been updated`, "Ok");
    message.renderMessage(message);
}

// Create a new task
const createNewTask = () => {
    destroyNewTask();
    destroyEditContainer();
    destroyReports();

    const newTaskContainer = document.createElement("div");
    newTaskContainer.id = "new-task-container";

    const newTaskTitle = document.createElement("h2");
    newTaskTitle.id = "new-task-title";
    newTaskTitle.innerHTML = "Create New Task";
    newTaskContainer.appendChild(newTaskTitle);

    const newTaskInput = document.createElement("input");
    newTaskInput.id = "new-task-input";
    newTaskInput.placeholder = "Create New Task";
    newTaskContainer.appendChild(newTaskInput);

    const newTaskAssignedCook = document.createElement("input");
    newTaskAssignedCook.id = "new-assigned-cook-input";
    newTaskAssignedCook.placeholder = "Assigned Cook";
    newTaskContainer.appendChild(newTaskAssignedCook);

    const saveButton = document.createElement("button");
    saveButton.id = "save-task-button";
    saveButton.innerHTML = "Save";
    newTaskContainer.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-task-button";
    cancelButton.innerHTML = "Cancel";
    newTaskContainer.appendChild(cancelButton);

    wrapper.appendChild(newTaskContainer);

    saveButton.addEventListener('click', () => {
        saveNewTask();
    })

    cancelButton.addEventListener('click', () => {
        destroyNewTask();
    })
}

// completeTask is triggered when a task is completed. Removes it from the list and changes its status in the database to completed
const completeTask = async (id) => {
    try {      
        const body = {id};
        const response = await fetch(`./updateTaskStatus/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then(() => {
            getTasks();
        })
    } catch (err) {
        console.error(err.message)
    }
}

// Render the delete confirmation
const renderDeleteConfirmation = async (id) => {
    // Instantiates the DeleteMessage class and uses it to render a message
    const message = new DeleteMessage("Task Deletion", `Are you sure you want to delete this task?`, "Ok", "Cancel");
    message.renderMessage(message);

    const messageContainer = document.querySelector("#delete-message-container");
    const cancelButton = document.querySelector("#message-cancel-button");
    const confirmationButton = document.querySelector("#message-confirmation-button");
    cancelButton.addEventListener('click', () => {
        wrapper.removeChild(messageContainer);
        return;
    });

    confirmationButton.addEventListener('click', () => {
        wrapper.removeChild(messageContainer);
        deleteTask(id);
    });
}

// Delete task from the database
const deleteTask = async (id) =>{
    try {
        const deleteTask = await fetch(`./deleteTask/${id}`, {
            method: "DELETE"
        });
        destroyTableTasks(), getTasks();
    } catch (err) {
        console.error(err.message)
    }
    // Instantiates the ConfirmationMessage class and uses it to render a message
   const message = new ConfirmationMessage("Task Deleted", `The task with ID: ${id} has been deleted`, "Ok");
   message.renderMessage(message);
}

// Clear all the values in the tasks table
const destroyTableTasks = () => {
    tasksContainer.innerHTML = '';
}

// Remove the new task container
const destroyNewTask = () => {
    if(document.querySelector("#new-task-container")){
        const newTaskContainer = document.querySelector("#new-task-container");
        newTaskContainer.innerHTML = '';
        wrapper.removeChild(newTaskContainer);
    }
}

// Remove the edit task container
const destroyEditContainer = () => {
    if(document.querySelector("#edit-task-container")){
        const editTaskContainer = document.querySelector("#edit-task-container");
        editTaskContainer.innerHTML = '';
        wrapper.removeChild(editTaskContainer);
    }
}

// Calls the function that renders the new task container
createTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    createNewTask();
})

const getCompletedTasks = async () => {
    try {
        const response = await fetch("./getCompletedTasks");
        const jsonData = await response.json();
        return jsonData  
    }
    catch(error){
        console.error(error.message);
    }
}

// Render the reports section
const renderReports = async () => {
    const reportsContainer = document.createElement("div");
    reportsContainer.id = "reports-container";
    const content = 
    `
        <h2>Completed Tasks</h2>
        <table id="report-table">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Assigned Cook</th>
                    <th>Date and Time of Completion</th>
                </tr>
            </thead>
            <tbody id="report-table-body">
            </tbody>
        </table>
        <button id="close-report-button">Close</button>
    `;
    const reportContent = document.createElement("div");
    reportContent.innerHTML = content;
    reportsContainer.appendChild(reportContent);
    const data = await getCompletedTasks();

    wrapper.appendChild(reportsContainer);
    let tableBody = document.querySelector("#report-table-body");
    
    data.forEach(item => {
        if(item.completed == false){
            return
        }

        const dateAndTime = new Date(item.time_completed);
        const year = dateAndTime.getFullYear();
        const month = dateAndTime.toLocaleString("en-US", { month: "short" });
        const day = dateAndTime.getDate(); 
        const date = `${month}-${day}-${year}`;
        const formattedTime = dateAndTime.toTimeString();
        const time = formattedTime.substring(0, 5);

        const newRow = 
        `            
            <td>${item.task_name}</td>
            <td>${item.assigned_cook}</td>
            <td>${date} - ${time}</td>
            <td><button class="delete-completed-task-button" id="${item.task_id}">Delete task</td>
        `;
        const newRowContent = document.createElement("tr");
        newRowContent.innerHTML = newRow;
        tableBody.appendChild(newRowContent);  
    });

    const deleteButton = document.querySelectorAll(".delete-completed-task-button");
    deleteButton.forEach(item => {
        item.addEventListener('click', () => {
            deleteTask(item.id);
            destroyReports();
            renderReports();
        })
    })

    const closeButton = document.querySelector("#close-report-button");
    closeButton.addEventListener('click', () => {
        destroyReports();
    })
}

// Removes the reports container
const destroyReports = () => {
    if(document.querySelector("#reports-container")){
        const reportsContainer = document.querySelector("#reports-container");
        wrapper.removeChild(reportsContainer);
    }
}

// Detects a click to open the report section
reportsButton.addEventListener('click', () => {
    destroyReports();
    destroyEditContainer();
    destroyNewTask();
    renderReports();
})

// Retrieves all the tasks on start
getTasks();

