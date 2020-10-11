require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/usuarios',(req,res) => {
    let persona = req.body;
    res.json({
        persona
    });
});

app.post('/usuarios',(req,res) => {
    let persona = req.body;

    if(persona.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: "Nombre necesario"
        });
    }else{
        res.json({
            persona
        });
    }
    
});

app.patch('/usuarios/:id',(req,res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuarios',(req,res) => {
    res.json('Delete usuarios');
});

app.listen(process.env.PORT, () =>{
    console.log(`Escuchando en el puerto: ${process.env.PORT}`);
});