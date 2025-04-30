import {prisma} from '../prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '../auth';

export async function POST(req) {
    const {username,password} = await req.json();
    const user = await prisma.user.findUnique({where: {username}});
    if (!user || !(await bcrypt.compare(password, user.password))){
        return NextResponse.json({error: 'Invalid credentials'},{status:401});

    }
    const token = generateToken({id: user.id});
    return NextResponse.json({token});
    
}