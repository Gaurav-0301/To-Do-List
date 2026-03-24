const {Todo} =require("../models/todo.model.js");

const getTodos=async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const newTodo=async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


const updateTodo=async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (req.body.text !== undefined) {
      todo.text = req.body.text;
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const deleteTodo= async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


 const searchTodos = async (req, res) => {
  try {
    const { q } = req.query; //
    
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    
    const results = await Todo.find({
      text: { $regex: q, $options: "i" }
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error searching tasks", error: error.message });
  }
};
module.exports={getTodos,newTodo,updateTodo,deleteTodo,searchTodos}