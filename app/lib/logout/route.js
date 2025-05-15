import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('token', '', {
    maxAge: 0, // Expire the cookie immediately
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return NextResponse.json({ message: 'Logged out' });
}
