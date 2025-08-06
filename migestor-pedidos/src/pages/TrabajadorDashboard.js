import React, { useState } from 'react';
import Sidebar from 'react-sidebar';
import RegistrarVenta from './RegistrarVenta';
import HistorialVentas from './HistorialVentas';
import AgregarProducto from './AgregarProducto';
import { auth } from '../services/firebaseConfig';
import { FaBars, FaCashRegister, FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../styles/trabajador.css';

const CLAVE_ADMIN = 'claveadmin123';

function TrabajadorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vista, setVista] = useState('cobrar');
  const [permitirAgregar, setPermitirAgregar] = useState(false);

  const onSetSidebarOpen = (open) => setSidebarOpen(open);

  const cambiarVista = async (modulo) => {
    if (modulo === 'agregar') {
      if (!permitirAgregar) {
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
          setVista('agregar');
        } else if (claveIngresada) {
          Swal.fire('Clave incorrecta', 'No tienes permisos para agregar productos', 'error');
        }
        return;
      }
    }

    setVista(modulo);
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
        <li onClick={() => cambiarVista('agregar')}>
          <FaPlus /> Agregar producto
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
        sidebar: { background: '#333', color: 'white', width: '250px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.4)' }
      }}
    >
      <div className="trabajador-layout">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <FaBars size={20} />
        </button>

        <div className="contenido">
          {vista === 'cobrar' && <RegistrarVenta />}
          {vista === 'ventas' && <HistorialVentas />}
          {vista === 'agregar' && permitirAgregar && <AgregarProducto />}
        </div>
      </div>
    </Sidebar>
  );
}

export default TrabajadorDashboard;
