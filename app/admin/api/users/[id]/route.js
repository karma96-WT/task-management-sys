import { prisma } from '../../../../lib/prisma/route';
import { NextResponse } from 'next/server';

export async function DELETE(_, { params }) {
  try {
    const userId = parseInt(params.id);
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
