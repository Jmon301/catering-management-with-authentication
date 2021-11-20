class Ingredient{
    constructor(recipe_id, quantity, measure, ingredient){
        this.recipe_id = recipe_id;
        this.quantity = quantity;
        this.measure = measure;
        this.ingredient = ingredient;
    }

    getRecipeId () {
        return this.recipe_id;
    }

    setRecipeId(recipe_id){
        recipe_id.this = recipe_id;
    }

    getQuantity () {
        return this.quantity;
    }

    setQuantity(quantity){
        quantity.this = quantity;
    }

    getMeasure () {
        return this.measure;
    }

    setMeasure(measure){
        measure.this = measure;
    }

    getIngredient () {
        return this.ingredient;
    }

    setIngredient(ingredient){
        ingredient.this = ingredient;
    }
}