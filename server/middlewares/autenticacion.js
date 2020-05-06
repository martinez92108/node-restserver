const jwt = require('jsonwebtoken');



//=================
//verificar toquen
//==================

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decodec) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        req.usuario = decodec.usuario;
        next()

    })



}


//=================
//verifica admin role
//==================

let verificaAdmin_role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        })

    }

}


module.exports = {
    verificaToken,
    verificaAdmin_role
}