import React from 'react';
import { Link } from 'react-router-dom';

const Pedidos = () => {

    return (
        <div className="container mx-auto my-24 px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6 text-center">Mis Pedidos</h1>          
                <div className="text-center py-8">
                    <p className="text-xl mb-4">No tienes pedidos realizados aún.</p>
                    <p className="text-lg mb-4">¿No tienes una cuenta? Inicia sesión para comenzar a comprar.</p>
                    <Link 
                        to="/login" 
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500"
                    >
                        Iniciar Sesión
                    </Link>
                </div>          
        </div>
    );
};

export default Pedidos;
