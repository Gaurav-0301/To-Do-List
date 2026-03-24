import { useEffect, useState, useCallback } from "react";
import { MdOutlineDone, MdModeEditOutline } from "react-icons/md";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  // Logic States
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  
  // Status States (Critical for Assignment)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch & Search Logic
  const fetchTodos = useCallback(async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query 
        ? `${API_URL}/api/todos/search?q=${encodeURIComponent(query)}` 
        : `${API_URL}/api/todos`;
      const response = await axios.get(endpoint);
      setTodos(response.data);
    } catch (err) {
      setError("Failed to sync with server. Please check your connection.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 2. Add Todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/todos`, { text: newTodo });
      setTodos((prev) => [...prev, response.data]);
      setNewTodo("");
    } catch (err) {
      setError("Could not add task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Update/Toggle Todo
  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.patch(`${API_URL}/api/todos/${id}`, updates);
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
      setEditingTodo(null);
    } catch (err) {
      setError("Update failed. Please refresh.");
    }
  };

  // 4. Delete Todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError("Delete failed. Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Glassmorphism Container */}
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-8 text-center">
          Task Manager
        </h1>

        {/* Search Bar (Assignment Requirement) */}
        <div className="relative mb-6">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchTodos(e.target.value);
            }}
          />
        </div>

        {/* Input Form */}
        <form onSubmit={addTodo} className="flex items-center gap-2 mb-6">
          <input
            className="flex-1 bg-white border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-blue-500 shadow-sm"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What's on your mind?"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {/* Error Feedback */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex justify-between items-center border border-red-100">
            <span>{error}</span>
            <button onClick={() => setError(null)}><IoClose /></button>
          </div>
        )}

        {/* List Section */}
        <div className="relative min-h-[200px]">
          {loading && !todos.length ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-4 text-sm">Syncing tasks...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todos.map((todo) => (
                <div key={todo._id} className="group bg-white border border-gray-100 p-4 rounded-2xl hover:shadow-md transition-all">
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 p-2 border-b-2 border-blue-500 outline-none"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => updateTodo(todo._id, { text: editedText })} className="text-green-500 text-xl"><MdOutlineDone /></button>
                      <button onClick={() => setEditingTodo(null)} className="text-gray-400 text-xl"><IoClose /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => updateTodo(todo._id, { completed: !todo.completed })}
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            todo.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={14} />}
                        </button>
                        <span className={`text-gray-700 font-medium ${todo.completed ? "line-through text-gray-400" : ""}`}>
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingTodo(todo._id); setEditedText(todo.text); }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button 
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {!loading && todos.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p>No tasks found. Time to relax!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;