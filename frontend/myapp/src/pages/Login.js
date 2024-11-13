import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, provider, signInWithPopup } from './firebaseConfig';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const email = result.user.email;
        if (email.endsWith('@scu.edu')) {
          navigate('/marketplace');
        } else {
          alert('Please sign in with a school email.');
          auth.signOut();
        }
      })
      .catch((error) => {
        console.error("Login Error: ", error);
      });
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <img src="images/silihLogoClear.png" alt="Logo" />
      </div>
      <div className="form-section">
        <h1 className="projectName">Swap It Like It's HOT!</h1>
        <h1 className="motto">For SCU by SCU</h1>
        <section>
          <h2>Sign In / Sign Up</h2>
          <button onClick={handleLogin}>Sign in with Google</button>
        </section>
      </div>
    </div>
  );
}

export default Login;
