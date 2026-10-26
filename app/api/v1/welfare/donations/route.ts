import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all logged donations
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { dateReceived: 'desc' },
    });
    return NextResponse.json({ donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}

// POST: Log a new monetary or item donation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { donorName, amount, item, loggedBy } = body;

    if (!donorName || (!amount && !item)) {
      return NextResponse.json(
        { error: 'Donor name and either an amount or item description are required' },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.create({
      data: {
        donorName,
        amount: amount ? parseFloat(amount) : null,
        item: item || null,
        loggedBy: loggedBy || 'Welfare Admin',
      },
    });

    return NextResponse.json({ success: true, donation }, { status: 201 });
  } catch (error) {
    console.error('Error logging donation:', error);
    return NextResponse.json({ error: 'Failed to log donation' }, { status: 500 });
  }
}