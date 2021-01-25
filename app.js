require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
const ejs = require('ejs');
const { EWOULDBLOCK } = require('constants');
const { REFUSED } = require('dns');
const { read } = require('fs');
const app = express()
var publicDir = require('path').join(__dirname, '/public');
let arrayObjetos = [];
let boxcubo = {};
let id;
let cmd;
let userLogged;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(publicDir));
app.use('/', express.static(__dirname + '/www'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userLogged = user
    } else {
        userLogged = null
    }
})

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

//Autenticação usuário
app.post('/login', (req, res) => {
    let getBody = req.body;
    Auth.SignInWithEmailAndPassword(getBody.email, getBody.password)
        .then((login) => {
            if (!login.err) {
                res.redirect('/home')
            } else {
                res.redirect('/')
            }
        })
})


//Recebe os dados da Rasp
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
    res.send(boxcubo);
    
})


//Máquina lê estado comando
app.get('/comando', function(req,res){
    res.send(cmd)


})

//Recebe comando painel
app.post('/form', (req, res)=>{
    cmd = req.body;
    console.log(cmd);
    res.redirect('/home');
})

 
//Renderiza painel controle
app.get('/dashboard', function (req, res) {
    if (userLogged) {
        res.render(
            'dashboard',
          {id}  
            );
    } else {
        res.redirect('/')
    }
})

//Renderiza lista de máquinas
app.get('/home', (req, res) => {
    res.format({
        html: function () {
            res.render(
                'home',
                {
                    arrayObjetos
                }
            );
        }
    })
})


function substituiElemento(array, tamanho) {
     for (var i = 0; i < tamanho; i++) {
        if (array[i].serie == array[tamanho - 1].serie) {
            array[i] = array[tamanho - 1];
   
                   }
     }   
}



app.listen(process.env.PORT || 3000);

