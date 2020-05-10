const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

/////////
//mostrar todas categorias 
//////////

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias

            })


        })

});

/////////
//mostrar categorias  por Id
//////////

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el id no existe"
                }
            });

        }

        res.json({
            ok: true,
            categoria: categoriDB
        })



    })

})

/////////
//crear nueva categoria
//////////

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el id no es valido"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriDB
        });

    })

})

/////////
//actualizar  categorias 
//////////

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriDB
        });

    })


});

/////////
//eliminar categorias 
//////////

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un admi puede eliminar categorias 

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        });

    })



})









module.exports = app;