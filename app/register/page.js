'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './local.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  

  const handleRegister = async () => {
    const res = await fetch('/lib/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) router.push('/login');
    else setError(data.error);
  };

  return (
    <div className='body'>
      <h1>Register</h1>
      {error && <p>{error}</p>}
      <input placeholder="Name" className='inputs' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Username" className='inputs' value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Email" className='inputs' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" className='inputs' type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleRegister} className='register'>Register</button>
    </div>
  );
}