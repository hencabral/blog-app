//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const PORT = 8081;

//Sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Public
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.use('/admin', admin);

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: " + PORT);
})