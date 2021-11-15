const ingredientsContainer = document.querySelector("#edit-ingredients-container");

const editIngredientContainer = document.createElement("div");
editIngredientContainer.className = "edit-ingredient-container";

const content = 
`
    <input id="new-ingredient-quantity" type="number" placeholder="Quantity" name="ingredient_quantity" required />
    <input id="new-ingredient-measure" type="text" placeholder="Ingredient measure" name="ingredient_measure" required />
    <input id="new-ingredient-name" type="text" placeholder="Ingredient name" name="ingredient_name" required />
    <button id="remove-ingredient-button" class="remove-ingredient-button">Remove Ingredient</button>
`;

editIngredientContainer.innerHTML = content;
ingredientsContainer.appendChild(editIngredientContainer);



////////////------------------------

const newInstructionContainer = document.createElement("div");
newInstructionContainer.className = "edit-instruction-container";

const content =
`
    <input id="new-instruction" placeholder="Instruction" type="text" name="instruction" required>
    <button id ="remove-instruction-button" class="remove-instruction-button">Remove Instruction</button>
`;

newInstructionContainer.innerHTML = content;
instructionsContainer.appendChild(newInstructionContainer);




////////////------------------------
const editContainer = document.createElement("div");
editContainer.id = "edit-container";

const content = 
`
    <h2 class="edit-recipe-title">Edit Recipe</h2>
    <form id="${editRecipeObject.recipe_id}">
        <input value="${editRecipeObject.recipe_name}" type="text" id="edit-recipe-name" name="recipe_name" required>
        <input value="${editRecipeObject.recipe_description}" type="text" id="edit-recipe-description" name="recipe_description" required>
        <input value="${editRecipeObject.cuisine}" type="text" id="edit-recipe-cuisine" name="cuisine" required>
        <textarea id="edit-recipe-notes">${editRecipeObject.notes}</textarea>
    </form>
`;

editContainer.innerHTML = content;


////////////------------------------
const editIngredientsContainer = document.createElement("div");
editIngredientsContainer.id = "edit-ingredients-container";

const ingredientContent = 
`
    <h2>Ingredients</h2>
    <button id="add-ingredient-button" class="add-ingredient-button">Add Ingredient</button>
`;

editIngredientsContainer.innerHTML = ingredientContent;

editIngredientsObject.forEach(item => {
    const editIngredientContainer = document.createElement("div");
    editIngredientContainer.className = "edit-ingredient-container";
    editIngredientContainer.id = item.ingredient_id;

    const editIngredientContent = 
    `
        <input id="edit-ingredient-quantity" type="number" value="${item.quantity}" required>
        <input id="edit-ingredient-measure" type="text" value="${item.measure}" required>
        <input id="edit-ingredient-name" type="text" value="${item.ingredient_name}" required>
        <button id="remove-ingredient-button" class="remove-ingredient-button">Remove Ingredient</button>
    `;

    editIngredientContainer.innerHTML = editIngredientContent;
    editIngredientsContainer.appendChild(editIngredientContainer);
});


////////////------------------------
const editInstructionsContainer = document.createElement("div");
editInstructionsContainer.id = "edit-instructions-container";

editInstructionsContent = 
`
    <h2>Instructions</h2>
    <button id="add-instruction-button" class="add-instruction-button">Add Instruction</button>
`;

editInstructionsContainer.innerHTML = editInstructionsContent;

editInstructionsObject.forEach(item => {
    const editInstructionContainer = document.createElement("div");
    editInstructionContainer.className = "edit-instruction-container";
    editInstructionContainer.id = item.instruction_id;

    contentEditInstructionObject = 
    `
        <input id="instruction-${item.instruction_id}" type="text" value="${item.instruction}";
        <button id="remove-instruction-button" class="remove-instruction-button">Remove Instruction</button>
    `;

    editInstructionContainer.innerHTML = contentEditInstructionObject;
});


////////////------------------------


jsonData.forEach(item =>{
    const container = document.createElement("div");
    container.id = "recipe-container";

    content = 
    `
        <h2 id="${item.recipe_id}" class="recipe-title">${item.recipe_name}</h2>
        <span><br>Description:</br> ${item.recipe_description}</span>
        <span><br>Cuisine:</br> ${item.cuisine}</span>
        <div>
            <button id="${item.recipe_id} class="recipe-details">Details</button>
            <div>
                <span id="${item.recipe_id}" class="edit-button">Edit</span>
                <span id="${item.recipe_id}" class="delete-button">Delete</span>
            </div>
        </div>
    `;
    container.innerHTML = content;
    results.appendChild(container);
});