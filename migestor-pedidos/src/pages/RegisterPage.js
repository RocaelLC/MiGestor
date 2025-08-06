import React, { useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const CLAVE_ADMIN = '12345';

function RegisterPage({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [claveAdmin, setClaveAdmin] = useState('');
  const [grupoIdInput, setGrupoIdInput] = useState(''); // para trabajadores

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const rol = claveAdmin === CLAVE_ADMIN ? 'admin' : 'trabajador';

      const grupoId = rol === 'admin' ? uid : grupoIdInput;

      await setDoc(doc(db, 'usuarios', uid), {
        email,
        rol,
        grupoId
      });

      Swal.fire('Registro exitoso', `Rol asignado: ${rol}`, 'success');
      onRegisterSuccess(rol);
    } catch (error) {
      console.error('Error al registrar:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="login-container">
      <h2>Registro de usuario</h2>
      <form onSubmit={handleRegister}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Clave admin (opcional)" value={claveAdmin} onChange={(e) => setClaveAdmin(e.target.value)} />

        {claveAdmin !== CLAVE_ADMIN && (
          <input
            type="text"
            placeholder="ID del administrador"
            value={grupoIdInput}
            onChange={(e) => setGrupoIdInput(e.target.value)}
            required
          />
        )}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;
