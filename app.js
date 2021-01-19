require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
const ejs = require('ejs');
const { EWOULDBLOCK } = require('constants');
const { REFUSED } = require('dns');


const app = express()
var publicDir = require('path').join(__dirname, '/public');
let arrayObjetos = [];
let boxcubo = {};

let userLogged;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(publicDir));
app.use('/', express.static(__dirname + '/www'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userLogged = user
    } else {
        userLogged = null
    }
})

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index2');
})

app.post('/login', (req, res) => {
    let getBody = req.body;
    Auth.SignInWithEmailAndPassword(getBody.email, getBody.password)
        .then((login) => {
            if (!login.err) {
                res.redirect('/home2')
            } else {
                res.redirect('/')
            }
        })
})

app.post('/input', (req, res) => {
    let { name } = req.body
    Auth.inputData(name)
    res.redirect('/')
})

app.post('/recebe', (req, res) => {
    boxcubo = {
        serie: req.body.serie,
        mac: req.body.mac,
        ip: req.body.ip,
        estado: req.body.estado,
        calibracao: req.body.calibracao,
        erro: req.body.erro,
        versao: req.body.versao,
        localizacao: req.body.localizacao
    }
    

    arrayObjetos.push(boxcubo);
    substituiElemento(arrayObjetos, arrayObjetos.length);
  

    res.send("ok");
})


app.get('/dashboard', function (req, res) {
    if (userLogged) {
        res.render('dashboard');
    } else {
        res.redirect('/')
    }
})

app.get('/home2', (req, res) => {
    res.format({
        html: function () {
            res.render(
                'home2',
                { arrayObjetos
                }
            );
            console.log(arrayObjetos);
            
        }
    })
})

function substituiElemento( array, tamanho){
    for(var i =0; i < tamanho; i++){
        if(array[i].serie == arrayObjetos[tamanho-1].serie){
            array[i] = arrayObjetos[tamanho-1];
        }
        if(array[i].serie == 'BC000088'){
            arrayObjetos.splice(tamanho-1,1);
        }
    }
    


}



app.listen(process.env.PORT || 3000);

console.log('listening on port: ' + (process.env.PORT || 3000))