const { Todo } = require("../models/todo.model.js");


const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
}


const newTodo = async (req, res) => {
  const taskText = req.body.text;


  if (!taskText || taskText.trim() === "") {
    return res.status(400).json({ message: "Task text cannot be empty" });
  }

  if (taskText.length < 3) {
    return res.status(400).json({ message: "Task is too short (min 3 chars)" });
  }

  try {
    const todo = new Todo({
      text: taskText.trim(),
      completed: false
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: "Error saving to database" });
  }
}


const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

  
    const updatedTodo = await Todo.findByIdAndUpdate(
      id, 
      { text, completed }, 
      { new: true } 
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
}


const deleteTodo = async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Task already deleted" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
}


const searchTodos = async (req, res) => {
  try {
    const query = req.query.q; 
    
    if (!query) {
      return res.status(400).json({ message: "Please enter a search term" });
    }


    const results = await Todo.find({
      text: { $regex: query, $options: "i" }
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search error" });
  }
};

module.exports = { getTodos, newTodo, updateTodo, deleteTodo, searchTodos };