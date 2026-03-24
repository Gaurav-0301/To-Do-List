import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [error, setError] = useState("");


  const API_URL = import.meta.env.VITE_API_URL;
  

  console.log("Connected to:", API_URL);

  const getTodos = async (query = "") => {
    try {
      
      const url = query ? `${API_URL}/search?q=${query}` : API_URL;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      setTodos(data);
      setError(""); 
    } catch (err) {
      setError("Backend connection failed..");
    }
  };

  useEffect(() => {
    if (API_URL) {
      getTodos();
    } else {
      setError("VITE_API_URL is missing in .env file");
    }
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (taskText.trim() === "") {
      setError("Please enter a task name.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: taskText }), 
      });

      const newItem = await response.json();
      setTodos([...todos, newItem]);
      setTaskText("");
      setError("");
    } catch (error) {
      setError("Could not add task." ,error);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
     
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      const updated = await response.json();
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
     
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        setTodos(todos.filter((t) => t._id !== id));
      }
    } catch (err) {
      setError("Delete failed.");
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="row">
        <input 
          type="text" 
          placeholder="Search..." 
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
          placeholder="What needs to be done?" 
          onChange={(e) => setTaskText(e.target.value)} 
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error-box">{error}</p>}

      <div className="list">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo._id} className="item">
              <span 
                onClick={() => toggleComplete(todo._id, todo.completed)}
                className={todo.completed ? "completed" : "pending"}
              >
                {todo.text}
              </span>
              <button onClick={() => handleDelete(todo._id)} className="del-btn">Delete</button>
            </div>
          ))
        ) : (
          <p className="empty-msg">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default App;