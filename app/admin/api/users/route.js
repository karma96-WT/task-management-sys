import { prisma } from '../../../lib/prisma/route';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('API error: ',error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
