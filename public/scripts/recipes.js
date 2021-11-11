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


// Get all recipes. Is called when the page loads, and again after the recipe, ingredients, instructions are stored in the database. From the addInstructions function
const getRecipes = async () => {
    try {
        const response = await fetch("./getRecipes");
        const jsonData = await response.json();
        
        // Iterates over the results adding them to the results container
        jsonData.forEach(item =>{
            const container = document.createElement("div");
            container.id = "recipes-container";

            const recipeName = document.createElement("h4");
            recipeName.innerHTML = item.recipe_name;
            recipeName.id = item.recipe_id;
            recipeName.className = "recipe-title";
            container.appendChild(recipeName);

            const recipeDescription = document.createElement("p");
            recipeDescription.innerHTML = item.recipe_description;
            recipeDescription.id = item.recipe_id;
            recipeDescription.className = "recipe-description";
            container.appendChild(recipeDescription);

            const deleteButton = document.createElement("span");
            deleteButton.innerHTML = "--Delete";
            deleteButton.id = item.recipe_id;
            deleteButton.className = "delete-button";
            container.appendChild(deleteButton);

            const editButton = document.createElement("span");
            editButton.innerHTML = "--Edit";
            editButton.id = item.recipe_id;
            editButton.className = "edit-button";
            container.appendChild(editButton);

            results.appendChild(container);
            
        });
        deleteButtons = document.querySelectorAll(".delete-button");    
        editButtons = document.querySelectorAll(".edit-button"); 
        recipeNames = document.querySelectorAll(".recipe-title");
        
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
    editIngredientQuantity.id = "#new-ingredient-quantity";
    editIngredientQuantity.placeholder = "Quantity";
    editIngredientQuantity.type = "text";
    editIngredientQuantity.name = "ingredient_quantity";
    editIngredientContainer.appendChild(editIngredientQuantity);

    const editIngredientMeasure = document.createElement("input");
    editIngredientMeasure.id = "#new-ingredient-measure";
    editIngredientMeasure.placeholder = "Ingredient measure";
    editIngredientMeasure.type = "text";
    editIngredientMeasure.name = "ingredient_measure";
    editIngredientContainer.appendChild(editIngredientMeasure);

    const editIngredientName = document.createElement("input");
    editIngredientName.id = "#new-ingredient-name";
    editIngredientName.placeholder = "Ingredient name";
    editIngredientName.type = "text";
    editIngredientName.name = "ingredient_name";
    editIngredientContainer.appendChild(editIngredientName);

    const removeIngredientButton = document.createElement("button");
    removeIngredientButton.innerHTML = "Remove Ingredient";
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

// Create and fill up the fields to update
const renderEditRecipe = () => {
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
    editIngredientsContainer.id = "edit-ingredients-container";

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
        editIngredientContainer.className = "edit-ingredient-container";
        editIngredientContainer.id = item.ingredient_id;

        const editIngredientQuantity = document.createElement("input");
        editIngredientQuantity.value = item.quantity;
        editIngredientQuantity.type = "text";
        editIngredientQuantity.id = "edit-ingredient-quantity";
        editIngredientContainer.appendChild(editIngredientQuantity);

        const editIngredientMeasure = document.createElement("input");
        editIngredientMeasure.value = item.measure;
        editIngredientMeasure.type = "text";
        editIngredientMeasure.id = "edit-ingredient-measure";
        editIngredientContainer.appendChild(editIngredientMeasure);

        const editIngredientName = document.createElement("input");
        editIngredientName.value = item.ingredient_name;
        editIngredientName.type = "text";
        editIngredientName.id = "edit-ingredient-name";
        editIngredientContainer.appendChild(editIngredientName);

        const removeIngredientButton = document.createElement("button");
        removeIngredientButton.innerHTML = "Remove Ingredient";
        removeIngredientButton.id = "remove-ingredient-button";
        removeIngredientButton.className = "remove-ingredient-button"
        editIngredientContainer.appendChild(removeIngredientButton);

        editIngredientsContainer.appendChild(editIngredientContainer);
    });

    // Detects a click to add an ingredient
    addIngredientButton.addEventListener('click', (e) => {
        e.preventDefault();
        addEditIngredientContainer();
    });

    // Instructions section
    const editInstructionsContainer = document.createElement("div");
    
    editInstructionsContainer.id = "edit-instructions-container";

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
        editInstructionContainer.className = "edit-instruction-container";
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

    // Detects a click to add an ingredient
    addInstructionButton.addEventListener('click', (e) => {
        e.preventDefault();
        addEditInstructionContainer();
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
            destroyNewRecipeContainer();
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
    console.log(recipe_id);
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
    }).then(()=> destroyNewRecipeContainer(), destroyResults(), getRecipes());
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
        destroyResults(), getRecipes();
    } catch (err) {
        console.log(err.message)
    }
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
        console.log(recipe_id + " -- " + recipe_name + " -- " + recipe_description + " -- " + cuisine + " -- " + notes)

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
        });
    } catch (err) {
        console.error(err.message)
    }
}

// Show recipe details
const showRecipeDetails = async () => {
    destroyEditContainer();
    destroyNewRecipeContainer();
    destroyRecipeDetails();
    
    const detailsContainer = document.createElement("div");

    try {
        const response = await fetch(`./getRecipes/${recipeId}`);
        const jsonRecipeData = await response.json();  

        detailsContainer 
        detailsContainer.id = "details-container";

        const detailsTitle = document.createElement("h2");
        detailsTitle.id = "details-title";
        detailsTitle.innerHTML = jsonRecipeData.recipe_name;
        detailsContainer.appendChild(detailsTitle);

        const detailsDescription = document.createElement("h4");
        detailsDescription.id = "details-description";
        detailsDescription.innerHTML = jsonRecipeData.recipe_description;
        detailsContainer.appendChild(detailsDescription);

        const detailsCuisine = document.createElement("h4");
        detailsCuisine.id = "details-cuisine";
        detailsCuisine.innerHTML = jsonRecipeData.cuisine;
        detailsContainer.appendChild(detailsCuisine);

        const detailsNotes = document.createElement("h4");
        detailsNotes.id = "details-notes";
        detailsNotes.innerHTML = jsonRecipeData.notes;
        detailsContainer.appendChild(detailsNotes);
    } catch (err) {
        console.error(err.message)
    }
    

    try {
        const response = await fetch(`./getIngredients/${recipeId}`);
        const jsonIngredientData = await response.json();    

        const detailsIngredientsContainer = document.createElement("div");
        detailsIngredientsContainer.id = "details-ingredients-container";

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

        jsonInstructionData.forEach(item=>{
            const instruction = document.createElement("p");
            instruction.innerHTML = `${item.instruction}`;

            detailsInstructionsContainer.appendChild(instruction);
        });

        detailsContainer.appendChild(detailsInstructionsContainer);
    } catch (err) {
        console.error(err.message)
    } 
    
    const closeButton = document.createElement("button");
    closeButton.id = 'close-details-button';
    closeButton.className = "close-button";
    closeButton.innerHTML = "Close";

    closeButton.addEventListener('click', ()=> {
        destroyRecipeDetails();
    })

    detailsContainer.appendChild(closeButton);
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

// Get recipes on start
destroyResults();
getRecipes();

// Detect a click to open the create recipe section
newRecipeButton.addEventListener('click', (e) => {
    destroyEditContainer();
    destroyNewRecipeContainer();
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



const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

searchInput.addEventListener('keyup', (e) => {
    console.log(e.target.value);
    searchRecipes();
})