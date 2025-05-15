'use client';
import './local.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as jwt_decode from 'jwt-decode';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // if(username === 'admin' && password==='admin@123'){
    //   router.push('/admin');
    // } 
   // else{
      const res = await fetch('/lib/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        const decoded = decodeToken(data.token);
        console.log("Decoded token: ", decoded);
        localStorage.setItem('token', data.token);
        if(decoded.role==='admin'){
          router.push('/admin');
        }
        else{
          router.push('/dashboard');
        }
        
      } else {
        setError(data.error);
      }
   // }
  };

  function decodeToken(token) {
    const payload = token.split('.')[1]; // Get the payload part of the token
    const decoded = JSON.parse(atob(payload)); // Decode from Base64
    return decoded;
  }

  return (
    <div className='login-body-div'>
      <div className='top-para'>
        <h1 className='heading-1'>Login Here</h1>
        <p className='login-para'>Make sure you provide the correct credentials</p>
      </div>
      {error && <p>{error}</p>}
      <input placeholder="Username" className='username-input' value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" className='password-input' type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}className='login-button'>Login</button>
    </div>
  );
}
