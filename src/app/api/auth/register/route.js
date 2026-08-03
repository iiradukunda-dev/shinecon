import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phone, country, type, employment, password } = body;
    const email = body.email?.toLowerCase();

    if (!fullName || !email || !password || !phone) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Only official Gmail accounts (@gmail.com) are allowed' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    // Create User and MemberProfile in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        role: 'MEMBER',
        profile: {
          create: {
            fullName,
            phone,
            country,
            memberType: type.toUpperCase(), // LOCAL or DIASPORA
            employment: employment.toUpperCase(), // EMPLOYED or STUDENT
            approvalStatus: 'PENDING', // Require admin approval
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Pending admin approval.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Internal server error';
    if (error.code === 'P2002') {
      errorMessage = 'Email or phone number is already registered.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

