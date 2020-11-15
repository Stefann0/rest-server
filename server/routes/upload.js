const { json } = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const { filter } = require('underscore');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id',(req,res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            err: {
                message:'No se enviaron archivos.'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['producto','usuario'];
    if(tiposValidos.indexOf(tipo) <  0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Tipo no permitido. Tipos Permitidos: ' + tiposValidos.join(', ')
            }
        });
    }


    let archivo = req.files.archivo

    //extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length -1];

    if(extensionesValidas.indexOf(extencion) <= 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Extension no valida. Extensiones permitidas: ' + extensionesValidas.join(', '),
                ext: extencion
            }
        });
    }

    //cambiar nombre del archivo
    let nomArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencion }`;

    //cargar archivo
    archivo.mv(`uploads/${ tipo }/${ nomArchivo }`, (err) => {
        if (err)
          return res.status(500).json({
              ok: false,
              err
            });
    
        if(tipo == "usuario"){
            imagenUsuario(id,res,nomArchivo);
        }else{
            imagenProducto(id,res,nomArchivo);
        }
      });
});

function imagenUsuario(id, res, nomArchivo){
    Usuario.findById(id,(err,usuarioBD) =>{
        if (err){
            borrarArchivo(nomArchivo,'usuario');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioBD){
            borrarArchivo(nomArchivo,'usuario');
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'Usuario no existe'
                }
            });
        }
        
        usuarioBD.img = nomArchivo;
        usuarioBD.save((err,ususarioGuardado) => {
            res.json({
                ok: true,
                usuario: ususarioGuardado,
            });
        });
    });
}

function imagenProducto(id, res, nomArchivo){
    Producto.findById(id,(err,productoBD) =>{
        if (err){
            borrarArchivo(nomArchivo,'producto');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBD){
            borrarArchivo(nomArchivo,'producto');
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'Usuario no existe'
                }
            });
        }
        
        productoBD.img = nomArchivo;
        productoBD.save((err,productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
            });
        });
    });
}

function borrarArchivo(nombreImagen,tipo){
    let pathUrl = path.resolve(__dirname,`../../uploads/${ tipo }/${ usuarioBD.img }`);

        if(fs.existsSync(pathUrl)){
            fs.unlinkSync(pathUrl);
        }
}

module.exports = app;