'use strict';

const firebase = require('../db');
const Task = require('../models/task');
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

const getAllTasks = async (req, res, next) =>{
    try {
        const tasks = await firestore.collection('tasks');
        const data = await tasks.get();
        const tasksArray =[];
        if(data.empty){
            res.status(404).send('No task record found');
        }else{
            data.forEach(doc=>{
                const task = new Task(
                    doc.data().name,
                    doc.data().score,
                    doc.data().frequence

                );
                tasksArray.push(task);
            });
            res.send(tasksArray);
        }
        
    } catch (error) {
        res.status(404).send(error.message);

    }
}

module.exports={
    addTask,
    getAllTasks
}
