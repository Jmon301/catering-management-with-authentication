class Recipe{
    constructor(recipe_name, recipe_description, cuisine, notes){
        this.recipe_name = recipe_name;
        this.recipe_description = recipe_description;
        this.cuisine = cuisine;
        this.notes = notes;
    }

    getRecipeName () {
        return this.recipe_name;
    }

    setRecipeName(recipe_name){
        recipe_name.this = recipe_name;
    }

    getRecipeDescription () {
        return this.recipe_description;
    }

    setRecipeDescription(recipe_description){
        recipe_description.this = recipe_description;
    }

    getCuisine () {
        return this.cuisine;
    }

    setCuisine(cuisine){
        cuisine.this = cuisine;
    }

    getNotes () {
        return this.notes;
    }

    setNotes(notes){
        notes.this = notes;
    }

}