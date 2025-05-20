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
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
      {task && (
        <>
          <input placeholder="Title" value={task.title} onChange={e => setTask({ ...task, title: e.target.value })} />
          <input placeholder="Description" value={task.description} onChange={e => setTask({ ...task, description: e.target.value })} />
          <input placeholder="Due Date" type="date" value={task.dueDate} onChange={e => setTask({ ...task, dueDate: e.target.value })} />
          <input placeholder="Priority" value={task.priority} onChange={e => setTask({ ...task, priority: e.target.value })} />
          <button onClick={handleUpdateTask}>Update Task</button>
        </>
      )}
    </div>
  );
}
