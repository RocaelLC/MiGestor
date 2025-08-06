import React, { useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

function AgregarProducto() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const handleGuardar = async (e) => {
    e.preventDefault();

    try {
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, 'usuarios', uid));
      const { grupoId } = userDoc.data();

      await addDoc(collection(db, 'productos'), {
        nombre,
        precio: parseFloat(precio),
        descripcion,
        imagenUrl,
        creadoEn: Timestamp.now(),
        grupoId
      });

      Swal.fire('Producto guardado', '', 'success');
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setImagenUrl('');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      Swal.fire('Error', 'No se pudo guardar el producto', 'error');
    }
  };

  return (
    <form onSubmit={handleGuardar} className="formulario-producto">
  <div className="campo">
    <input
      type="text"
      placeholder="Nombre"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      required
    />
  </div>

  <div className="campo">
    <input
      type="number"
      placeholder="Precio"
      value={precio}
      onChange={(e) => setPrecio(e.target.value)}
      required
    />
  </div>

  <div className="campo">
    <input
      type="text"
      placeholder="URL de imagen"
      value={imagenUrl}
      onChange={(e) => setImagenUrl(e.target.value)}
      required
    />
  </div>

  <div className="campo">
    <textarea
      placeholder="Descripción"
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
    />
  </div>

  <button type="submit" className="btn-guardar">Guardar producto</button>
</form>

  );
}

export default AgregarProducto;
