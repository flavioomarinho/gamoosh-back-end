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
let serie, ip, srv, mac, erro, protocolo, reinicializacao, processados, mensagemBox ="teste", mensagemPainel, elementoBusca, resultaComando;
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
app.use('/js', express.static(__dirname + 'public/js'));


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
        localizacao: req.body.localizacao,
        srv : req.body.srv,
        protocolo : req.body.protocolo,
        reinicializacao : req.body.reinicializacao,
        processados : req.body.processados
    }
 
    arrayObjetos.push(boxcubo);
    manipulaArray();
    res.send(boxcubo);
})

app.post('/infodisplay',(req,res) =>{
    mensagemBox = req.body.mensagem;
    res.send("Mensagem recebida com sucesso!");
})

//Máquina lê estado comando
app.get('/comando', function(req,res){
       // res.redirect('/dashboard');
        res.send(resultaComando);
})

//Recebe comando painel
app.post('/form', (req, res)=>{
    cmd = req.body;
    mensagemBox = cmd.comando;
    mensagemPainel = "Comando " +" "+ mensagemBox + " enviado com sucesso!";
    resultaComando = processaComando(elementoBusca, preparaComando(cmd));
    console.log(resultaComando);
    res.redirect('/dashboard');
})
 
//Renderiza painel controle
app.get('/dashboard', function (req, res) {
    if (userLogged) {
        res.render(
            'dashboard',
          {serie, ip, srv, mac, erro, protocolo, reinicializacao, processados, mensagemBox, mensagemPainel}  
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


//Recebe elemento id
app.post('/interaction', (req,res,next)=>{
    console.log(req.query.serie);
    elementoBusca = req.query.serie;
    renderizaInfoDashboard(elementoBusca,arrayObjetos);
    mensagemPainel ="Bem vindo ao painel de controle BoxCubo";
    return res.redirect('https://painelboxcubo.herokuapp.com/dashboard')
})

//Substitui elemento array
function substituiElemento(array, tamanho) {
    var contador = 0;
     for (var i = 0; i < tamanho; i++) {
        if (array[i].serie == array[tamanho - 1].serie) {
            array[i] = array[tamanho - 1];
            contador= contador + 1;
            if(contador>1){
                return true;
            }
        }
     }   
}

//Rederiza elementos tela Dashboard
function renderizaInfoDashboard(id,array){
    for(var i=0; i<array.length;i++){
        if(id == array[i].serie){
            serie = array[i].serie;
            mac = array[i].mac;
            ip = array[i].ip;
            srv = array[i].srv;
            erro = array[i].erro;
            protocolo = array[i].protocolo;
            reinicializacao = array[i].reinicializacao;
            processados = array[i].processados;
        }

    }
    
}

function removeUltimoElemento(array){
    array.pop();
}

function manipulaArray(){
    var retorno = substituiElemento(arrayObjetos, arrayObjetos.length);
    if(retorno == true){
        removeUltimoElemento(arrayObjetos);
    }
}

function processaComando(id, comando){
return "'serie' : "+id+","+"'comando':"+comando;

}

function preparaComando(cmd){
    if(cmd.comando == 'CMDCALIB>'){
        return cmd.comando + '0' + (cmd.x*10) + '0'+ (cmd.y*10) +'0'+ (cmd.y*10);

    }else if(cmd.comando == 'CMDSTRESS>'){
        return cmd.comando + cmd.testeStress;

    }else if(cmd.comando == 'CMDSRV>'){
        return cmd.comando + cmd.enderecoServidor;

    }else if(cmd.comando == 'CMDNET>'){
        return cmd.comando + cmd.enderecoBoxCubo;

    }else if(cmd.comando == 'CMDWIFI>'){
        return cmd.comando + cmd.SSID + cmd.Senha;

    }else if(cmd.comando == 'CMDSERIE>'){
        return cmd.comando + cmd.numeroSerie;

    }else if(cmd.comando == 'CMDNETS>'){
        return cmd.comando + cmd.enderecoBoxCuboFixo;
    }else{
        return cmd.comando;
    }

}

app.listen(process.env.PORT || 3000);

