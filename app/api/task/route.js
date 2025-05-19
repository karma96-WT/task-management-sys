import { prisma } from '@/lib/prisma/route';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const tasks = await prisma.task.findMany({ where: { userId: decoded.id } });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(req) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    const data = await req.json();
    console.log('task data:',data);
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.priority || 'medium',
        userId: decoded.id,
      },
    });
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 400 });
  }
}