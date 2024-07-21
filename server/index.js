const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { starting_material, final_product } = req.body; 
        const newTodo = await pool.query(
            "INSERT INTO todo (starting_material, final_product) VALUES($1, $2) RETURNING *", 
            [starting_material, final_product]
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
        const updateTodo = await pool.query(
            "UPDATE todo SET starting_material = $1, final_product = $2 WHERE todo_id = $3", 
            [starting_material, final_product, id]
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
