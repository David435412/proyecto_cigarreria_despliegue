require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Habilitar CORS (puedes limitarlo solo para desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Middleware para manejar JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión a MongoDB", err));

// Rutas de API
const userRoutes = require('./routes/usuarios');
app.use('/api/usuarios', userRoutes);

const proveedorRoutes = require('./routes/proveedores');
app.use('/api/proveedores', proveedorRoutes);

const productoRoutes = require('./routes/productos');
app.use('/api/productos', productoRoutes);

const pedidoRoutes = require('./routes/pedidos');
app.use('/api/pedidos', pedidoRoutes);

const direccionRoutes = require('./routes/direcciones');
app.use('/api/direcciones', direccionRoutes);

const ventaRoutes = require('./routes/ventas');
app.use('/api/ventas', ventaRoutes);

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  // Ruta para los archivos estáticos del frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Servir el archivo index.html para cualquier ruta no manejada por el backend
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
