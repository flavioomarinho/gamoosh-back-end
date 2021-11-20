const express = require('express');
const{addTask, getAllTasks, getTask,updateTask, deleteTask} = require('../controllers/taskController');
const{addReward, getAllReward, getReward, updateReward, deleteReward} = require('../controllers/rewardController');

const router = express.Router();

router.post('/task', addTask);
router.get('/tasks',getAllTasks);
router.get('/task/:id',getTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);

router.post('/reward', addReward);
router.get('/rewards',getAllReward);
router.get('/reward/:id',getReward);
router.put('/reward/:id', updateReward);
router.delete('/reward/:id', deleteReward);


module.exports={
    routes: router
}