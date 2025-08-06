import React, { useEffect, useState } from 'react';
import { db, storage, auth } from '../services/firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import Swal from 'sweetalert2';
import '../styles/listaProductos.css';

function ListaProductos() {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
  try {
    const uid = auth.currentUser.uid;

    const userDocRef = doc(db, 'usuarios', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error('El usuario no tiene información en Firestore');
      return;
    }

    const { grupoId } = userDocSnap.data();

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

  useEffect(() => {
    obtenerProductos();
  }, []);

  const eliminarProducto = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'productos', id));
        Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
        obtenerProductos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  const editarProducto = async (producto) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar producto',
      html:
        `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">` +
        `<input id="swal-precio" type="number" class="swal2-input" placeholder="Precio" value="${producto.precio}">` +
        `<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion || ''}</textarea>` +
        `<label style="display:block; margin-top:10px">Cambiar imagen (opcional)</label>` +
        `<input type="file" id="swal-imagen" accept="image/*" class="swal2-file">`,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value;
        const precio = document.getElementById('swal-precio').value;
        const descripcion = document.getElementById('swal-descripcion').value;
        const imagen = document.getElementById('swal-imagen').files[0];

        if (!nombre || !precio) {
          Swal.showValidationMessage('Nombre y precio son obligatorios');
          return false;
        }

        return { nombre, precio, descripcion, imagen };
      }
    });

    if (formValues) {
      try {
        let nuevaImagenUrl = producto.imagenUrl;

        if (formValues.imagen) {
          const nombreArchivo = `${Date.now()}_${formValues.imagen.name}`;
          const storageRef = ref(storage, `productos/${nombreArchivo}`);
          await uploadBytes(storageRef, formValues.imagen);
          nuevaImagenUrl = await getDownloadURL(storageRef);
        }

        const docRef = doc(db, 'productos', producto.id);
        await updateDoc(docRef, {
          nombre: formValues.nombre,
          precio: parseFloat(formValues.precio),
          descripcion: formValues.descripcion,
          imagenUrl: nuevaImagenUrl
        });

        Swal.fire('¡Actualizado!', 'El producto fue editado correctamente.', 'success');
        obtenerProductos();
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      }
    }
  };

  return (
    <div className="lista-productos">
  <h2>Productos registrados</h2>
  <div className="productos-grid">
    {productos.map((prod) => (
      <div key={prod.id} className="producto-card">
        {prod.imagenUrl && <img src={prod.imagenUrl} alt={prod.nombre} />}
        <h3>{prod.nombre}</h3>
        <p className="precio">${prod.precio}</p>
        {prod.descripcion && <p className="descripcion">{prod.descripcion}</p>}
        <div className="botones-producto">
          <button className="btn-editar" onClick={() => editarProducto(prod)}>Editar</button>
          <button className="btn-eliminar" onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

export default ListaProductos;
