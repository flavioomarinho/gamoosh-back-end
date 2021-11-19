const express = require('express');
const{addTask, getAllTasks} = require('../controllers/taskController');

const router = express.Router();

router.post('/task', addTask);
router.get('/tasks',getAllTasks);

module.exports={
    routes: router
}