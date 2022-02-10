//Carregando módulos

const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

const PORT = 8081;

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Rotas
app.get("/", (req, res) => {
    res.send("Rota/");
})

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: " + PORT);
})