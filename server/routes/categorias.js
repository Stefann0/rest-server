const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const _ = require('underscore');
const categoria = require('../models/categoria');

const app = express();

app.get('/categoria',(req,res)=> {
    Categoria.find()
    .sort('nombre')
    .populate('creado','nombre email')
    .populate('modificado','nombre email')
    .exec((err, categorias) => {
        res.json({
            ok: true,
            categorias
        });
    });
});

app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
    .exec((err,categoriaBD) => {
        if(err)
            return res.status(500).json({
                ok:false,
                err
            });
        
        if(!categoriaBD)
            return res.status(500).json({
                ok:false,
                err
            });

        res.json({
            ok:true,
            categoriaBD
        });
    });
});

app.post('/categoria',verificaToken,(req,res) => {
    let datos = _.pick(req.body,['nombre']);

    let categoria = new Categoria({
        nombre : datos.nombre,
        creado: req.usuario._id
    });

    categoria.save((err,categoriaBD) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            });
        
        if(!categoriaBD)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            categoria : categoriaBD
        });
    });
});

app.patch('/categoria/:id',verificaToken, (req,res) => {
    let id = req.params.id;
    let nombre = req.body.nombre;

    let validaciones = {
        new : true,
        runValidators: true
    };
    
    let actualizar = {
        nombre: nombre,
        modificado: req.usuario._id
    };

    Categoria.findByIdAndUpdate(id, actualizar,(err,categoriaBD) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            });
        
        Categoria.findById(id,(err,categoriaBD) =>{
            res.json({
                ok: true,
                categoria : categoriaBD
            });
        });  
    });
});

app.delete('/categoria/:id',[verificaToken, verificarRol],(req,res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id,(err,categoriaBorrada) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            });
        
        res.json({
            ok: true,
            categoria : categoriaBorrada
        });
    });
});

module.exports = app;