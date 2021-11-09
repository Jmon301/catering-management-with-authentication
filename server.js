const express = require('express');
const app = express();
const path = require('path');
const { pool } = require("./dbConfig");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const cors = require("cors");
const initializePassport = require('./passportConfig');

initializePassport(passport);

const PORT = process.env.PORT || 4000; // Use this for production environment. Heroku

// Enables cross origin resource sharing, allows to get, put, delete, patch and set
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index')
});

// Selects the templating engine, ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

app.use(session({
    // secret: 'secret',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Makes the folder public available
app.use(express.static(path.join(__dirname, 'public')));

app.get('/users/register', checkAuthenticated, (req, res) => {
    res.render('register');
});

app.get('/users/login', checkAuthenticated, (req, res) => {
    res.render('login');
});

app.get('/users/dashboard', checkNotAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user.name});
});

app.get('/users/logout', (req, res) => {
    req.logOut(); // This function comes from passport
    req.flash('success_msg', 'You have logged out');
    res.redirect('/users/login');
})

// Application routing
app.get('/events', checkNotAuthenticated, (req, res) => {
    res.render('events', { user: req.user.name});
});

app.get('/recipes', checkNotAuthenticated, (req, res) => {
    res.render('recipes');
});

app.get('/schedule', checkNotAuthenticated, (req, res) => {
    res.render('schedule');
});

app.get('/tasks', checkNotAuthenticated, (req, res) => {
    res.render('tasks');
});

///////////////////

// Get all Recipes
app.get("/getRecipes", async(req, res) => {
    try{    
        const allRecipes = await pool.query("SELECT * FROM recipes");
        const allRecipesJson = res.json(allRecipes.rows);    
    }catch(err){
        console.error(err.message);
    }
});

// Get a recipe
app.get("/getRecipes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await pool.query("SELECT * FROM recipes WHERE recipe_id =  $1", [id]);
        const recipesJson = res.json(recipe.rows[0]);
    } catch (error) {
        console.error(err.message)
    }
})

// Get ingredients
app.get("/getIngredients/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const ingredients = await pool.query("SELECT * FROM ingredients WHERE recipe_id =  $1", [id]);
        const allIngredientsJson = res.json(ingredients.rows);
    } catch (error) {
        console.error(err.message)
    }
})

// Get instructions
app.get("/getInstructions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const instructions = await pool.query("SELECT * FROM instructions WHERE recipe_id = $1", [id]);
        const allInstructionsJson = res.json(instructions.rows);
    } catch (error) {
        console.error(err.message)
    }
})

// Create a recipe
app.post("/createRecipes", async (req, res)  => {
    try{
        const { recipe_name, recipe_description, cuisine, notes } = req.body; // This destructures the data coming from the body object that was set up in the index.js
        newRecipe = await pool.query('INSERT INTO recipes(recipe_name, recipe_description, cuisine, notes) VALUES($1, $2, $3, $4) RETURNING *', [recipe_name, recipe_description, cuisine, notes]);
        res.json(newRecipe.rows[0]);
    } catch (err){
        console.error(err.message);
    }
});

// Add ingredients to the ingredients table with the recipe_id
app.post("/addIngredients", async (req, res)  => {
    try{
        const { recipe_id, quantity, measure, ingredient  } = req.body;
        newIngredient = await pool.query('INSERT INTO ingredients(recipe_id, ingredient_name, quantity, measure) VALUES($1, $2, $3, $4) RETURNING *', [recipe_id, ingredient, quantity, measure]);
        res.json(newIngredient.rows[0]);
    } catch (err){
        console.error(err.message);
    }
});

// Add instructions to the instructions table with the recipe_id
app.post("/addInstructions", async (req, res)  => {
    try{
        const { recipe_id, instruction  } = req.body;
        newInstruction = await pool.query('INSERT INTO instructions(instruction, recipe_id) VALUES($1, $2) RETURNING *', [instruction, recipe_id]);
        res.json(newInstruction.rows[0]);
    } catch (err){
        console.error(err.message);
    }
});

// Delete a recipe
app.delete("/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteIngredients = await pool.query("DELETE FROM ingredients WHERE recipe_id = $1", [id])
        const deleteInstructions  = await pool.query("DELETE FROM instructions WHERE recipe_id = $1", [id])
        const deleteRecipe = await pool.query("DELETE FROM recipes WHERE recipe_id = $1", [id])
        
        res.json("Recipe was deleted");
        console.log(`Recipe with ID ${id} has been deletd`);
    } catch (err) {
        console.error(err.message)
    }
})

// Update a recipe
app.put("/recipes/:id", checkNotAuthenticated, async(req, res) => {
    try {
        const { recipe_name, recipe_description, cuisine, notes, recipe_id } = req.body;
        const updateRecipe = await pool.query('UPDATE recipes SET recipe_name=$1, recipe_description=$2, cuisine=$3, notes=$4 WHERE recipe_id=$5 RETURNING *', [recipe_name, recipe_description, cuisine, notes, recipe_id ])
        res.json("Recipe was updated");
    } catch (err) {
        console.error(err.message)
    }
})

// Update ingredients
app.put("/updateIngredients/:id", checkNotAuthenticated, async(req, res) => {

    try {
        const { quantity, measure, ingredient, recipe_id, ingredient_id  } = req.body;
        const updateIngredient = await pool.query('UPDATE ingredients SET ingredient_name=$1, quantity=$2, measure=$3 WHERE ingredient_id=$4 RETURNING *', [ingredient, quantity, measure, ingredient_id])
        res.json("Ingredient was updated");
    } catch (err) {
        console.error(err.message)
    }
})

// Update instructions
app.put("/updateInstructions/:id", checkNotAuthenticated, async(req, res) => {
    try {
        const { recipe_id, instruction, instruction_id  } = req.body;
        const updateInstruction = await pool.query('UPDATE instructions SET instruction=$1 WHERE instruction_id=$2 RETURNING *', [instruction, instruction_id])
        res.json("Instruction was updated");
    } catch (err) {
        console.error(err.message)
    }
})

////////////////////

app.post('/users/register', async (req, res) => {
    let{name, email, password, password2} = req.body;
    let errors =[];
    if (!name || !email || !password || !password2){
        errors.push({message: "Please enter all fields"});
    }
    if(password.length < 6){
        errors.push({message: "Password should be at least 6 characters"});
    }
    if(password != password2){
        errors.push({message: "Password do not match"});
    }
    if(errors.length > 0){
        res.render('register', {errors});
    }else{
        // Form validation has passed
        let hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
            'SELECT * FROM users WHERE user_email=$1', [email], (err, results) => {
                if(err){
                    throw err
                }
                console.log(results.rows);
                if(results.rows.length > 0){
                    errors.push({message:"Email already registered"})
                    res.render('register', {errors})
                }else{
                    pool.query(
                        'INSERT INTO users (user_name, user_email, password) VALUES ($1, $2, $3) RETURNING user_id, password', [name, email, hashedPassword], (err, results) => {
                            if(err){
                                throw err
                            }
                            console.log(results.rows);
                            req.flash('success_msg', 'You are now registered. Please log in');
                            res.redirect('/users/login');
                        }
                    )
                }
            }
        )
    }
});

app.post('/users/login', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
}));

// Redirects authenticated users
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

// Redirects not authenticated users
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});