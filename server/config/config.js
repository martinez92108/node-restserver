//====================
// puerto
//====================
process.env.PORT = process.env.PORT || 3000;

//====================
// entorno
//====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//====================
// BASE DE DATOS
//====================

let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://martinez92108:wFSZLNex8V3Hq0QW@cluster0-vbrh3.mongodb.net/cafe'
}
process.env.URLDB = urlDB;