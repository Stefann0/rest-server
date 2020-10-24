//============
// CONFIGURACION PUERTO
//============
process.env.PORT = process.env.PORT || 3000;

//============
// CONFIGURACION AMBIENTE
//============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//============
// VENCIMIENTO TOKEN
// 60 * 60 * 24 * 30
//============
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//============
// VENCIMIENTO TOKEN
//============
process.env.SEED = process.env.SEED || 'secret';

//============
// CONFIGURACION BASE DE DATOS
//============
let urlDB = '';
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//GOOGLE CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || "151075730010-rat415nn3jh4i5sou8svoog986fg9hev.apps.googleusercontent.com";