import { useState } from 'react';
import './login.css';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from './supabaseClient.js';

export default function Login(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  
  const handleLogin=(e)=>{
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simple authentication check
    setTimeout(()=>{
      if(username===ADMIN_USERNAME && password===ADMIN_PASSWORD){
        // Set session di localStorage
        localStorage.setItem('admin_logged_in','true');
        localStorage.setItem('admin_username',username);
        // Redirect ke dashboard
        window.location.hash='#/admin';
      }else{
        setError('Username atau password salah');
        setLoading(false);
      }
    },500);
  };
  
  return <div className="login-page">
    <div className="login-container">
      <div className="login-left">
        <div className="login-bg-overlay"></div>
        <img src="/assets/logo-removebg.png" alt="PROTEK Logo" className="login-logo"/>
        <h1>Admin Dashboard</h1>
        <p>Kelola konten blog dan artikel untuk website PROTEK Laundry Solution</p>
      </div>
      
      <div className="login-right">
        <div className="login-card">
          <h2>Login Admin</h2>
          <p className="login-subtitle">Masukkan kredensial Anda untuk mengakses dashboard</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e=>setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
              />
            </div>
            
            {error&&<div className="error-message">{error}</div>}
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading?'Loading...':'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>;
}
