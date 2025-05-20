import prisma from '@/app/lib/prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    const data = await req.json();
    const existingUser = await prisma.user.findUnique({where: {email: data.email}});
    if (existingUser){
        return NextResponse.json({error: 'Username already taken'},{status:400});

    }
    const hashedPassword = await bcrypt.hash(data.password,10);
    const user = await prisma.user.create({
        data:{
            name: data.name,
            username:data.username,
            email : data.email,
            password : hashedPassword,
        }
    });
    return NextResponse.json({ id: user.id});
}