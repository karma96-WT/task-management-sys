import { prisma } from '@/lib/prisma/route';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const data = await req.json();
    const taskId = parseInt(params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (task?.userId !== decoded.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.priority,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const taskId =  parseInt(params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (task?.userId !== decoded.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.task.delete({ where: { id: taskId } });
    return NextResponse.json({ message: 'Task deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 400 });
  }
}