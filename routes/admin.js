const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get("/", (req, res) => {
    res.render('admin/index');
});

router.get("/posts", (req, res) => {
    res.send("Página de posts");
});

router.get("/categorias", (req, res) => {

    Categoria.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin");
    })
});

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias");
});

module.exports = router;