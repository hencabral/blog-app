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
const Postagem = mongoose.model("postagens");
const usuarios = require('./routes/usuario');
const passport = require('passport');
require('./config/auth')(passport)

const PORT = 8081;

//Sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
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
app.use('/usuarios', usuarios);

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

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: " + PORT);
});