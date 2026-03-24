import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [error, setError] = useState("");

  
  const API_URL = import.meta.env.VITE_API_URL;

  
  const getTodos = async (query = "") => {
    try {
      
      const url = query ? `${API_URL}/search?q=${query}` : API_URL;
      const response = await fetch(url);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError("Server is not responding. Check your backend!");
    }
  };

  useEffect(() => {
    getTodos();
  }, []);


  const handleAdd = async (e) => {
    e.preventDefault();
    if (taskText.trim() === "") {
      setError("Task cannot be empty!");
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: taskText }), 
    });

    if (response.ok) {
      const newItem = await response.json();
      setTodos([...todos, newItem]);
      setTaskText("");
      setError("");
    }
  };


  const toggleComplete = async (id, currentStatus) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (response.ok) {
      const updated = await response.json();
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    }
  };


  const handleDelete = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (response.ok) {
      setTodos(todos.filter((t) => t._id !== id));
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

  
      <div className="row">
        <input 
          type="text" 
          placeholder="Search your tasks..." 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            getTodos(e.target.value); 
          }} 
        />
      </div>


      <form onSubmit={handleAdd} className="row">
        <input 
          type="text" 
          value={taskText} 
          placeholder="Add a new task" 
          onChange={(e) => setTaskText(e.target.value)} 
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo._id} className="item">
              <span 
                onClick={() => toggleComplete(todo._id, todo.completed)}
                className={todo.completed ? "completed" : ""}
              >
                {todo.text}
              </span>
              <button onClick={() => handleDelete(todo._id)} className="del-btn">Delete</button>
            </div>
          ))
        ) : (
          <p className="no-tasks">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default App;