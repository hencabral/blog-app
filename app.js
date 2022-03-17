//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
require("./models/Postagem");
require("./models/Categoria");
const Postagem = mongoose.model("postagens");
const Categoria = mongoose.model("categorias");

const PORT = 8081;

//Sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Mongoose
const uri = "mongodb+srv://root:root@test.m7oxe.mongodb.net/blogApp?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(uri)
.then(() => {
    console.log("mongoDB Conectado....");
}).catch((err) => {
    console.log("Houve um erro ao se conectar ao mongoBD: " + err);
});

//Public
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.use('/admin', admin);

app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).lean()
    .then((postagens) => {
        res.render('index', {postagens: postagens});
    })
    .catch((err) => {
        req.flash("error_msg", "Erro ao exibir postagens");
        res.redirect("/404");
    });
});

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean()
    .then((postagem) => {
        res.render('postagem/index', {postagem: postagem});
    })
    .catch((err) => {
        req.flash("error_msg", "Erro ao exibir postagem");
        res.redirect("/404");
    });
});

app.get('/categorias', (req, res) => {
    Categoria.find().lean()
    .then((categorias) => {
        res.render('categorias/index', {categorias: categorias});
    })
    .catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect('/');
    });
});

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean()
    .then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).lean()
        .then((postagens) => {
            res.render('categorias/postagens', {postagens: postagens, categoria: categoria});
        })
        .catch((err) => {
            req.flash("error_msg", "Postagens não localizadas");
            res.redirect('/');
        })
        }else{
            req.flash("error_msg", "Essa categoria não existe");
            res.redirect('/');
        }
    })
    .catch((err) => {
        req.flash("error_msg", "Houve um erro ao buscar a categoria");
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: " + PORT);
});