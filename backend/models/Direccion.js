const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
    direccion: { 
        type: String, 
        required: true 
    },
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    }
});

// Especificar explícitamente el nombre de la colección
module.exports = mongoose.model('Direccion', direccionSchema, 'direcciones');

