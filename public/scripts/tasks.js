const wrapper = document.querySelector("#wrapper");
const tasksContainer = document.querySelector("#tasks-container");
const createTaskButton = document.querySelector("#create-task-button");

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
            const newRow = document.createElement("tr");

            const taskName = document.createElement("td");
            taskName.innerHTML = item.task_name;

            const assignedCook = document.createElement("td");
            assignedCook.innerHTML = item.assigned_cook;

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
            newRow.appendChild(editTaskButton);
            newRow.appendChild(deleteTaskButton);

            tableBody.appendChild(newRow);
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
                deleteTask(item.id);
            })
        });
    }
    catch(error){
        console.log(error.message);
    }
}

// Stores a new task in the database
const saveNewTask = async () => {
    const task_name = document.querySelector("#new-task-input").value;
    const assigned_cook = document.querySelector("#new-assigned-cook-input").value;

    try {
        const body = { task_name, assigned_cook };
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
    const taskToEdit = await getTaskToEdit(taskId);

    const editTaskContainer = document.createElement("div");
    editTaskContainer.id = "edit-task-container";

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

    console.log(id + task_name + assigned_cook);

    try {      
        const body = {id, task_name, assigned_cook};
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
}

// Create a new task
const createNewTask = () => {
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

// Delete a task
const deleteTask = async (id) => {
    try {
        const deleteTask = await fetch(`./deleteTask/${id}`, {
            method: "DELETE"
        });
        destroyTableTasks(), getTasks();
    } catch (err) {
        console.log(err.message)
    }
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

// Retrieves all the tasks on start
getTasks();

