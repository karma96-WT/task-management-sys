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
      headers: { Authorization: `Bearer ${token}` },
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

// src/app/tasks/[id]/edit/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditTaskPage({ params }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchTask = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${params.id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setTask(data);
    } else {
      setError(data.error);
    }
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${params.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    if (res.ok) router.push('/dashboard');
    else setError(data.error);
  };

  useEffect(() => {
    fetchTask();
  }, [params.id]);

  return (
    <div>
      <h1>Edit Task</h1>
      {error && <p>{error}</p>}
      <input placeholder="Title" value={task?.title} onChange={e => setTask({ ...task, title: e.target.value })} />
      <input placeholder="Description" value={task?.description} onChange={e => setTask({ ...task, description: e.target.value })} />
      <input placeholder="Due Date" type="date" value={task?.dueDate} onChange={e => setTask({ ...task, dueDate: e.target.value })} />
      <input placeholder="Priority" value={task?.priority} onChange={e => setTask({ ...task, priority: e.target.value })} />
      <button onClick={handleUpdateTask}>Update Task</button>
    </div>
  );
}