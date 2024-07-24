const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { execFile } = require("child_process");
const path = require("path");

//middleware
app.use(cors());
app.use(express.json()); //req.body

// Function to run the Python script
const runPythonScript = (starting_material, final_product) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "ml", "ml_script.py");
        execFile("python3", [scriptPath, starting_material, final_product], (error, stdout, stderr) => {
            if (error) {
                console.error("Python script error:", stderr);
                return reject(error);
            }
            console.log("Python script output:", stdout);
            resolve(JSON.parse(stdout));
        });
    });
};

//ROUTES//

//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { starting_material, final_product } = req.body;

        const reactions = {
            "reactions": [
                {
                    "starting_material": "Ethanol",
                    "final_product": "Acetaldehyde",
                    "reaction": "Alcohol Oxidation",
                }
                ,
                {
                    "starting_material": "Ethanol",
                    "final_product": "Acetaldehyde",
                    "reaction": "Alcohol Oxidation",
                }
            ]
        }

        //const result = await runPythonScript(starting_material, final_product);

        // Save the result to your database if needed
        const newTodo = await pool.query(
            "INSERT INTO todo (starting_material, final_product, reactions) VALUES($1, $2, $3) RETURNING *",
            [starting_material, final_product, reactions]
        );
        
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get all todos
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { starting_material, final_product } = req.body;
        
        // Run the Python script
        const result = await runPythonScript(starting_material, final_product);
        
        // Update the todo with the new result
        const updateTodo = await pool.query(
            "UPDATE todo SET starting_material = $1, final_product = $2, reaction = $3 WHERE todo_id = $4",
            [starting_material, final_product, result.reaction, id]
        );
        

        res.json("Todo was updated");
    } catch (err) {
        console.error(err.message);
    }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1", 
            [id]
        );
        res.json("Todo was deleted");
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => {
    console.log("server has started on port 5000");
});
