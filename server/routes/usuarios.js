const express = require('express');
const Usuario = require('../models/usuario.js');
const { verificaToken, verificarRol  } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const app = express();

//lista de usuarios
app.get('/usuarios', [verificaToken, verificarRol] ,(req,res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true},'nombre email google role img estado')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.countDocuments({ estado:true },(err,conteo) => {

            res.json({
                ok: true,
                "registros totales": conteo,
                usuarios
            });
        });
    });
});

//creacion de usuario
app.post('/usuarios', [verificaToken, verificarRol],(req,res) => {
    let persona = req.body;

    let usuario = new Usuario({
        nombre: persona.nombre,
        email: persona.email,
        password: bcrypt.hashSync(persona.password,10),
        role: persona.role
    });

    usuario.save((err,usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        } 

        usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
    
});

//actualiza usuario
app.patch('/usuarios/:id', [verificaToken, verificarRol],(req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    let validaciones = {
        new : true,
        runValidators: true
    };

    Usuario.findByIdAndUpdate(id,body,validaciones,(err,usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        });
    });

});

// app.delete('/usuarios/:id',(req,res) => {
//     let id = req.params.id;
    
//     Usuario.findByIdAndRemove(id,(err,usuarioBorrado) => {
//         if(err){
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         };

//         if(usuarioBorrado === null){
//             return res.status(400).json({
//                 ok: false,
//                 err:{
//                     message: 'Usuario no encontrado'
//                 } 
//             });
//         };

//         res.json({
//             ok: true,
//             ususario: usuarioBorrado
//         });
//     });
// });

app.delete('/usuarios/:id', [verificaToken, verificarRol], (req,res) => {
    let id = req.params.id;
    
    Usuario.findByIdAndUpdate(id,{estado: false},{ new: true },(err,usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(usuarioBorrado === null){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                } 
            });
        };

        res.json({
            ok: true,
            ususario: usuarioBorrado
        });
    });
});


module.exports = app;