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
let body, serie, mac, ip, estado, calibracao, erro, versao, localizacao;

let userLogged;
var paramRecebidos=[];
var i=0;
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

    paramRecebidos[i] = req.body;
    body = paramRecebidos[1];
    console.log(body.serie); 
    i++;
    /**  
    serie = req.body.serie;
    mac = req.body.mac;
    ip = req.body.ip;
    estado = req.body.estado;
    calibracao = req.body.calibracao;
    localizacao = req.body.localizacao;
    erro = req.body.erro;
    versao = req.body.versao;**/
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
                serie:serie,
                mac:mac,
                ip:ip,
                estado:estado,
                calibracao:calibracao,
                localizacao:localizacao,
                calibracao:calibracao,
                erro:erro,
                versao:versao
            });
        }

    })

})
  




app.listen(process.env.PORT || 3000)