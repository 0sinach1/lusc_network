import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all welfare applications
export async function GET() {
  try {
    const applications = await prisma.welfareApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching welfare applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// POST: Submit a new welfare application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentName, regNo, type, description } = body;

    if (!studentName || !regNo || !type || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Generate a unique reference code (e.g., WEL-8342)
    const reference = `WEL-${Math.floor(1000 + Math.random() * 9000)}`;

    const application = await prisma.welfareApplication.create({
      data: {
        reference,
        studentName,
        regNo,
        type,
        description,
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}