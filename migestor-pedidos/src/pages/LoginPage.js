import React, { useState } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import '../styles/login.css';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { rol } = docSnap.data();
        Swal.fire('Bienvenido', `Has iniciado sesión como ${rol}`, 'success');
        onLogin(rol);
      } else {
        Swal.fire('Error', 'El usuario no tiene rol asignado en Firestore', 'error');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;
