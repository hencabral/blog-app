//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');

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

//Handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Mongoose
const uri = "mongodb+srv://root:root@test.m7oxe.mongodb.net/blogApp?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(uri)
.then(() => {
    console.log("mongoDB Conectado....")
}).catch((err) => {
    console.log("Houve um erro ao se conectar ao mongoBD: " + err)
});

//Public
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.use('/admin', admin);

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: " + PORT);
})