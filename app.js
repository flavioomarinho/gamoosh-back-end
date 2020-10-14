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
let mac;
let erro;
let status;
let localizacao;
let calibracao;

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
    res.render('index');
})

app.post('/login', (req, res) => {
    let getBody = req.body;
    Auth.SignInWithEmailAndPassword(getBody.email, getBody.password)
        .then((login) => {
            if (!login.err) {
                res.redirect('/dashboard')
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
    mac = req.body.mac;
    status = req.body.status;
    localizacao = req.body.localizacao;
    erro = req.body.localizacao;
    calibracao = req.body.calibracao;
    res.send("ok");
})


app.get('/dashboard', function (req, res) {
    if (userLogged) {
        res.render('dashboard');
    } else {
        res.redirect('/')
    }
})

app.get('/home', (req, res)=>{
    res.format({
        html: function(){
            res.render('home',{
                mac:mac,
                status:status,
                localizacao:localizacao,
                erro:erro,
                calibracao:calibracao

            });
        }

    })

})
  




app.listen(process.env.PORT || 3000)