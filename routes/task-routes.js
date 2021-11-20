const express = require('express');
const{addTask, getAllTasks, getTask,updateTask, deleteTask} = require('../controllers/taskController');

const router = express.Router();

router.post('/task', addTask);
router.get('/tasks',getAllTasks);
router.get('/task/:id',getTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);

module.exports={
    routes: router
}