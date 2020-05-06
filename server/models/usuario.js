const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es nesesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'el correo es nesesario']
    },
    password: {
        type: String,
        require: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'user_role',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true

    },
    google: {
        type: Boolean,
        default: false

    }

});
//evita que se muestre un propiedad en la respuesta
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH}, Debe de ser unico'
})

module.exports = mongoose.model('usuario', usuarioSchema)