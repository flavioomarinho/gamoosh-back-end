'use strict';

const firebase = require('../db');
const task = require('../models/task');
const firestore = firebase.firestore();

const addTask = async (req, res, next)=>{
    try {
        const data = req.body;
        await firestore.collection('tasks').doc().set(data);
        res.send('Record saved sucessfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }

}

module.exports={
    addTask
}
