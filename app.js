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
let serie, mac, ip, estado, calibracao, erro, versao, localizacao;
let serie1, mac1, ip1, estado1, calibracao1, erro1, versao1, localizacao1;
let userLogged;
var array = [];

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



   // if(req.body.serie === 'BC10000'){
        serie = req.body.serie;
        mac = req.body.mac;
        ip = req.body.ip;
        estado = req.body.estado;
        calibracao = req.body.calibracao;
        erro = req.body.erro;
        versao = req.body.versao;
        localizacao = req.body.localizacao;
        array.push([serie,mac,ip,estado, calibracao,erro,versao,localizacao]);


 //   }

  //* if(req.body.serie === 'BC00076'){
     //  serie1 = req.body.serie;
       // mac1 = req.body.mac;
    //  ip1 = req.body.ip;
     //   estado1 = req.body.estado;
     //  calibracao1 = req.body.calibracao;
      // erro1 = req.body.erro;
      //  versao1 = req.body.versao;
      // localizacao1 = req.body.localizacao;
   // }
    res.send("ok");
})


app.get('/dashboard', function (req, res) {
    if (userLogged) {
        res.render('dashboard');
    } else {
        res.redirect('/')
    }
})

app.get('/home2', (req, res)=>{
    res.format({
        html: function(){
            res.render('home2',{
            
             serie:array.serie,
             mac:mac,
             ip:ip,
             estado:estado,
             calibracao:calibracao,
             erro:erro,
             versao:versao,
             localizacao:localizacao,

             serie1:serie1,
             mac1:mac1,
            ip1:ip1,
           estado1:estado1,
            calibracao1:calibracao1,
            erro1:erro1,
            versao1:versao1,
             localizacao1:localizacao1,
                           
            });
        }

    })

    for(var i =0; i < array.length;i++){
        console.log(array[i]);
    }

})

  app.listen(process.env.PORT || 3000)