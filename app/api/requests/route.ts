import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const status = request.nextUrl.searchParams.get('status');

    const query: any = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const requests = await db.requests.find(query);

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, amount, description } = await request.json();

    if (type === 'deposit') {
      const user = await db.users.findById(userId);
      // Create an alert for admin
      await db.alerts.create({
        userId,
        userName: user?.fullName || 'Unknown User',
        type: 'deposit_attempt',
        message: `User attempted a deposit of $${amount}. Action blocked, user advised to contact admin.`,
        amount,
        status: 'unread',
        createdAt: new Date(),
      });

      return NextResponse.json(
        { error: 'Deposit failed. Please contact admin to complete this transaction.' },
        { status: 403 }
      );
    }

    const newRequest = await db.requests.create({
      userId,
      type,
      amount,
      description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
