import React from 'react';
import './Login.css'; // Import your CSS file for styling

function Login() {
  return (
    <div className="login-container">
      <div className="image-section">
        <img src="images/silihLogo.png" alt="Logo" />
      </div>
      <div className="form-section">
        <h2>Sign In/ Sign Up</h2>
            <form>
            <div className="form-group">
                <label htmlFor="email">Sign in with Google:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <button type="submit">Login</button>
            </form>
      </div>
    </div>
  );
}

export default Login;
