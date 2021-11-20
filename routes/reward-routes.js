const express = require('express');
const{addReward, getAllReward, getReward, updateReward, deleteReward} = require('../controllers/rewardController');
const router = express.Router();


router.post('/reward', addReward);
router.get('/rewards',getAllReward);
router.get('/reward/:id',getReward);
router.put('/reward/:id', updateReward);
router.delete('/reward/:id', deleteReward);

module.exports={
    routes:router
}