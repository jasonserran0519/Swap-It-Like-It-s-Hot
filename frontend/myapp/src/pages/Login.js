import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { auth, provider, signInWithPopup } from '../firebaseConfig';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
      // Sign in the user with Google
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;
      const userID = result.user.uid;
      const displayName = result.user.displayName;

      // Checking email domain to make sure it is a school email.
      if (!email.endsWith('@scu.edu')) {
        alert('Please sign in with a school email.');
        auth.signOut();
        return;
      }

      
      const userData = {
        uid: userID,
        displayName: displayName,
        email: email,
      };  

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/add_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // One last check to make sure user data is saved.
      const data = await response.json();
      if (response.ok) {
        console.log("User successfully added to Firestore:", data.message);
        

        // If successful, then redirect to marketplace
        navigate('/marketplace');
      } else {
        console.error("Failed to add user to Firestore:", data.error);
        alert('An error occurred. Please try again.');
        auth.signOut();
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert('An error occurred during sign-in. Please try again.');
    }
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
