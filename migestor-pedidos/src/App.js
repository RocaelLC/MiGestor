import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import TrabajadorDashboard from './pages/TrabajadorDashboard';

function App() {
  const [rol, setRol] = useState(null);
  const [pantalla, setPantalla] = useState('login'); // 'login' | 'register'

  if (!rol) {
    return pantalla === 'login' ? (
      <div>
        <LoginPage onLogin={setRol} />
        <p style={{ textAlign: 'center' }}>
          ¿No tienes cuenta?{' '}
          <button onClick={() => setPantalla('register')}>Regístrate</button>
        </p>
      </div>
    ) : (
      <div>
        <RegisterPage onRegisterSuccess={setRol} />
        <p style={{ textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => setPantalla('login')}>Inicia sesión</button>
        </p>
      </div>
    );
  }

  if (rol === 'admin') return <AdminDashboard />;
  if (rol === 'trabajador') return <TrabajadorDashboard />;
}

export default App;
