//============
// CONFIGURACION PUERTO
//============
process.env.PORT = process.env.PORT || 3000;

//============
// CONFIGURACION AMBIENTE
//============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============
// CONFIGURACION BASE DE DATOS
//============
let urlDB = '';
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://strider:BlEHm2jKuG2Jk1eQ@cluster0.5f0d1.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
