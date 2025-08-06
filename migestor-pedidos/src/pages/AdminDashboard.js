import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import AgregarProducto from './AgregarProducto';
import ListaProductos from './ListaProductos';
import HistorialVentas from './HistorialVentas';
import RegistrarVenta from './RegistrarVenta';
import { FaBars, FaCashRegister, FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { auth } from '../services/firebaseConfig';
import '../styles/admin.css';

const CLAVE_ADMIN = '123456';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vistaActual, setVistaActual] = useState('cobrar');
  const [permitirAgregar, setPermitirAgregar] = useState(false); // solicita clave solo 1 vez

  const onSetSidebarOpen = (open) => setSidebarOpen(open);

  const cambiarVista = async (vista) => {
    if (vista === 'productos' && !permitirAgregar) {
      const { value: claveIngresada } = await Swal.fire({
        title: 'Acceso restringido',
        input: 'password',
        inputLabel: 'Ingresa la clave de administrador',
        inputPlaceholder: 'Clave secreta',
        showCancelButton: true
      });

      if (claveIngresada === CLAVE_ADMIN) {
        Swal.fire('Acceso permitido', '', 'success');
        setPermitirAgregar(true);
        setVistaActual(vista);
      } else if (claveIngresada) {
        Swal.fire('Clave incorrecta', 'No tienes permisos para agregar productos', 'error');
      }

      return;
    }

    setVistaActual(vista);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.reload();
  };

  const sidebarContent = (
    <div className="sidebar-content">
      <h2>Menú</h2>
      <ul>
        <li onClick={() => cambiarVista('cobrar')}>
          <FaCashRegister /> Cobrar
        </li>
        <li onClick={() => cambiarVista('ventas')}>
          <FaFileInvoiceDollar /> Mis ventas
        </li>
        <li onClick={() => cambiarVista('productos')}>
          <FaPlus /> Agregar productos
        </li>
      </ul>

      <button onClick={handleLogout} className="cerrar-sesion-btn">
        Cerrar sesión
      </button>
    </div>
  );

  return (
    <Sidebar
      sidebar={sidebarContent}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      styles={{
        sidebar: { background: '#222', color: 'white', width: '250px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' }
      }}
    >
      <div className="admin-layout">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <FaBars size={20} />
        </button>

        <div className="contenido">
          {vistaActual === 'cobrar' && <RegistrarVenta />}
          {vistaActual === 'ventas' && (
            <>
              <h2>Historial de ventas</h2>
              <HistorialVentas />
            </>
          )}
          {vistaActual === 'productos' && permitirAgregar && (
            <>
              <h2>Gestión de productos</h2>
              <AgregarProducto />
              <ListaProductos />
            </>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

export default AdminDashboard;
