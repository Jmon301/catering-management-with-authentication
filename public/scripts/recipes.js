const wrapper = document.querySelector("#wrapper");
const results = document.querySelector("#results");
const createRecipeButton = document.querySelector("#new-recipe-button");
const newRecipeButton = document.querySelector("#new-recipe-button");
const updateButton = document.querySelector("#update-button");

let deleteButtons;
let editButtons;
let recipeId;

// Global edit variables
let editRecipeObject = null;
let editIngredientsObject = null;
let editInstructionsObject = null;


// Get all recipes. Is called when the page loads, and again after the recipe, ingredients, instructions are stored in the database. From the addInstructions function
const getRecipes = async () => {
    results.innerHTML = "";
    try {
        const response = await fetch(`./getRecipes`);
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
        const response = await fetch(`./getRecipes/${recipeId}`);
        const jsonData = await response.json();  
        editRecipeObject = await jsonData;
    } catch (err) {
        console.error(err.message)
    }
    getIngredients(recipeId);
}

// Get the ingredients from the recipe to edit
const getIngredients = async (recipeId) => {
    try {
        const response = await fetch(`./getIngredients/${recipeId}`);
        const jsonData = await response.json();    
        editIngredientsObject = await jsonData;
    } catch (err) {
        console.error(err.message)
    }
    getInstructions(recipeId);
}

// Get the ingredients from the recipe to edit
const getInstructions = async (recipeId) => {
    try {
        const response = await fetch(`./getInstructions/${recipeId}`);
        const jsonData = await response.json();
        editInstructionsObject = await jsonData;
       
    } catch (err) {
        console.error(err.message)
    } 
    renderEditRecipe();  
}

// Create and fill up the fields to update
const renderEditRecipe = () => {
    console.log(editRecipeObject, editIngredientsObject, editInstructionsObject);

    const editContainer = document.createElement("div");
    editContainer.id = "edit-container";

    const editTitle = document.createElement("h2");
    editTitle.innerHTML = "Edit Recipe";
    editTitle.className = "edit-recipe-title";
    editContainer.appendChild(editTitle);

    const editForm = document.createElement("form");
    editForm.id = editRecipeObject.recipe_id;      

    const editInputRecipeName = document.createElement("input");
    editInputRecipeName.value = editRecipeObject.recipe_name;
    editInputRecipeName.type = "text";
    editInputRecipeName.id = "edit-recipe-name";
    editInputRecipeName.name = "recipe_name";
    editForm.appendChild(editInputRecipeName);

    const editInputRecipeDescription = document.createElement("input");
    editInputRecipeDescription.value = editRecipeObject.recipe_description;
    editInputRecipeDescription.type = "text";
    editInputRecipeDescription.id = "edit-recipe-description";
    editInputRecipeDescription.name = "recipe_description";
    editForm.appendChild(editInputRecipeDescription);

    const editInputRecipeCuisine = document.createElement("input");
    editInputRecipeCuisine.value = editRecipeObject.cuisine;
    editInputRecipeCuisine.type = "text";
    editInputRecipeCuisine.id = "edit-recipe-cuisine";
    editInputRecipeCuisine.name = "cuisine";
    editForm.appendChild(editInputRecipeCuisine);

    const editInputRecipeNotes = document.createElement("input");
    editInputRecipeNotes.value = editRecipeObject.notes;
    editInputRecipeNotes.type = "text";
    editInputRecipeNotes.id = "edit-recipe-notes";
    editInputRecipeNotes.name = "notes";
    editForm.appendChild(editInputRecipeNotes);

    // Ingredients section
    const editIngredientsContainer = document.createElement("div");

    const editIngredientTitle = document.createElement("h2");
    editIngredientTitle.innerHTML = "Ingredients";
    editIngredientsContainer.appendChild(editIngredientTitle);

    const addIngredientButton = document.createElement("button");
    addIngredientButton.innerHTML = "Add Ingredient";
    addIngredientButton.id = "add-ingredient-button";
    addIngredientButton.className = "add-ingredient-button"
    editIngredientsContainer.appendChild(addIngredientButton);

    editIngredientsObject.forEach(item => {
        const editIngredientContainer = document.createElement("div");
        editIngredientContainer.id = item.ingredient_id;

        const editIngredientQuantity = document.createElement("input");
        editIngredientQuantity.value = item.quantity;
        editIngredientQuantity.type = "text";
        editIngredientQuantity.id = `quantity-${item.ingredient_id}`;
        editIngredientContainer.appendChild(editIngredientQuantity);

        const editIngredientMeasure = document.createElement("input");
        editIngredientMeasure.value = item.measure;
        editIngredientMeasure.type = "text";
        editIngredientMeasure.id = `measure-${item.ingredient_id}`;
        editIngredientContainer.appendChild(editIngredientMeasure);

        const editIngredientName = document.createElement("input");
        editIngredientName.value = item.ingredient_name;
        editIngredientName.type = "text";
        editIngredientName.id = `ingredient-name-${item.ingredient_id}`;
        editIngredientContainer.appendChild(editIngredientName);

        const removeIngredientButton = document.createElement("button");
        removeIngredientButton.innerHTML = "Remove Ingredient";
        removeIngredientButton.id = "remove-ingredient-button";
        removeIngredientButton.className = "remove-ingredient-button"
        editIngredientContainer.appendChild(removeIngredientButton);

        editIngredientsContainer.appendChild(editIngredientContainer);
    });

    // Instructions section
    const editInstructionsContainer = document.createElement("div");

    const editInstructionTitle = document.createElement("h2");
    editInstructionTitle.innerHTML = "Instructions";
    editInstructionsContainer.appendChild(editInstructionTitle);

    const addInstructionButton = document.createElement("button");
    addInstructionButton.innerHTML = "Add Instruction";
    addInstructionButton.id = "add-instruction-button";
    addInstructionButton.className = "add-instruction-button"
    editInstructionsContainer.appendChild(addInstructionButton);

    editInstructionsObject.forEach(item => {
        const editInstructionContainer = document.createElement("div");
        editInstructionContainer.id = item.instruction_id;

        const editInstruction = document.createElement("input");
        editInstruction.value = item.instruction;
        editInstruction.type = "text";
        editInstruction.id = `instruction-${item.instruction_id}`;
        editInstructionContainer.appendChild(editInstruction);

        const removeInstructionButton = document.createElement("button");
        removeInstructionButton.innerHTML = "Remove Instruction";
        removeInstructionButton.id = "remove-Instruction-button";
        removeInstructionButton.className = "remove-Instruction-button"
        editInstructionContainer.appendChild(removeInstructionButton);

        editInstructionsContainer.appendChild(editInstructionContainer);
    });

    editForm.appendChild(editIngredientsContainer);
    editForm.appendChild(editInstructionsContainer);
    editContainer.appendChild(editForm);

    const updateButton = document.createElement("input");
    updateButton.type = "submit";
    updateButton.value = "Update"
    updateButton.id = "update-button";
    updateButton.className = "update-button"
    editContainer.appendChild(updateButton);

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.id = "cancel-button";
    cancelButton.className = "cancel-button"
    editContainer.appendChild(cancelButton);

    wrapper.appendChild(editContainer);

    // Detects a click to update a recipe
    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        editRecipe(recipeId);
    })

    // Detects a click to update a recipe
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();

    })
}

// Add a new ingredient container inside the new recipe container
const addIngredientContainer = () => {
    const ingredientsContainer = document.querySelector("#ingredients-container");    

    const newIngredientContainer = document.createElement("div");
    newIngredientContainer.id = "new-ingredient-container";

    const newIngredientQuantity = document.createElement("input");
    newIngredientQuantity.id = "#new-ingredient-quantity";
    newIngredientQuantity.placeholder = "Quantity";
    newIngredientQuantity.type = "text";
    newIngredientQuantity.name = "ingredient_quantity";
    newIngredientContainer.appendChild(newIngredientQuantity);

    const newIngredientMeasure = document.createElement("input");
    newIngredientMeasure.id = "#new-ingredient-measure";
    newIngredientMeasure.placeholder = "Ingredient measure";
    newIngredientMeasure.type = "text";
    newIngredientMeasure.name = "ingredient_measure";
    newIngredientContainer.appendChild(newIngredientMeasure);

    const newIngredientName = document.createElement("input");
    newIngredientName.id = "#new-ingredient-name";
    newIngredientName.placeholder = "Ingredient name";
    newIngredientName.type = "text";
    newIngredientName.name = "ingredient_name";
    newIngredientContainer.appendChild(newIngredientName);

    const removeIngredientButton = document.createElement("button");
    removeIngredientButton.innerHTML = "Remove Ingredient";
    removeIngredientButton.id = "remove-ingredient-button";
    removeIngredientButton.className = "remove-ingredient-button"
    newIngredientContainer.appendChild(removeIngredientButton);

    ingredientsContainer.appendChild(newIngredientContainer);

    // Detects a click to remove an ingredient
    removeIngredientButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentElement.remove();
    });
}

// Add a new instruction inside the new recipe container
const addInstructionContainer = () => {
    const instructionsContainer = document.querySelector("#instructions-container");

    const newInstructionContainer = document.createElement("div");
    newInstructionContainer.id="new-instruction-container";

    const newInstruction = document.createElement("input");
    newInstruction.id = "#new-instruction";
    newInstruction.placeholder = "Instruction";
    newInstruction.type = "text";
    newInstruction.name = "instruction";
    newInstructionContainer.appendChild(newInstruction);

    const removeInstructionButton = document.createElement("button");
    removeInstructionButton.innerHTML = "Remove Instruction";
    removeInstructionButton.id = "remove-instruction-button";
    removeInstructionButton.className = "remove-instruction-button"
    newInstructionContainer.appendChild(removeInstructionButton);

    instructionsContainer.appendChild(newInstructionContainer);

    // Detects a click to remove an instruction
    removeInstructionButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentElement.remove();
    });
}

// Create the new recipe section
const newRecipeSection = () => {
    try {
        const newRecipeContainer = document.createElement("div");
        newRecipeContainer.id = "new-recipe-container";

        const newRecipeTitle = document.createElement("h2");
        newRecipeTitle.innerHTML = "Create New Recipe";
        newRecipeTitle.className = "new-recipe-title";
        newRecipeContainer.appendChild(newRecipeTitle);

        const createRecipeForm = document.createElement("form");        

        const createInputRecipeName = document.createElement("input");
        createInputRecipeName.placeholder = "Recipe Name";
        createInputRecipeName.type = "text";
        createInputRecipeName.id = "recipe-name";
        createInputRecipeName.name = "recipe_name";
        createRecipeForm.appendChild(createInputRecipeName);

        const createInputRecipeDescription = document.createElement("input");
        createInputRecipeDescription.placeholder = "Description";
        createInputRecipeDescription.type = "text";
        createInputRecipeDescription.id = "recipe-description";
        createInputRecipeDescription.name = "recipe_description";
        createRecipeForm.appendChild(createInputRecipeDescription);

        const createInputRecipeCuisine = document.createElement("input");
        createInputRecipeCuisine.placeholder = "Cuisine";
        createInputRecipeCuisine.type = "text";
        createInputRecipeCuisine.id = "recipe-cuisine";
        createInputRecipeCuisine.name = "cuisine";
        createRecipeForm.appendChild(createInputRecipeCuisine);

        const createInputRecipeNotes = document.createElement("input");
        createInputRecipeNotes.placeholder = "Notes";
        createInputRecipeNotes.type = "text";
        createInputRecipeNotes.id = "recipe-notes";
        createInputRecipeNotes.name = "notes";
        createRecipeForm.appendChild(createInputRecipeNotes);

        newRecipeContainer.appendChild(createRecipeForm);

        const breakLine = document.createElement('br');
        newRecipeContainer.appendChild(breakLine);

        const breakLine2 = document.createElement('br');
        newRecipeContainer.appendChild(breakLine2);

        const ingredientsContainer = document.createElement("div");
        ingredientsContainer.id = "ingredients-container";
        ingredientsContainer.className = "ingredients-container";
        newRecipeContainer.appendChild(ingredientsContainer);

        const newIngredientButton = document.createElement("button");
        newIngredientButton.innerHTML = "Add Ingredient";
        newIngredientButton.id = "new-ingredient-button";
        newIngredientButton.className = "new-ingredient-button"
        ingredientsContainer.appendChild(newIngredientButton);

        const instructionsContainer = document.createElement("div");
        instructionsContainer.id = "instructions-container";
        instructionsContainer.className = "instructions-container";
        newRecipeContainer.appendChild(instructionsContainer);

        const newInstructionButton = document.createElement("button");
        newInstructionButton.innerHTML = "Add Instruction";
        newInstructionButton.id = "new-instruction-button";
        newInstructionButton.className = "new-instruction-button"
        instructionsContainer.appendChild(newInstructionButton);

        const breakLine3 = document.createElement('br');
        newRecipeContainer.appendChild(breakLine3);

        const saveRecipeButton = document.createElement("button");
        saveRecipeButton.innerHTML = "Save";
        saveRecipeButton.id = "save-recipe-button";
        saveRecipeButton.className = "save-recipe-button"
        newRecipeContainer.appendChild(saveRecipeButton);

        const cancelNewRecipeButton = document.createElement("button");
        cancelNewRecipeButton.innerHTML = "Cancel";
        cancelNewRecipeButton.id = "cancel-new-recipe-button";
        cancelNewRecipeButton.className = "cancel-button"
        newRecipeContainer.appendChild(cancelNewRecipeButton);

        wrapper.appendChild(newRecipeContainer);

        // Detects a click to save a recipe
        saveRecipeButton.addEventListener('click', (e) => {
            e.preventDefault();
            createRecipe();
        });

        // Detects a click to cancel the creation of the new recipe
        cancelNewRecipeButton.addEventListener('click', (e) => {
            e.preventDefault();
            wrapper.removeChild(newRecipeContainer); 
        });

        // Detects a click to add an ingredient
        newIngredientButton.addEventListener('click', (e) => {
            e.preventDefault();
            addIngredientContainer();
        });

        // Detects a click to add an instruction
        newInstructionButton.addEventListener('click', (e) => {
            e.preventDefault();
            addInstructionContainer();
        });
    } catch (err) {
        console.error(err.message)
    }
}

// Add ingredients to the ingredients table in the database
const addIngredients = async (quantity, measure, ingredient, recipe_id) => {
    try {
        const body = { recipe_id, quantity, measure, ingredient };
        const response  = await fetch("./addIngredients", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
    } catch (error) {
        console.error(error.message)
    }
}

// Gather all the ingredient containers, iterate over them extracting the ingredient values and send them to the addIngredients function
const addIngredientContainers = (recipe_id) => {
    const ingredientContainers = document.querySelectorAll("#new-ingredient-container");
    ingredientContainers.forEach(item => {
        const quantity = item.children[0].value;
        const measure = item.children[1].value;
        const ingredient = item.children[2].value;
        addIngredients(quantity, measure, ingredient, recipe_id);
    })
}

// Add instructions to the instructions table in the database
const addInstructions = async (instruction, recipe_id) => {
    try {
        const body = { recipe_id, instruction };
        const response  = await fetch("./addInstructions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }).then(()=> getRecipes());
    } catch (error) {
        console.error(error.message)
    }
}

// Gather all the instruction containers, iterate over them extracting the instruction values and send them to the addInstructions function
const addInstructionContainers = (recipe_id) => {
    const instructionContainers = document.querySelectorAll("#new-instruction-container");
    instructionContainers.forEach(item => {
        const instruction = item.children[0].value;
        addInstructions(instruction, recipe_id);
    })
}

// Create a recipe
const createRecipe = async (e) => {
    const newRecipeContainer = document.querySelector("#new-recipe-container");

    let recipe_id;

    const recipe_name = document.querySelector("#recipe-name").value;
    const recipe_description = document.querySelector("#recipe-description").value;
    const cuisine = document.querySelector("#recipe-cuisine").value;
    const notes = document.querySelector("#recipe-notes").value;

    try {
        // This will post to the path were the server is receiving requests. The const body takes the values and creates an object by using the curly braces
        const body = { recipe_name, recipe_description, cuisine, notes };
        const response  = await fetch("./createRecipes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then((result) => {
            return result.json()
        }).then((data) => {
            recipe_id = data.recipe_id;
            addIngredientContainers(recipe_id);
            addInstructionContainers(recipe_id);
        });

    wrapper.removeChild(newRecipeContainer); 

    } catch (error) {
        console.error(error.message)
    }
}

// Delete Recipe
const deleteRecipe = async (id) => {
    try {
        const deleteRecipe = await fetch(`./recipes/${id}`, {
            method: "DELETE"
        });
        getRecipes();
    } catch (err) {
        console.log(err.message)
    }
}

// Edit Recipe
const editRecipe = async (recipe_id) => {
    const recipe_name = document.querySelector("#edit-recipe-name").value;
    const recipe_description = document.querySelector("#edit-recipe-description").value;
    const cuisine = document.querySelector("#edit-recipe-cuisine").value;
    const notes = document.querySelector("#edit-recipe-notes").value;
    try {      
        console.log(recipe_id + " -- " + recipe_name + " -- " + recipe_description + " -- " + cuisine + " -- " + notes)

        const body = {recipe_id, recipe_name, recipe_description, cuisine, notes};
        const response = await fetch(`./recipes/${recipe_id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
    } catch (err) {
        console.error(err.message)
    }
}

// Get recipes on start
getRecipes();

// Detect a click to open the create recipe section
newRecipeButton.addEventListener('click', (e) => {
    e.preventDefault();
    newRecipeSection();
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
        getARecipe(recipeId);
    }))
}


