import { db, User } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const query: any = {};
    if (userId) query.userId = userId;

    const transactions = await db.transactions.find(query);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, amount: rawAmount, description } = await request.json();
    const amount = Number(rawAmount);

    const transaction = await db.transactions.create({
      userId,
      type,
      amount,
      description,
      date: new Date(),
      status: 'completed',
    });

    // Update user balance
    const user = (await db.users.findById(userId)) as User | null;
    if (user) {
      const newBalance =
        type === 'credit' ? Number(user.balance) + amount : Number(user.balance) - amount;
      await db.users.updateOne(userId, { balance: newBalance });
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
