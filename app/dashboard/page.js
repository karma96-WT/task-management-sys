'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './local.css';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);


  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    console.log('Token is:',token);
    const res = await fetch('/api/task', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setTasks(data);
    else router.push('/login');
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/task', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      fetchTasks();
      setForm({ title: '', description: '', dueDate: '', priority: 'medium' });
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
  
    const res = await fetch(editingId ? `/api/task/${editingId}` : '/api/task', {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form),
    });
  
    const data = await res.json();
    if (res.ok) {
      fetchTasks();
      setForm({ title: '', description: '', dueDate: '', priority: 'medium' });
      setEditingId(null);
      setError('');
    } else {
      setError(data.error);
    }
  };
  const handleLogout = async () =>{
    await fetch('/lib/logout', { method: 'POST' });
    router.replace('/login');
  }
  

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`../api/task/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div className='top-div'>
      <h1 className='heading'>Dashboard</h1>
      {error && <p>{error}</p>}
      <div className='inputs'>
        <input placeholder="Title" className='title' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Description" className='title' value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="date" className='title' value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        <select className='title' value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className='title' onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? 'Update Task' : 'Add Task'}
        </button>
      </div>
      
      <div className='created-tasks'>
      <ul className='task-list-contanier'>
          {tasks.map(task => (
            <li key={task.id} className='tasks-list'>
              <p><strong>Task Title: </strong>{task.title}</p>
              <p><strong>Description: </strong>{task.description}</p>
              <p><strong>DueDate: </strong> {task.dueDate?.substring(0, 10)} </p> 
              <p><strong>Priority: </strong>{task.status}</p>
              <div className='buttons'>
                <button className='Delete-button' onClick={() => handleDelete(task.id)}>Delete</button>
                <button className='Update-button' onClick={() => {
                    setForm({
                      title: task.title,
                      description: task.description,
                      dueDate: task.dueDate?.substring(0, 10) || '',
                      priority: task.priority
                    });
                    setEditingId(task.id);
                  }}>Update</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button className='logout-button' onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
}