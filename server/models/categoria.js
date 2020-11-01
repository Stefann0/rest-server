const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'Se necesita el nombre de la categoria'],
        unique: true
    },
    creado:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    modificado:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    }
});

categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Categoria', categoriaSchema);