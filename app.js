//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const admin = require('./routes/admin');

const PORT = 8081;

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Rotas
app.use('/admin', admin);

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: " + PORT);
})