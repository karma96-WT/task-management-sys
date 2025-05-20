'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateTask = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) router.push('/dashboard');
    else setError(data.error);
  };

  return (
    <div>
      <h1>Create Task</h1>
      {error && <p>{error}</p>}
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Due Date" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
      <input placeholder="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} />
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
}
