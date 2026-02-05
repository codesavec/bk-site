import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    // Check if user already exists
    const existingUsers = await db.users.find({ email });
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a random 10-digit account number
    const accountNumber = Math.floor(Math.random() * 9000000000 + 1000000000).toString();

    const newUser = await db.users.create({
      email,
      password, // In a real app, hash this
      fullName,
      role: 'user',
      balance: 0,
      accountNumber,
      isActive: true,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        balance: newUser.balance,
        accountNumber: newUser.accountNumber,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
