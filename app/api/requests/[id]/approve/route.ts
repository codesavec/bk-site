import { db, User, Request } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { approved } = await request.json();

    const req = (await db.requests.findOneById(id)) as Request | null;
    if (!req) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Update request status
    const newStatus = approved ? 'approved' : 'rejected';
    const updatedRequest = await db.requests.updateOne(id, {
      status: newStatus,
      updatedAt: new Date(),
    });

    // If approved, process the transaction
    if (approved) {
      const user = (await db.users.findById(req.userId)) as User | null;
      if (user) {
        const amount = Number(req.amount);
        const newBalance =
          req.type === 'deposit'
            ? Number(user.balance) + amount
            : Number(user.balance) - amount;

        await db.users.updateOne(req.userId, { balance: newBalance });

        // Create transaction record
        await db.transactions.create({
          userId: req.userId,
          type: req.type === 'deposit' ? 'credit' : 'debit',
          amount: req.amount,
          description: req.description,
          date: new Date(),
          status: 'completed',
        });
      }
    }

    return NextResponse.json({ success: true, request: updatedRequest });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to approve request' },
      { status: 500 }
    );
  }
}
