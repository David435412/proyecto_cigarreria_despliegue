import React, { useContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';  
import UserContext from './context/UserContext';

// Componentes de Navbar
import Header from './components/comun/NavBar';
import NavBarAdmin from './components/administrador/NavBarAdmin';
import NavBarCliente from './components/cliente/NavBarCliente';
import NavBarCajero from './components/cajero/NavBarCajero';
import NavBarDomiciliario from './components/domiciliario/NavBarDomiciliario';
import Perfil from './components/comun/Perfil';

// Componentes de Página
import DetalleProductoSinLoggear from './pages/DetallesProductoSinLoggear';
import RegistroCliente from './components/auth/RegistroCliente';
import Login from './components/auth/Login';
import Recuperacion from './components/auth/RecuperacionContra';
import IngresarCod from './components/auth/IngresarCod';
import AdminDash from './components/administrador/AdminDash';
import GestionProductos from './components/administrador/productos/GestionProductos';
import RegistroProductos from './components/administrador/productos/RegistroProductos';
import EditarProducto from './components/administrador/productos/EdicionProducto';
import InactivosProductos from './components/administrador/productos/InactivosProductos';
import GestionUsuarios from './components/administrador/usuarios/GestionUsuarios';
import RegistroEmpleado from './components/administrador/usuarios/RegistroEmpleados';
import EditarUsuario from './components/administrador/usuarios/EdicionUsuarios';
import InactivosUsuarios from './components/administrador/usuarios/InactivosUsuarios';
import GestionProveedores from './components/administrador/proveedores/GestionProveedores';
import RegistroProveedor from './components/administrador/proveedores/RegistroProveedores';
import EditarProveedor from './components/administrador/proveedores/EdicionProveedores';
import InactivosProveedores from './components/administrador/proveedores/InactivosProveedores';
import GestionPedidos from './components/administrador/pedidos/PedidosAdmin';
import GestionVentas from './components/administrador/ventas/GestionVentas';
import RegistroVenta from './components/administrador/ventas/RegistroVentas';
import ConfirmacionVenta from './components/administrador/ventas/ConfirmacionVenta';
import InactivasVentas from './components/administrador/ventas/InactivasVentas';
import ClienteDashboard from './components/cliente/ClienteDash';
import DetalleProducto from './components/cliente/productos/DetallesProducto';
import Carrito from './components/cliente/productos/Cart';
import DatosEntrega from './components/cliente/pedidos/DatosEntrega';
import Confirmacion from './components/cliente/pedidos/Confirmacion';
import Pedidos from './components/cliente/pedidos/Pedidos';
import CajeroDashboard from './components/cajero/CajeroDash';
import ProductosCajero from './components/cajero/productos/Productos';
import RegistroProdutosCa from './components/cajero/productos/RegistroProductos';
import EdicionProductosCa from './components/cajero/productos/EdicionProductos';
import ProductosAgotadosCa from './components/cajero/productos/AgotadosProductos';
import ProveedoresCajero from './components/cajero/proveedores/Proveedores';
import VentasCajero from './components/cajero/ventas/Ventas';
import RegistroVentasCa from './components/cajero/ventas/RegistroVentas';
import ConfirmarVentasCa from './components/cajero/ventas/Confirmacionventas';
import PedidosCajero from './components/cajero/pedidos/Pedidos';
import RegistroPedidosCa from './components/cajero/pedidos/RegistroPedido'
import Carrito_pedidos_cajero from './components/cajero/pedidos/Carrito';
import RegistroPedidosCajero from './components/cajero/pedidos/RegistroPedido';
import DetalleProductoCajero from './components/cajero/pedidos/DetallesProductoCajero';
import DatosEntregaCajero from './components/cajero/pedidos/DatosEntregaCajero';
import ConfirmacionCajero from './components/cajero/pedidos/Confirmacion';
import DomiciliarioDashboard from './components/domiciliario/DomiciliarioDash';
import Footer from './components/comun/Footer';
import Inicio from './pages/Inicio';
import PedidosAntes from './components/comun/Pedidos';
import CartAntes from './components/comun/Cart';

const App = () => {
  const { role } = useContext(UserContext);

  const LocationBasedLayout = () => {
    const location = useLocation();
    const showNavBarFooter = !['/login', '/registro-cliente', '/recuperacion_contra', '/ingresar_codigo'].includes(location.pathname);

    let NavBarComponent = Header; // Valor por defecto

    if (role === 'administrador') {
      NavBarComponent = NavBarAdmin;
    } else if (role === 'cliente'){
      NavBarComponent = NavBarCliente;
    } else if (role === 'cajero'){
      NavBarComponent = NavBarCajero;
    } else if (role === 'domiciliario'){
      NavBarComponent = NavBarDomiciliario;
    }

    return (
      <div className="flex flex-col min-h-screen">
        {showNavBarFooter && <NavBarComponent />}
        <main className="flex-grow mt-12">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/DetalleProductoSinLoggear" element={<DetalleProductoSinLoggear />} />
            <Route path="/pedidos-a" element={<PedidosAntes />} />
            <Route path="/carrito-a" element={<CartAntes />} />
            <Route path="/registro-cliente" element={<RegistroCliente />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperacion_contra" element={<Recuperacion />} />
            <Route path="/ingresar_codigo" element={<IngresarCod />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin-dash" element={<AdminDash />} />
            <Route path="/gestion-productos" element={<GestionProductos />} />
            <Route path="/registro-productos" element={<RegistroProductos />} />
            <Route path="/editar-producto/:id" element={<EditarProducto />} />
            <Route path="/productos-inactivos" element={<InactivosProductos />} />
            <Route path="/gestion-usuarios" element={<GestionUsuarios />} />
            <Route path="/registro-empleado" element={<RegistroEmpleado />} />
            <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
            <Route path="/usuarios-inactivos" element={<InactivosUsuarios />} />
            <Route path="/gestion-proveedores" element={<GestionProveedores />} />
            <Route path="/registro-proveedor" element={<RegistroProveedor />} />
            <Route path="/editar-proveedor/:id" element={<EditarProveedor />} />
            <Route path="/proveedores-inactivos" element={<InactivosProveedores />} />
            <Route path="/gestion-pedidos" element={<GestionPedidos />} />
            <Route path="/gestion-ventas" element={<GestionVentas />} />
            <Route path="/registro-venta" element={<RegistroVenta />} />
            <Route path="/confirmar-venta" element={<ConfirmacionVenta />} />
            <Route path="/ventas-inactivas" element={<InactivasVentas />} />
            <Route path="/cliente-dash" element={<ClienteDashboard />} />
            <Route path="/productos/:id" element={<DetalleProducto />} />
            <Route path="/ProductoSinLoggear/:id" element={<DetalleProductoSinLoggear />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/datos-entrega" element={<DatosEntrega />} />
            <Route path="/confirmar" element={<Confirmacion />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/cajero-dash" element={<CajeroDashboard />} />
            <Route path="/productos-cajero" element={<ProductosCajero />} />
            <Route path="/registro-prod-cajero" element={<RegistroProdutosCa />} />
            <Route path="/editar-prod-cajero/:id" element={<EdicionProductosCa />} />
            <Route path="/productos-agotados-cajero" element={<ProductosAgotadosCa />} />
            <Route path="/proveedores-cajero" element={<ProveedoresCajero />} />
            <Route path="/ventas-cajero" element={<VentasCajero />} />
            <Route path="/registro-venta-cajero" element={<RegistroVentasCa />} />
            <Route path="/confirmar-ventas-cajero" element={<ConfirmarVentasCa />} />
            <Route path="/pedidos-cajero" element={<PedidosCajero />} />
            <Route path="/registro-pedido-cajero" element={<RegistroPedidosCa />} />
            <Route path="/Carrito_pedidos_cajero" element={<Carrito_pedidos_cajero />} />
            <Route path="/RegistroPedidosCajero" element={<RegistroPedidosCajero />} />
            <Route path="/producto-cajero/:id" element={<DetalleProductoCajero />} />
            <Route path="/DatosEntregaCajero" element={<DatosEntregaCajero />} />
            <Route path="/ConfirmacionCajero" element={<ConfirmacionCajero />} />
            <Route path="/domiciliario-dash" element={<DomiciliarioDashboard />} />
          </Routes>
        </main>
        {showNavBarFooter && <Footer />}
      </div>
    );
  };

  return (
    <LocationBasedLayout />
  );
};

export default App;
