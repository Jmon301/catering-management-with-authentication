class Instruction{
    constructor(recipe_id, instruction){
        this.recipe_id = recipe_id;
        this.instruction = instruction;
    }

    getRecipeId () {
        return this.recipe_id;
    }

    setRecipeId(recipe_id){
        recipe_id.this = recipe_id;
    }

    getInstruction () {
        return this.instruction;
    }

    setInstruction(instruction){
        instruction.this = instruction;
    }

}