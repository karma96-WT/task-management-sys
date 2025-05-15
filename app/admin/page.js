'use client';
import './local.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn]= useState(false);
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
      try{
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setIsLoggedIn(true);

        if(decoded.role !== 'admin'){
          router.push('/login');
        }
      }
      catch(err){
        console.error('Invalid token:', err);
        setIsLoggedIn(false);  // Invalid token, so not logged in
        router.push('/login');
      }
    }else {
      setIsLoggedIn(false);  // No token, so not logged in
      router.push('/login'); // Redirect to login page
    }

  }, []);

  const fetchUsers = async () => {
    try {
        const res = await fetch('/admin/api/users');
    
        if (!res.ok) {
          const text = await res.text();
          console.error('Server returned error:', res.status, text);
          return;
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
  };
  const handelLogout = async () =>{
    await fetch('/lib/logout', { method: 'POST' });
    router.replace('/login');
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if(!confirmed) return;
    await fetch(`/admin/api/users/${id}`, { method: 'DELETE' });
    fetchUsers(); // Refresh list
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (!isLoggedIn) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className='body'>
      <h1>Admin Page</h1>
      <ul>
        {users.map(user => (
          <li key={user.id} className='user-list'>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button className='delete-button' onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button className='logout-button' onClick={handelLogout}>Logout</button>
    </div>
  );
}
