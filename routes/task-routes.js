const express = require('express');
const{addTask} = require('../controllers/taskController');

const router = express.Router();

router.post('/task', addTask);

module.exports={
    routes: router
}