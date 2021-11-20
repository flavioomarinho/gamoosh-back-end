'use strict';

const firebase = require('../db');
const User = require('../models/user');
const firestore = firebase.firestore();

const addUser = async (req, res, next)=>{
    try {
        const data = req.body;
        await firestore.collection('users').doc().set(data);
        res.send('Record saved sucessfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }

}

const getAllUsers = async (req, res, next) =>{
    try {
        const tasks = await firestore.collection('users');
        const data = await tasks.get();
        const tasksArray =[];
        if(data.empty){
            res.status(404).send('No users record found');
        }else{
            data.forEach(doc=>{
                const user = new User(
                    doc.id,
                    doc.data().name,
                    doc.data().cpf,
                    doc.data().telephone,
                    doc.data().email
                   
                );
                usersArray.push(user);
            });
            res.send(usersArray);
        }
        
    } catch (error) {
        res.status(404).send(error.message);

    }
}

const getUser = async (req, res, next)=>{
    try {
        const id = req.params.id;
        const user = await firestore.collection('users').doc(id);
        const data = await user.get();
        if(!data.exists){
            res.status(404).send('User with the given ID not found');
        }else{
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async(req, res, next)=>{
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await firestore.collection('users').doc(id);
        await user.update(data);
        res.send('User record update successfuly');

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async(req, res, next)=>{
    try {
        const id = req.params.id;
        const user = await firestore.collection('users').doc(id);
        await user.delete();
        res.send('User deleted successfuly');

    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports={
    addUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}
