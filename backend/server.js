const express = require("express");
const dotenv = require("dotenv");
const todoRoutes = require("./routes/todo.route.js");
const { connectDB } = require("./config/db.js");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});