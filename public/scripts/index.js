const results = document.querySelector("#results");
const saveButton = document.querySelector("#save-button");
const submitForm = document.querySelector("#submit-recipe");

const recipeName = document.querySelector("#edit-recipe-name");
const recipeDescription = document.querySelector("#edit-recipe-description");
const recipeCuisine = document.querySelector("#edit-recipe-cuisine");
const recipeNotes = document.querySelector("#edit-recipe-notes");

const updateButton = document.querySelector("#update-button");

let deleteButtons;
let editButtons;

let recipeId;

// Get all recipes
const getRecipes = async () => {
    results.innerHTML = "";
    try {
        const response = await fetch("http://localhost:3000/getRecipes");
        const jsonData = await response.json();
        
        // Iterates over the results adding them to the results container
        jsonData.forEach(item =>{
            const container = document.createElement("div");
            container.innerHTML = item.recipe_name;

            const deleteButton = document.createElement("span");
            deleteButton.innerHTML = "--Delete";
            deleteButton.id = item.recipe_id;
            deleteButton.className = "delete-button";

            const editButton = document.createElement("span");
            editButton.innerHTML = "--Edit";
            editButton.id = item.recipe_id;
            editButton.className = "edit-button";

            results.appendChild(container);
            container.appendChild(deleteButton);
            container.appendChild(editButton);

        });

        deleteButtons = document.querySelectorAll(".delete-button");    
        editButtons = document.querySelectorAll(".edit-button"); 
        
        assignDeleteEventListeners();
        assignEditEventListeners();
    } catch (err) {
        console.error(err.message)
    }
}

// Get a recipe to edit
// Fills out the edit fields with the object that was fetched from the database
const getARecipe = async (recipeId) => {
    try {
        const response = await fetch(`http://localhost:3000/getRecipes/${recipeId}`);
        const jsonData = await response.json();

        recipeName.value = jsonData.recipe_name;
        recipeDescription.value = jsonData.recipe_description;
        recipeCuisine.value = jsonData.cuisine;
        recipeNotes.value = jsonData.notes;

    } catch (err) {
        console.error(err.message)
    }
}

// Create a recipe
const onSubmitForm = async (e) => {
    try {
        const recipeName = document.querySelector("#recipe-name").value;
        const recipeDescription = document.querySelector("#recipe-description").value;
        const recipeCuisine = document.querySelector("#recipe-cuisine").value;
        const recipeNotes = document.querySelector("#recipe-notes").value;

        // This will post to the path were the server is receiving requests. The const body takes the values and creates an object by using the curly braces
        const body = { recipeName, recipeDescription, recipeCuisine, recipeNotes };
        const response  = await fetch("http://localhost:3000/createRecipes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        console.log(body);
    } catch (error) {
        console.error(error.message)
    }     
}

// Delete Recipe
const deleteRecipe = async (id) => {
    try {
        const deleteRecipe = await fetch(`http://localhost:3000/recipes/${id}`, {
            method: "DELETE"
        });
        getRecipes();
    } catch (err) {
        console.log(err.message)
    }
}

// Edit Recipe
const editRecipe = async (recipeId) => {
    try {      
        recipeNameValue = recipeName.value;
        recipeDescriptionValue = recipeDescription.value;
        recipeCuisineValue = recipeCuisine.value;
        recipeNotesValue = recipeNotes.value

        const body = { recipeId, recipeNameValue, recipeDescriptionValue, recipeCuisineValue, recipeNotesValue};
        const response = await fetch(`http://localhost:3000/recipes/${recipeId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
  
    } catch (err) {
        console.error(err.message)
    }
}

// Get recipes on start
getRecipes();

// Detect a click to save a new recipe
saveButton.addEventListener('click', (e) => {
    e.preventDefault();
     onSubmitForm();
});

// Detects a click to delete a recipe
const assignDeleteEventListeners = () => {
    deleteButtons.forEach(item => item.addEventListener('click', (e) => {
        const recipeId = item.id;
        deleteRecipe(recipeId)
    }))
}

// Detects a click to edit a recipe
const assignEditEventListeners = () => {
    editButtons.forEach(item => item.addEventListener('click', (e) => {
        recipeId = item.id;
        getARecipe(recipeId)
    }))
}

// Detects a click to update a recipe
updateButton.addEventListener('click', (e) => {
    e.preventDefault();
    editRecipe(recipeId);
})
