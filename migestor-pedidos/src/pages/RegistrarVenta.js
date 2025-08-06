import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../styles/trabajador.css';


function RegistrarVenta() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(db, 'usuarios', uid);
        const userSnap = await getDoc(userDocRef);
        const { grupoId } = userSnap.data();

        const productosQuery = query(
          collection(db, 'productos'),
          where('grupoId', '==', grupoId)
        );

        const querySnapshot = await getDocs(productosQuery);
        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(productosData);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const quitarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + parseFloat(item.precio), 0).toFixed(2);
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) {
      Swal.fire('Carrito vacío', 'Agrega productos antes de finalizar la venta.', 'warning');
      return;
    }

    try {
      const uid = auth.currentUser.uid;
      const userDocRef = doc(db, 'usuarios', uid);
      const userSnap = await getDoc(userDocRef);
      const { grupoId } = userSnap.data();

      const venta = {
        productos: carrito,
        metodoPago,
        total: parseFloat(calcularTotal()),
        fecha: Timestamp.now(),
        grupoId
      };

      await addDoc(collection(db, 'ventas'), venta);
      Swal.fire('Venta registrada', 'La venta fue guardada exitosamente.', 'success');
      setCarrito([]);
      setMostrarCarrito(false);
    } catch (error) {
      console.error('Error al guardar venta:', error);
      Swal.fire('Error', 'No se pudo guardar la venta', 'error');
    }
  };

  return (
    <div className="trabajador-dashboard">
      <h1>Registrar venta</h1>

      <div className="productos-grid">
        {productos.length === 0 ? (
          <p style={{ padding: '10px', fontStyle: 'italic' }}>
            No hay productos disponibles aún.
          </p>
        ) : (
          productos.map((prod) => (
            <div key={prod.id} className="producto-card">
              {prod.imagenUrl && <img src={prod.imagenUrl} alt={prod.nombre} />}
              <h3>{prod.nombre}</h3>
              <p className="precio">${prod.precio}</p>
              <button onClick={() => agregarAlCarrito(prod)} className="btn-agregar">
                Agregar
              </button>
            </div>
          ))
        )}
      </div>

      {/* Ícono carrito fijo */}
      <div className="carrito-fijo" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
        🛒
        {carrito.length > 0 && <span className="contador">{carrito.length}</span>}
      </div>

      {/* Panel del carrito */}
      {mostrarCarrito && (
        <div className="carrito-panel">
          <h3>Carrito</h3>
          {carrito.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <ul>
                {carrito.map((item, index) => (
                  <li key={index}>
                    {item.nombre} - ${item.precio}
                    <button onClick={() => quitarDelCarrito(index)}>❌</button>
                  </li>
                ))}
              </ul>

              <p><strong>Total:</strong> ${calcularTotal()}</p>

              <label>Método de pago:</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </select>

              <button className="btn-finalizar" onClick={finalizarVenta}>
                Finalizar venta
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RegistrarVenta;
