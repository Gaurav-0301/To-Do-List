const express = require("express");
const cors = require("cors");
const {ConnectDB}=require("./config/db.js")
const todoRoutes = require("./routes/todo.route.js");
const connectDB = require("./config/db.js");
const dotenv=require("dotenv").config()
const app = express();


app.use(express.json());
app.use(cors());

connectDB();



app.use("/api/todos", todoRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});