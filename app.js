require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const Auth = require('./firebase.js');
const ejs = require('ejs');
const { EWOULDBLOCK } = require('constants');
const { REFUSED } = require('dns');
const { load } = require('dotenv/types');

const app = express()
var publicDir = require('path').join(__dirname, '/public');
let serie1, mac1, ip1, estado1, calibracao1, erro1, versao1, localizacao1, serie2, mac2, ip2, estado2, calibracao2, erro2, versao2, localizacao2;

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
    console.log(paramRecebidos[i].serie);
    if(paramRecebidos[i].serie === 'BC0001'){ 
        serie1 = paramRecebidos[i].serie;
        mac1 = paramRecebidos[i].mac;
        ip1 = paramRecebidos[i].ip;
        estado1 = paramRecebidos[i].estado;
        calibracao1 = paramRecebidos[i].calibracao;
        localizacao1 = paramRecebidos[i].localizacao;
        erro1 = paramRecebidos[i].erro;
        versao1 = paramRecebidos[i].versao;
}else if(paramRecebidos[i].serie === 'BC0002'){

    serie2 = paramRecebidos[i].serie;
    mac2 = paramRecebidos[i].mac;
    ip2 = paramRecebidos[i].ip;
    estado2 = paramRecebidos[i].estado;
    calibracao2 = paramRecebidos[i].calibracao;
    localizacao2 = paramRecebidos[i].localizacao;
    erro2 = paramRecebidos[i].erro;
    versao2 = paramRecebidos[i].versao;


}
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
                serie1:serie1,
                mac1:mac1,
                ip1:ip1,
                estado1:estado1,
                calibracao1:calibracao1,
                localizacao1:localizacao1,
                calibracao1:calibracao1,
                erro1:erro1,
                versao1:versao1,
                serie2:serie2,
                mac2:mac2,
                ip2:ip2,
                estado2:estado2,
                calibracao2:calibracao2,
                localizacao2:localizacao2,
                calibracao2:calibracao2,
                erro2:erro2,
                versao2:versao2
            });
        }

    })

})
  




app.listen(process.env.PORT || 3000)