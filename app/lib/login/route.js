import { NextResponse } from 'next/server';
import { prisma } from '../prisma/route'; // update path as needed
import bcrypt from 'bcryptjs';
import { generateToken } from '../auth'; // update path as needed
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../session/session.js';
import { cookies } from 'next/headers';

export async function POST(req) {
  const body = await req.json();
  const { username, password } = body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken({ id: user.id, role: user.role });


  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 days
  });



  return NextResponse.json({ token });
}
