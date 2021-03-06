const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion')

const app = express();

let Producto = require('../models/producto');

//*********************** */
//obtner todos los productos
//*********************** */
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario y categoria
    //paginado
    let desde = req.query.desde || 0
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nobre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })


})

//*********************** */
//obtner todos los productos por id
//*************************** */
app.get('/productos/:id', verificaToken, (req, res) => {

    //populate: usuario y categoria
    //paginado
    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('cotegoria', 'nombre ')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    message: 'id no existe'
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })



        })



})



//*********************** */
// buscar productos
//*********************** */

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let ter = req.params.termino;
    let regex = new RegExp(ter, 'i');

    Producto.find({ nombre: regex })
        .populate('cotegoria', 'nombre ')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })


})




//*********************** */
//crear un nuevo producto
//*************************** */
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria
    let body = req.body
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })


    console.log('productos')


})

//*********************** */
//actualizar producto
//*************************** */
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                message: 'el producto no existe'
            })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, prouctoG) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: prouctoG
            })

        })

    })



})

//*********************** */
//borrar un  producto
//*************************** */
app.delete('/productos/:id', verificaToken, (req, res) => {
    //cambiar el estado
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'el producto no existe'
            })
        }
        productoDB.disponible = false;
        productoDB.save((err, productoB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoB,
                message: 'producto borrado'

            });


        })


    })


})



module.exports = app;