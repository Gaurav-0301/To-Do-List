const express =require("express");
const { getTodos, newTodo, updateTodo, deleteTodo,searchTodos } = require("../controllers/function");


const router = express.Router();


router.get("/", getTodos);


router.post("/",newTodo );


router.patch("/:id",updateTodo );


router.delete("/:id",deleteTodo);

router.get('/search',searchTodos);

module.exports = router;
