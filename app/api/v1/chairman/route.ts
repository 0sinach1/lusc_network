import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all disciplinary records and chairman suggestions
export async function GET() {
  try {
    const [disciplinaryRecords, suggestions] = await Promise.all([
      prisma.disciplinaryRecord.findMany({ orderBy: { actionDate: 'desc' } }),
      prisma.chairmanSuggestion.findMany({ orderBy: { date: 'desc' } }),
    ]);

    return NextResponse.json({ disciplinaryRecords, suggestions });
  } catch (error) {
    console.error('Error fetching Chairman data:', error);
    return NextResponse.json({ error: 'Failed to fetch chairman data' }, { status: 500 });
  }
}

// POST: Add a disciplinary booking OR post a suggestion
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actionType } = body;

    if (actionType === 'DISCIPLINARY') {
      const { studentName, regNo, offenseDescription } = body;

      if (!studentName || !regNo || !offenseDescription) {
        return NextResponse.json(
          { error: 'Student name, regNo, and offense description are required' },
          { status: 400 }
        );
      }

      const record = await prisma.disciplinaryRecord.create({
        data: {
          studentName,
          regNo,
          offenseDescription,
          status: 'Booked',
        },
      });

      return NextResponse.json({ success: true, record }, { status: 201 });
    }

    if (actionType === 'SUGGESTION') {
      const { targetOffice, suggestionText } = body;

      if (!targetOffice || !suggestionText) {
        return NextResponse.json(
          { error: 'Target office and suggestion text are required' },
          { status: 400 }
        );
      }

      const suggestion = await prisma.chairmanSuggestion.create({
        data: {
          targetOffice,
          suggestionText,
          status: 'Pending Review',
        },
      });

      return NextResponse.json({ success: true, suggestion }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid actionType' }, { status: 400 });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// PATCH: Update disciplinary record status (e.g. "Booked" -> "Processed to M&S")
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.disciplinaryRecord.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error('Error updating disciplinary record status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}