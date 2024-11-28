import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Carrito = () => {
    const [carrito] = useState([]); // Eliminar la funcionalidad de cargar el carrito

    return (
        <div className="container mx-auto my-24 px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6 text-center">Carrito de Compras</h1>
           
                <div className="text-center py-8">
                    <p className="text-xl mb-4">El carrito está vacío.</p>
                    <p className="text-lg mb-4">¿No tienes una cuenta? Inicia sesión para comenzar a comprar.</p>
                    <Link to="/login" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500">Iniciar Sesión</Link>
                </div>
            
          
        </div>
    );
};

export default Carrito;
