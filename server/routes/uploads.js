const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path')
const Producto = require('../models/producto')



// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se a seleccionado ningun archivo'
            }
        })

    }

    // validar tipo

    let tipos_validos = ['productos', 'usuarios'];
    if (tipos_validos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitodas son:  ' + tipos_validos.join(', '),


            }
        })

    }

    let archivo = req.files.archivo;
    let nombre_cortado = archivo.name.split('.');
    let extension = nombre_cortado[nombre_cortado.length - 1]
    console.log(extension)

    // extenciones permitidas
    let extenciones_validas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extenciones_validas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extenciones permitodas son:  ' + extenciones_validas.join(', '),
                ext: 'esta tratando de subir un archivo con extencion  .' + extension

            }
        })
    }
    // cambiar nombre del archivo
    let nombre_archivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombre_archivo}`, (err) => {
        if (err)
            return res.status(500).json({
                    ok: false,
                    err
                })
                //aqui imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombre_archivo);
        } else {
            imagenProducto(id, res, nombre_archivo)
        }



    });
});

function imagenUsuario(id, res, nombre_archivo) {

    Usuario.findById(id, (err, usuariobd) => {
        if (err) {
            borraArchivo(nombre_archivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuariobd) {
            borraArchivo(nombre_archivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            })
        }


        borraArchivo(usuariobd.img, 'usuarios')


        usuariobd.img = nombre_archivo;
        usuariobd.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombre_archivo
            })
        })



    })


}

function imagenProducto(id, res, nombre_archivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombre_archivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borraArchivo(nombre_archivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            })
        }


        borraArchivo(productoDB.img, 'productos')


        productoDB.img = nombre_archivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombre_archivo
            })
        })



    })


}

function borraArchivo(nombreImgen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImgen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;