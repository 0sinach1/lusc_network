import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all missing items
export async function GET() {
  try {
    const items = await prisma.missingItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching missing items:', error);
    return NextResponse.json({ error: 'Failed to fetch missing items' }, { status: 500 });
  }
}

// POST: Register a newly found item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemName, category, location, description } = body;

    if (!itemName || !category || !location) {
      return NextResponse.json(
        { error: 'Item name, category, and location are required' },
        { status: 400 }
      );
    }

    const item = await prisma.missingItem.create({
      data: {
        itemName,
        category,
        location,
        description: description || '',
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('Error logging missing item:', error);
    return NextResponse.json({ error: 'Failed to log item' }, { status: 500 });
  }
}

// PATCH: Update item status (e.g. mark as CLAIMED)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, claimedBy } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.missingItem.update({
      where: { id },
      data: {
        status,
        claimedBy: claimedBy || null,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating item status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}