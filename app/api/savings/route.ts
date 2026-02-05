import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    const savings = await db.savings.find({ userId });
    return NextResponse.json(savings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch savings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, targetAmount, monthlyAmount } = await request.json();

    const newSaving = await db.savings.create({
      userId,
      name,
      targetAmount,
      monthlyAmount,
      currentAmount: 0,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, saving: newSaving });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create saving goal' },
      { status: 500 }
    );
  }
}
