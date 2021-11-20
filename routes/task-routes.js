const express = require('express');
const{addTask, getAllTasks, getTask,updateTask} = require('../controllers/taskController');

const router = express.Router();

router.post('/task', addTask);
router.get('/tasks',getAllTasks);
router.get('/task/:id',getTask);
router.put('/task/:id', updateTask);

module.exports={
    routes: router
}