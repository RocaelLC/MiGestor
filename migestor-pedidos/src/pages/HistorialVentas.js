import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import '../styles/historialVentas.css';

function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [totalEfectivo, setTotalEfectivo] = useState(0);
  const [totalTransferencia, setTotalTransferencia] = useState(0);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDocRef = doc(db, 'usuarios', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error('El usuario no tiene datos en Firestore');
          return;
        }

        const { grupoId } = userDocSnap.data();

        const ventasQuery = query(
          collection(db, 'ventas'),
          where('grupoId', '==', grupoId)
        );

        const querySnapshot = await getDocs(ventasQuery);
        const ventasData = [];
        let efectivo = 0;
        let transferencia = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ventasData.push(data);

          if (data.metodoPago === 'efectivo') {
            efectivo += data.total;
          } else if (data.metodoPago === 'transferencia') {
            transferencia += data.total;
          }
        });

        setVentas(ventasData);
        setTotalEfectivo(efectivo);
        setTotalTransferencia(transferencia);
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      }
    };

    obtenerVentas();
  }, []);

  return (
    <div className="historial-container">
      <h2>Historial de Ventas</h2>

      <div className="resumen-totales">
        <p><strong>Total general:</strong> ${totalEfectivo + totalTransferencia}</p>
        <p><strong>Total en efectivo:</strong> ${totalEfectivo}</p>
        <p><strong>Total en transferencia:</strong> ${totalTransferencia}</p>
      </div>

      <div className="ventas-lista">
        {ventas.map((venta, index) => (
          <div key={index} className="venta-card">
            <p><strong>Fecha:</strong> {venta.fecha?.toDate().toLocaleString()}</p>
            <p><strong>Método de pago:</strong> {venta.metodoPago}</p>
            <p><strong>Total:</strong> ${venta.total}</p>
            <p><strong>Productos:</strong></p>
            <ul>
              {venta.productos.map((p, i) => (
                <li key={i}>{p.nombre} - ${p.precio}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistorialVentas;
