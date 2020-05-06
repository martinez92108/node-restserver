//====================
// puerto
//====================
process.env.PORT = process.env.PORT || 3000;

//====================
// entorno
//====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//====================
// vencimineto del token
//====================
//60 segundos
// 60 minutos
// 24 horas
// 30dias 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//====================
// SEED DE AUTENTICACION
//====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//====================
// BASE DE DATOS
//====================

let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    //variable de entorno de git
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//====================
// google client Id
//====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '434570725853-h8kv6tg06kmltu63fda8u0j7h1i8cifa.apps.googleusercontent.com';