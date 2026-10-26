import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all delivery pickup requests
export async function GET() {
  try {
    const pickups = await prisma.pickupRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ pickups });
  } catch (error) {
    console.error('Error fetching pickup requests:', error);
    return NextResponse.json({ error: 'Failed to fetch pickup requests' }, { status: 500 });
  }
}

// POST: Log or request a new delivery pickup
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, regNo, type, destination } = body;

    if (!studentName || !regNo || !type || !destination) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Fee calculation based on delivery location spec
    // Hall delivery = ₦2,000 | Welfare Office pickup = ₦1,500
    const fee = destination === 'HALL' ? 2000 : 1500;

    // Generate reference code e.g. PKP-4821
    const reference = `PKP-${Math.floor(1000 + Math.random() * 9000)}`;

    const pickup = await prisma.pickupRequest.create({
      data: {
        reference,
        studentName,
        regNo,
        type, // "STANDARD" or "EMERGENCY" (3-hour)
        destination, // "HALL" or "WELFARE_OFFICE"
        fee,
      },
    });

    return NextResponse.json({ success: true, pickup }, { status: 201 });
  } catch (error) {
    console.error('Error creating pickup request:', error);
    return NextResponse.json({ error: 'Failed to create pickup request' }, { status: 500 });
  }
}

// PATCH: Update pickup status (e.g. PENDING -> DISPATCHED -> COMPLETED)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.pickupRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, pickup: updated });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    return NextResponse.json({ error: 'Failed to update pickup status' }, { status: 500 });
  }
}