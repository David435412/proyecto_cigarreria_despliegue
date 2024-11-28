const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
  categoria: { type: String, required: true },
  cantidad: { type: Number, required: true },
  marca: { type: String, required: true },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'] },  
});

const VentaSchema = new mongoose.Schema({
  productos: { type: [ProductoSchema], required: true },
  numeroDocumento: { type: String, required: true },
  total: { type: Number, required: true },
  fechaVenta: { type: String, required: true }, // Considera usar Date si deseas formato nativo
  metodoPago: { type: String, required: true, enum: ["Tarjeta de Crédito", "Nequi", "Daviplata","Efectivo"] // Enumeración de los métodos de pago
  },
  estado: { type: String, required: true, enum: ['activo', 'inactivo'] },
});

module.exports = mongoose.model('Venta', VentaSchema);
