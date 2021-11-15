const wrapper = document.querySelector("#wrapper");
const results = document.querySelector("#results"); 
const createRecipeButton = document.querySelector("#new-recipe-button");
const newRecipeButton = document.querySelector("#new-recipe-button");
const updateButton = document.querySelector("#update-button");
let deleteButtons;
let editButtons;
let recipeNames;
let recipeId;

// Global edit variables
let editRecipeObject = null;
let editIngredientsObject = null;
let editInstructionsObject = null;
let allRecipesByName;
let filteredRecipes;

// Get all recipes. Is called when the page loads, and again after the recipe, ingredients, instructions are stored in the database. From the addInstructions function
const getRecipes = async () => {
    try {
        const response = await fetch("./getRecipeNames");
        const jsonData = await response.json();
        allRecipesByName = await jsonData;
        
        // Iterates over the results adding them to the results container
        jsonData.forEach(item =>{
        const container = document.createElement("div");
        container.id = "recipe-container";
        
            content = 
            `
                <h2 id="${item.recipe_id}" class="recipe-title">${item.recipe_name}</h2>
                <div id="recipe-info">
                    <span><b>Description:</b> ${item.recipe_description}</span><br><br>
                    <span><b>Cuisine:</b> ${item.cuisine}</span>
                </div>
                <div id="recipe-buttons">
                    <button id="${item.recipe_id}" class="recipe-details">Details</button>
                    <div>
                        <span id="${item.recipe_id}" class="edit-button">Edit</span>
                        <span id="${item.recipe_id}" class="delete-button">Delete</span>
                    </div>
                </div>
            `;
            container.innerHTML = content;
            results.appendChild(container);
        });

        deleteButtons = document.querySelectorAll(".delete-button");    
        editButtons = document.querySelectorAll(".edit-button"); 
        recipeNames = document.querySelectorAll(".recipe-details");
        
        assignDeleteEventListeners();
        assignEditEventListeners();
        assignRecipeNamesEventListeners();
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

// Add a new ingredient container inside the edit recipe container
const addEditIngredientContainer = () => {
    const ingredientsContainer = document.querySelector("#edit-ingredients-container");    
    const editIngredientContainer = document.createElement("div");
    editIngredientContainer.className = "edit-ingredient-container";

    const editIngredientQuantity = document.createElement("input");
    editIngredientQuantity.id = "new-ingredient-quantity";
    editIngredientQuantity.placeholder = "Quantity";
    editIngredientQuantity.type = "number";
    editIngredientQuantity.name = "ingredient_quantity";
    editIngredientQuantity.required = true;
    editIngredientContainer.appendChild(editIngredientQuantity);

    const editIngredientMeasure = document.createElement("input");
    editIngredientMeasure.id = "new-ingredient-measure";
    editIngredientMeasure.placeholder = "Measure";
    editIngredientMeasure.type = "text";
    editIngredientMeasure.name = "ingredient_measure";
    editIngredientMeasure.required = true;
    editIngredientContainer.appendChild(editIngredientMeasure);

    const editIngredientName = document.createElement("input");
    editIngredientName.id = "new-ingredient-name";
    editIngredientName.placeholder = "Ingredient";
    editIngredientName.type = "text";
    editIngredientName.name = "ingredient_name";
    editIngredientName.required = true;
    editIngredientContainer.appendChild(editIngredientName);

    const removeIngredientButton = document.createElement("button");
    removeIngredientButton.innerHTML = "Remove";
    removeIngredientButton.id = "remove-ingredient-button";
    removeIngredientButton.className = "remove-ingredient-button"
    editIngredientContainer.appendChild(removeIngredientButton);

    ingredientsContainer.appendChild(editIngredientContainer);

    // Detects a click to remove an ingredient
    removeIngredientButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentElement.remove();
    });
}

// Add a new instruction inside the edit recipe container
const addEditInstructionContainer = () => {
    const instructionsContainer = document.querySelector("#edit-instructions-container");

    const newInstructionContainer = document.createElement("div");
    newInstructionContainer.className = "edit-instruction-container";

    const newInstruction = document.createElement("input");
    newInstruction.id = "#new-instruction";
    newInstruction.placeholder = "Instruction";
    newInstruction.type = "text";
    newInstruction.name = "instruction";
    newInstruction.required = true;
    newInstructionContainer.appendChild(newInstruction);

    const removeInstructionButton = document.createElement("button");
    removeInstructionButton.innerHTML = "Remove";
    removeInstructionButton.id = "remove-instruction-button";
    removeInstructionButton.className = "remove-instruction-button"
    newInstructionContainer.appendChild(removeInstructionButton);

    instructionsContainer.appendChild(newInstructionContainer);

    removeInstructionButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentElement.remove();
    });
}

// Create and fill up the fields to update
const renderEditRecipe = () => {
    applyOverlay();
    const editContainer = document.createElement("div");
    editContainer.id = "edit-container";

    const formContainer = document.createElement("div");
    formContainer.id = "edit-form-container";

    const editTitle = document.createElement("h2");
    editTitle.innerHTML = "Edit Recipe";
    editTitle.className = "edit-recipe-title";
    editContainer.appendChild(editTitle);

    const editInputRecipeName = document.createElement("input");
    editInputRecipeName.value = editRecipeObject.recipe_name;
    editInputRecipeName.type = "text";
    editInputRecipeName.id = "edit-recipe-name";
    editInputRecipeName.name = "recipe_name";
    editInputRecipeName.required = true;
    formContainer.appendChild(editInputRecipeName);

    const editInputRecipeDescription = document.createElement("input");
    editInputRecipeDescription.value = editRecipeObject.recipe_description;
    editInputRecipeDescription.type = "text";
    editInputRecipeDescription.id = "edit-recipe-description";
    editInputRecipeDescription.name = "recipe_description";
    editInputRecipeDescription.required = true;
    formContainer.appendChild(editInputRecipeDescription);

    const editInputRecipeCuisine = document.createElement("input");
    editInputRecipeCuisine.value = editRecipeObject.cuisine;
    editInputRecipeCuisine.type = "text";
    editInputRecipeCuisine.id = "edit-recipe-cuisine";
    editInputRecipeCuisine.name = "cuisine";
    editInputRecipeCuisine.required = true;
    formContainer.appendChild(editInputRecipeCuisine);

    const editInputRecipeNotes = document.createElement("textarea");
    editInputRecipeNotes.innerHTML = editRecipeObject.notes;
    editInputRecipeNotes.id = "edit-recipe-notes";
    editInputRecipeNotes.rows = "3";
    formContainer.appendChild(editInputRecipeNotes);

    editContainer.appendChild(formContainer);

    const addIngredientButton = document.createElement("button");
    addIngredientButton.innerHTML = "Add Ingredient";
    addIngredientButton.id = "add-ingredient-button";
    addIngredientButton.className = "add-ingredient-button"
    editContainer.appendChild(addIngredientButton);

    const editIngredientsContainer = document.createElement("div");
    editIngredientsContainer.id = "edit-ingredients-container";
    editIngredientsContainer.className = "none";
    editContainer.appendChild(editIngredientsContainer);

    editIngredientsObject.forEach(item => {
        const editIngredientContainer = document.createElement("div");
        editIngredientContainer.className = "edit-ingredient-container";
        editIngredientContainer.id = item.ingredient_id;

        const editIngredientQuantity = document.createElement("input");
        editIngredientQuantity.value = item.quantity;
        editIngredientQuantity.type = "number";
        editIngredientQuantity.id = "edit-ingredient-quantity";
        editIngredientQuantity.required = true;
        editIngredientContainer.appendChild(editIngredientQuantity);

        const editIngredientMeasure = document.createElement("input");
        editIngredientMeasure.value = item.measure;
        editIngredientMeasure.type = "text";
        editIngredientMeasure.id = "edit-ingredient-measure";
        editIngredientMeasure.required = true;
        editIngredientContainer.appendChild(editIngredientMeasure);

        const editIngredientName = document.createElement("input");
        editIngredientName.value = item.ingredient_name;
        editIngredientName.type = "text";
        editIngredientName.id = "edit-ingredient-name";
        editIngredientName.required = true;
        editIngredientContainer.appendChild(editIngredientName);

        const removeIngredientButton = document.createElement("button");
        removeIngredientButton.innerHTML = "Remove";
        removeIngredientButton.id = "remove-ingredient-button";
        removeIngredientButton.className = "remove-ingredient-button"
        editIngredientContainer.appendChild(removeIngredientButton);

        editIngredientsContainer.appendChild(editIngredientContainer);
    }); 

    // Detects a click to add an ingredient
    addIngredientButton.addEventListener('click', (e) => {
        e.preventDefault();
        removeEmptyContainerClass("edit-ingredients");
        addEditIngredientContainer();
    });

    const addInstructionButton = document.createElement("button");
    addInstructionButton.innerHTML = "Add Instruction";
    addInstructionButton.id = "add-instruction-button";
    addInstructionButton.className = "add-instruction-button"
    editContainer.appendChild(addInstructionButton);

    const editInstructionsContainer = document.createElement("div");
    editInstructionsContainer.id = "edit-instructions-container";
    editInstructionsContainer.className = "none";
    editContainer.appendChild(editInstructionsContainer);

    editInstructionsObject.forEach(item => {
        const editInstructionContainer = document.createElement("div");
        editInstructionContainer.className = "edit-instruction-container";
        editInstructionContainer.id = item.instruction_id;
       
        const editInstruction = document.createElement("input");
        editInstruction.value = item.instruction;
        editInstruction.type = "text";
        editInstruction.id = `instruction-${item.instruction_id}`;
        editInstruction.required = true;
        editInstructionContainer.appendChild(editInstruction);

        const removeInstructionButton = document.createElement("button");
        removeInstructionButton.innerHTML = "Remove";
        removeInstructionButton.id = "remove-instruction-button";
        removeInstructionButton.className = "remove-instruction-button"
        editInstructionContainer.appendChild(removeInstructionButton);

        editInstructionsContainer.appendChild(editInstructionContainer);
    });

    // Detects a click to add an ingredient
    addInstructionButton.addEventListener('click', (e) => {
        e.preventDefault();
        removeEmptyContainerClass("edit-instruction");
        addEditInstructionContainer();
    });

    const buttonsContainer = document.createElement("div");
    buttonsContainer.id = "recipe-buttons-container"

    const updateButton = document.createElement("button");
    updateButton.innerHTML = "Update"
    updateButton.id = "update-button";
    updateButton.className = "update-button"
    buttonsContainer.appendChild(updateButton);

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.id = "cancel-button";
    cancelButton.className = "cancel-button"
    buttonsContainer.appendChild(cancelButton);

    editContainer.appendChild(buttonsContainer);

    wrapper.appendChild(editContainer);
    checkEmptyContainer("edit-ingredient");
    checkEmptyContainer("edit-instruction");

    // Detects a click to remove an ingredient
    if(document.querySelector("#edit-ingredients-container")){
        const removeIngredient = document.querySelectorAll("#remove-ingredient-button");
        removeIngredient.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.target.parentElement.remove();
                checkEmptyContainer("edit-ingredient");
            });
        })
    }

    // Detects a click to remove an instruction
    if(document.querySelector("#edit-instructions-container")){
        const removeInstruction = document.querySelectorAll("#remove-instruction-button");
        removeInstruction.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.target.parentElement.remove();
                checkEmptyContainer("edit-instruction");
            });
        })
    }

    // Detects a click to update a recipe
    updateButton.addEventListener('click', (e) => {
        e.preventDefault();
        editRecipe(recipeId);
    })

    // Detects a click to update a recipe
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        destroyOverlay();
        destroyEditContainer();
    })
}

// Add a new ingredient container inside the new recipe container
const addIngredientContainer = () => {
    const ingredientsContainer = document.querySelector("#ingredients-container");    

    const newIngredientContainer = document.createElement("div");
    newIngredientContainer.id = "new-ingredient-container";

    const newIngredientQuantity = document.createElement("input");
    newIngredientQuantity.id = "new-ingredient-quantity";
    newIngredientQuantity.placeholder = "Quantity";
    newIngredientQuantity.type = "number";
    newIngredientQuantity.name = "ingredient_quantity";
    newIngredientQuantity.required = true;
    newIngredientContainer.appendChild(newIngredientQuantity);

    const newIngredientMeasure = document.createElement("input");
    newIngredientMeasure.id = "new-ingredient-measure";
    newIngredientMeasure.placeholder = "Measure";
    newIngredientMeasure.type = "text";
    newIngredientMeasure.name = "ingredient_measure";
    newIngredientMeasure.required = true;
    newIngredientContainer.appendChild(newIngredientMeasure);

    const newIngredientName = document.createElement("input");
    newIngredientName.id = "new-ingredient-name";
    newIngredientName.placeholder = "Ingredient";
    newIngredientName.type = "text";
    newIngredientName.name = "ingredient_name";
    newIngredientName.required = true;
    newIngredientContainer.appendChild(newIngredientName);

    const removeIngredientButton = document.createElement("button");
    removeIngredientButton.innerHTML = "Remove";
    removeIngredientButton.id = "remove-ingredient-button";
    removeIngredientButton.className = "remove-ingredient-button"
    newIngredientContainer.appendChild(removeIngredientButton);

    ingredientsContainer.appendChild(newIngredientContainer);

    // Detects a click to remove an ingredient
    removeIngredientButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentElement.remove();
        checkEmptyContainer("ingredient");
    });
}

// Add a new instruction inside the new recipe container
const addInstructionContainer = () => {
    const instructionsContainer = document.querySelector("#instructions-container");

    const newInstructionContainer = document.createElement("div");
    newInstructionContainer.id="new-instruction-container";

    const newInstruction = document.createElement("input");
    newInstruction.id = "new-instruction";
    newInstruction.placeholder = "Instruction";
    newInstruction.type = "text";
    newInstruction.name = "instruction";
    newInstruction.required = true;
    newInstructionContainer.appendChild(newInstruction);

    const removeInstructionButton = document.createElement("button");
    removeInstructionButton.innerHTML = "Remove";
    removeInstructionButton.id = "remove-instruction-button";
    removeInstructionButton.className = "remove-instruction-button"
    newInstructionContainer.appendChild(removeInstructionButton);

    instructionsContainer.appendChild(newInstructionContainer);

    // Detects a click to remove an instruction
    removeInstructionButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.target.parentElement.remove();
        checkEmptyContainer("instruction");
    });
}

// Check if the ingredients and instructions container is empty
const checkEmptyContainer = (type) => {
    if(type == "ingredient"){
        const ingredientsContainer = document.querySelector("#ingredients-container");
        if(ingredientsContainer.innerHTML == ""){
            ingredientsContainer.classList.add("empty-container");
        }
    }else if(type == "instruction"){
        const instructionsContainer = document.querySelector("#instructions-container");
        if(instructionsContainer.innerHTML == ""){
            instructionsContainer.classList.add("empty-container");
        }
    }else if(type == "edit-ingredient"){
        const editIngredientsContainer = document.querySelector("#edit-ingredients-container");
        if(editIngredientsContainer.innerHTML == ""){
            editIngredientsContainer.classList.add("empty-container");
        }
    }else{
        const editInstructionsContainer = document.querySelector("#edit-instructions-container");
        if(editInstructionsContainer.innerHTML == ""){
            editInstructionsContainer.classList.add("empty-container");
        }
    }
}

// Removes the class that sets the ingredients and instructions containers to a height 0
const removeEmptyContainerClass = (type) => {
    if(type == "ingredient"){
        const ingredientsContainer = document.querySelector("#ingredients-container");
        ingredientsContainer.classList.remove("empty-container");
    }else if(type == "instruction"){
        const instructionsContainer = document.querySelector("#instructions-container");
        instructionsContainer.classList.remove("empty-container");
    }else if(type == "edit-instruction"){
        const editInstructionsContainer = document.querySelector("#edit-instructions-container");
        editInstructionsContainer.classList.remove("empty-container");
    }else{
        const editIngredientsContainer = document.querySelector("#edit-ingredients-container");
        editIngredientsContainer.classList.remove("empty-container");
    }
}

// Create the new recipe section
const renderNewRecipe = () => {
    applyOverlay();
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
        createInputRecipeName.required = true;
        createRecipeForm.appendChild(createInputRecipeName);

        const createInputRecipeDescription = document.createElement("input");
        createInputRecipeDescription.placeholder = "Description";
        createInputRecipeDescription.type = "text";
        createInputRecipeDescription.id = "recipe-description";
        createInputRecipeDescription.name = "recipe_description";
        createInputRecipeName.required = true;
        createRecipeForm.appendChild(createInputRecipeDescription);

        const createInputRecipeCuisine = document.createElement("input");
        createInputRecipeCuisine.placeholder = "Cuisine";
        createInputRecipeCuisine.type = "text";
        createInputRecipeCuisine.id = "recipe-cuisine";
        createInputRecipeCuisine.name = "cuisine";
        createInputRecipeCuisine.required = true;
        createRecipeForm.appendChild(createInputRecipeCuisine);

        const createInputRecipeNotes = document.createElement("textarea");
        createInputRecipeNotes.placeholder = "Notes";
        createInputRecipeNotes.id = "recipe-notes";
        createInputRecipeNotes.name = "notes";
        createRecipeForm.appendChild(createInputRecipeNotes);

        newRecipeContainer.appendChild(createRecipeForm);

        const newIngredientButton = document.createElement("button");
        newIngredientButton.innerHTML = "Add Ingredient";
        newIngredientButton.id = "new-ingredient-button";
        newIngredientButton.className = "new-ingredient-button"
        newRecipeContainer.appendChild(newIngredientButton);

        const ingredientsContainer = document.createElement("div");
        ingredientsContainer.id = "ingredients-container";
        ingredientsContainer.className = "ingredients-container";
        newRecipeContainer.appendChild(ingredientsContainer);

        const newInstructionButton = document.createElement("button");
        newInstructionButton.innerHTML = "Add Instruction";
        newInstructionButton.id = "new-instruction-button";
        newInstructionButton.className = "new-instruction-button"
        newRecipeContainer.appendChild(newInstructionButton);

        const instructionsContainer = document.createElement("div");
        instructionsContainer.id = "instructions-container";
        instructionsContainer.className = "instructions-container";
        newRecipeContainer.appendChild(instructionsContainer);

        const recipeButtonsContainer = document.createElement("div");
        recipeButtonsContainer.id = "recipe-buttons-container";
        newRecipeContainer.appendChild(recipeButtonsContainer);

        const saveRecipeButton = document.createElement("button");
        saveRecipeButton.innerHTML = "Save";
        saveRecipeButton.id = "save-recipe-button";
        saveRecipeButton.className = "save-recipe-button"
        recipeButtonsContainer.appendChild(saveRecipeButton);

        const cancelNewRecipeButton = document.createElement("button");
        cancelNewRecipeButton.innerHTML = "Cancel";
        cancelNewRecipeButton.id = "cancel-new-recipe-button";
        cancelNewRecipeButton.className = "cancel-button"
        recipeButtonsContainer.appendChild(cancelNewRecipeButton);

        wrapper.appendChild(newRecipeContainer);
        checkEmptyContainer("ingredient");
        checkEmptyContainer("instruction");

        // Detects a click to save a recipe
        saveRecipeButton.addEventListener('click', (e) => {
            e.preventDefault();
            createRecipe();
        });

        // Detects a click to cancel the creation of the new recipe
        cancelNewRecipeButton.addEventListener('click', (e) => {
            e.preventDefault();
            destroyOverlay();
            destroyNewRecipeContainer();
        });

        // Detects a click to add an ingredient
        newIngredientButton.addEventListener('click', (e) => {
            e.preventDefault();
            removeEmptyContainerClass("ingredient");
            addIngredientContainer();
        });

        // Detects a click to add an instruction
        newInstructionButton.addEventListener('click', (e) => {
            e.preventDefault();
            removeEmptyContainerClass("instruction");
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
    })
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
    });
    destroyNewRecipeContainer();
    destroyResults();
    getRecipes();
    destroyOverlay();
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
    } catch (error) {
        console.error(error.message)
    }
}

// Render the delete confirmation
const renderDeleteConfirmation = async (id) => {
    applyOverlay();
    // Instantiates the DeleteMessage class and uses it to render a message
    const message = new DeleteMessage("Recipe Deletion", `Are you sure you want to delete this recipe?`, "Ok", "Cancel");
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
        deleteRecipe(id);
        destroyOverlay();
    });
}

// Delete Recipe
const deleteRecipe = async (id) => {
    try {
        const deleteRecipe = await fetch(`./recipes/${id}`, {
            method: "DELETE"
        });
        destroyResults(), getRecipes();
    } catch (err) {
        console.error(err.message)
    }
    // Instantiates the ConfirmationMessage class and uses it to render a message
   const message = new ConfirmationMessage("Recipe Deleted", `The recipe with ID: ${id} has been deleted`, "Ok");
   message.renderMessage(message);
}

// Update ingredients to the ingredients table in the database
const addEditedIngredients = async (quantity, measure, ingredient, recipe_id, ingredient_id) => {
    try {
        const body = { recipe_id, quantity, measure, ingredient, ingredient_id };
        const response  = await fetch(`./updateIngredients/${recipe_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
    } catch (error) {
        console.error(error.message)
    }
}

// Gather all the edited ingredient containers, iterate over them extracting the ingredient values and send them to the addEditedIngredients function
const addEditedIngredientContainers = (recipe_id) => {
    const ingredientContainers = document.querySelectorAll(".edit-ingredient-container");
    ingredientContainers.forEach(item => {
        if(item.id){
            const quantity = item.children[0].value;
            const measure = item.children[1].value;
            const ingredient = item.children[2].value;
            const ingredient_id = item.id;
            addEditedIngredients(quantity, measure, ingredient, recipe_id, ingredient_id);
        }else{
            const quantity = item.children[0].value;
            const measure = item.children[1].value;
            const ingredient = item.children[2].value;
            const recipe_id = recipeId;
            addIngredients(quantity, measure, ingredient, recipe_id);
        }        
    })
}

// Update edited instructions to the instructions table in the database
const addEditedInstructions = async (instruction, recipe_id, instruction_id) => {
    try {
        const body = { recipe_id, instruction, instruction_id };
        const response  = await fetch(`./updateInstructions/${recipe_id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }).then(()=> destroyNewRecipeContainer(), destroyResults(), getRecipes());
    } catch (error) {
        console.error(error.message)
    }
}

// Gather all the edited instruction containers, iterate over them extracting the instruction values and send them to the addEditedInstructions function
const addEditedInstructionContainers = (recipe_id) => {
    const instructionContainers = document.querySelectorAll(".edit-instruction-container");
    instructionContainers.forEach(item => {
        if(item.id){
            const instruction = item.children[0].value;
            const instruction_id = item.instruction_id;
            addEditedInstructions(instruction, recipe_id, instruction_id);
        }else{
            const instruction = item.children[0].value;
            const recipe_id = recipeId;
            addInstructions(instruction, recipe_id);
        }
    })
}

// Edit Recipe
const editRecipe = async (recipe_id) => {
    const recipe_name = document.querySelector("#edit-recipe-name").value;
    const recipe_description = document.querySelector("#edit-recipe-description").value;
    const cuisine = document.querySelector("#edit-recipe-cuisine").value;
    const notes = document.querySelector("#edit-recipe-notes").value;

    try {      
        const body = {recipe_id, recipe_name, recipe_description, cuisine, notes};
        const response = await fetch(`./recipes/${recipe_id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }).then((result) => {
            return result.json()
        }).then((data) => {
            recipe_id = data.recipe_id;
            addEditedIngredientContainers(recipe_id);
            addEditedInstructionContainers(recipe_id);
            destroyEditContainer();
            destroyOverlay();
        });
    } catch (err) {
        console.error(err.message)
    }
}

// Show recipe details
const showRecipeDetails = async () => {
    applyOverlay();
    destroyEditContainer();
    destroyNewRecipeContainer();
    destroyRecipeDetails();
    
    const detailsContainer = document.createElement("div");
    detailsContainer.className = "details-container";
    detailsContainer.id = "details-container";

    try {
        const response = await fetch(`./getRecipes/${recipeId}`);
        const jsonRecipeData = await response.json();  

        const content = 
        `
            <h2 id="details-title">${jsonRecipeData.recipe_name}</h2>
            <p id="details-description"><b>Description:</b> ${jsonRecipeData.recipe_description}</p>
            <p id="details-cuisine"><b>Cuisine: </b>${jsonRecipeData.cuisine}</p>
            <p id="details-notes"><b>Notes: </b>${jsonRecipeData.notes}</p>
        `;

        detailsContainer.innerHTML = content;
    } catch (err) {
        console.error(err.message)
    }
    
    try {
        const response = await fetch(`./getIngredients/${recipeId}`);
        const jsonIngredientData = await response.json();    

        const detailsIngredientsContainer = document.createElement("div");
        detailsIngredientsContainer.id = "details-ingredients-container";

        if(jsonIngredientData.length > 0){
            const ingredientsTitle = document.createElement("h2");
            ingredientsTitle.id = "ingredients-title";
            ingredientsTitle.innerHTML = "Ingredients"
            detailsContainer.appendChild(ingredientsTitle);
        }

        jsonIngredientData.forEach(item=>{
            const ingredient = document.createElement("p");
            ingredient.innerHTML = `${item.quantity} ${item.measure} ${item.ingredient_name}`;
            detailsIngredientsContainer.appendChild(ingredient);
        });
        detailsContainer.appendChild(detailsIngredientsContainer);
    } catch (err) {
        console.error(err.message)
    }

    try {
        const response = await fetch(`./getInstructions/${recipeId}`);
        const jsonInstructionData = await response.json();
       
        const detailsInstructionsContainer = document.createElement("div");
        detailsInstructionsContainer.id = "details-instructions-container";

        if(jsonInstructionData.length > 0){
            const instructionsTitle = document.createElement("h2");
            instructionsTitle.id = "instructions-title";
            instructionsTitle.innerHTML = "Instructions"
            detailsContainer.appendChild(instructionsTitle);
        }

        let index = 1;
        jsonInstructionData.forEach(item=>{
            const instruction = document.createElement("p");
            instruction.innerHTML = `${index}. ${item.instruction}`;
            detailsInstructionsContainer.appendChild(instruction);
            index++;
        });

        detailsContainer.appendChild(detailsInstructionsContainer);
    } catch (err) {
        console.error(err.message)
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "detail-button-container";
    
    const closeButton = document.createElement("button");
    closeButton.id = 'close-details-button';
    closeButton.className = "close-button";
    closeButton.innerHTML = "Close";

    closeButton.addEventListener('click', ()=> {
        destroyRecipeDetails();
        destroyOverlay();
    })

    buttonContainer.appendChild(closeButton);
    detailsContainer.appendChild(buttonContainer);
    wrapper.appendChild(detailsContainer);
}

// Destroy results container
const destroyResults = () => {
    const results = document.querySelector("#results");
    results.innerHTML = '';
}

// Destroy recipe details
const destroyRecipeDetails = () => {
    if(document.querySelector("#details-container")){
        const recipeDetailsContainer = document.querySelector("#details-container")
        recipeDetailsContainer.innerHTML = '';
        wrapper.removeChild(recipeDetailsContainer);
    }  
}

// Destroy create recipe container
const destroyNewRecipeContainer = () => {
    if(document.querySelector("#new-recipe-container")){
        const newRecipeContainer = document.querySelector("#new-recipe-container");
        newRecipeContainer.innerHTML = '';
        wrapper.removeChild(newRecipeContainer);
    }
}

// Destroy edit container
const destroyEditContainer = () => {
    if(document.querySelector("#edit-container")){
        const editcontainer = document.querySelector("#edit-container");
        editcontainer.innerHTML = '';
        wrapper.removeChild(editcontainer);
    }
}

// Detect a click to open the create recipe section
newRecipeButton.addEventListener('click', (e) => {
    e.preventDefault();
    destroyEditContainer();
    destroyNewRecipeContainer();
    renderNewRecipe();
});

// Detects a click to delete a recipe
const assignDeleteEventListeners = () => {
    deleteButtons.forEach(item => item.addEventListener('click', (e) => {
        const recipeId = item.id;
        renderDeleteConfirmation(recipeId)
    }))
}

// Detects a click to edit a recipe
const assignEditEventListeners = () => {
    editButtons.forEach(item => item.addEventListener('click', (e) => {
        recipeId = item.id;
        destroyNewRecipeContainer();
        destroyEditContainer();
        getARecipe(recipeId);
    }))
}

// Detects a click to view recipe details
const assignRecipeNamesEventListeners = () => {
    recipeNames.forEach(item => item.addEventListener('click', (e) => {
        recipeId = item.id;
        destroyNewRecipeContainer();
        destroyEditContainer();
        showRecipeDetails();
    }))
};

// Query the dom to have the search input bar readily available
const searchInput = document.querySelector("#search-input");

// Render the search results
const searchResults = async (filteredRecipes) => {
    results.innerHTML = '';
    filteredRecipes.forEach(item => {
        const container = document.createElement("div");
        container.id="recipe-container";

        content = 
            `
                <h2 id="${item.recipe_id}" class="recipe-title">${item.recipe_name}</h2>
                <div id="recipe-info">
                    <span><b>Description:</b> ${item.recipe_description}</span><br><br>
                    <span><b>Cuisine:</b> ${item.cuisine}</span>
                </div>
                <div id="recipe-buttons">
                    <button id="${item.recipe_id}" class="recipe-details">Details</button>
                    <div>
                        <span id="${item.recipe_id}" class="edit-button">Edit</span>
                        <span id="${item.recipe_id}" class="delete-button">Delete</span>
                    </div>
                </div>
            `;

        container.innerHTML = content;
        results.appendChild(container);

        deleteButtons = document.querySelectorAll(".delete-button");    
        editButtons = document.querySelectorAll(".edit-button"); 
        recipeNames = document.querySelectorAll(".recipe-details");
        
        assignDeleteEventListeners();
        assignEditEventListeners();
        assignRecipeNamesEventListeners();
    })
}

// Filter the array of allRecipesByName based on the search term
const searchRecipes = async (searchTerm) =>{
    filteredRecipes = allRecipesByName.filter((item) => 
        item.recipe_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if(filteredRecipes.length > 0){
        searchResults(filteredRecipes);
        return
    }
    results.innerHTML = "Sorry... Your search did not produce any results";
};

// Detects a key stroke and search through the recipe object that was fetched from the database
searchInput.addEventListener('keyup', (e) => {
    if(!e.target.value == ''){
        searchRecipes(e.target.value);
        return;
    }
    results.innerHTML = '';
    getRecipes();
});

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

// Get recipes on start
destroyResults();
getRecipes();