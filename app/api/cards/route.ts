import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const query: any = {};
    if (userId) query.userId = userId;

    const cards = await db.cards.find(query);
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, cardNumber, cardType, expiryDate, holderName } =
      await request.json();

    const card = await db.cards.create({
      userId,
      cardNumber,
      cardType,
      expiryDate,
      holderName,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, card });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}
