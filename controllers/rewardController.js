'use strict';

const firebase = require('../db');
const Rewards = require('../models/reward');
const Reward = require('../models/reward');
const firestore = firebase.firestore();

const addReward = async (req, res, next)=>{
    try {
        const data = req.body;
        await firestore.collection('rewards').doc().set(data);
        res.send('Record saved sucessfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }

}

const getAllReward = async (req, res, next) =>{
    try {
        const rewards = await firestore.collection('rewards');
        const data = await rewards.get();
        const rewardsArray =[];
        if(data.empty){
            res.status(404).send('No rewar record found');
        }else{
            data.forEach(doc=>{
                const reward = new Reward(
                    doc.id,
                    doc.data().name,
                    doc.data().value,
 
                );
                rewardsArray.push(reward);
            });
            res.send(rewardsArray);
        }
        
    } catch (error) {
        res.status(404).send(error.message);

    }
}

const getReward = async (req, res, next)=>{
    try {
        const id = req.params.id;
        const reward = await firestore.collection('rewards').doc(id);
        const data = await reward.get();
        if(!data.exists){
            res.status(404).send('Reward with the given ID not found');
        }else{
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateReward = async(req, res, next)=>{
    try {
        const id = req.params.id;
        const data = req.body;
        const reward = await firestore.collection('rewards').doc(id);
        await reward.update(data);
        res.send('Reward record update successfuly');

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteReward = async(req, res, next)=>{
    try {
        const id = req.params.id;
        const reward = await firestore.collection('rewards').doc(id);
        await reward.delete();
        res.send('Reward deleted successfuly');

    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports={
    addReward,
    getAllReward,
    getReward,
    updateReward,
    deleteReward
}
