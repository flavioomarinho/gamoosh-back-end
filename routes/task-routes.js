const express = require('express');
const{addTask, getAllTasks, getTask} = require('../controllers/taskController');

const router = express.Router();

router.post('/task', addTask);
router.get('/tasks',getAllTasks);
router.get('/task/:id',getTask);

module.exports={
    routes: router
}