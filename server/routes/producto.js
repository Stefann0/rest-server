const express = require('express');
const Producto = require('../models/producto')
const { verificaToken, verificarRol } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');
const _ = require('underscore');
let app = express();

app.get('/producto', verificaToken, (req,res) => {
    let desde = req.query.desde || 1;
    desde = Number(desde)-1;

    Producto.find({disponible : true})
    .skip(desde)
    .populate('usuario','nombre email')
    .populate('categoria','nombre')
    .limit(5)
    .exec((err,productos) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            });
        
        Producto.countDocuments({ disponible: true },(err,conteo) =>{
            res.json({
                ok: true,
                registros: conteo,
                productos
            });
        });
    });
});

app.get('/producto/:id', verificaToken, (req,res) => {
    let id = req.params.id;

    Producto.findById(id)
    .populate('categoria','nombre')
    .populate('usuario','nombre email')
    .exec((err,productoBD) => {
        if(err)
            return res.status(500).json({
                ok:false,
                err
            });
        
        if(!productoBD)
            return res.status(400).json({
                ok:false,
                err : {
                    message : 'Id no existe'
                }
            });

        res.json({
            ok:true,
            producto : productoBD
        });
    });
});

app.get('/producto/buscar/:termino', verificaToken, (req,res) =>{
    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');

    Producto.find({
        nombre : regex
    })
    .populate('categoria','nombre')
    .exec((err, productos) => {
        if(err)
            return res.status(500).json({
                ok:false,
                err
            });
        
        res.json({
            ok: true,
            productos
        })
    })
});

app.post('/producto',verificaToken,(req,res) => {
    let datos = _.pick(req.body,['nombre','precioUni','descripcion','categoria']);

    let producto = new Producto({
        nombre : datos.nombre,
        precioUni : datos.precioUni,
        descripcion : datos.descripcion,
        categoria : datos.categoria,
        usuario : req.usuario._id
    });

    producto.save((err,productoBD) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    })
});

app.patch('/producto/:id',verificaToken,(req,res) => {
    let datos = _.pick(req.body,['nombre','precioUni','descripcion','categoria']);
    let id = req.params.id;

    let actualizar = {
        nombre : datos.nombre,
        precioUni : datos.precioUni,
        descripcion : datos.descripcion,
        categoria : datos.categoria
    }

    Producto.findByIdAndUpdate(id, actualizar,(err,productoBD) => {
        if(err)
            return res.status(500).json({
                ok: false,
                err
            });
         
        if(!productoBD)
            return res.status(400).json({
                ok: false,
                err: {
                    message : 'El ID no existe'
                }
            });

        Producto.findById(id,(err, productoBD) =>{
            return res.status(202).json({
                ok: true,
                producto: productoBD
            });
        });
    });
});

app.delete('/producto/:id',[verificaToken,verificarRol],(req,res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id,{disponible :false},(err,productoBD) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            });
        
        res.json({
            ok: true,
            producto : productoBD,
            mensaje: 'producto borrado'
        });
    });
});

module.exports = app;