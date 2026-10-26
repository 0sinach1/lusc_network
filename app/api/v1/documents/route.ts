import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all official documents and memos
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST: Register a new memo or official document link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memoName, title, signedBy, year, fileLink } = body;

    if (!memoName || !title || !signedBy || !year || !fileLink) {
      return NextResponse.json(
        { error: 'All fields (memoName, title, signedBy, year, fileLink) are required' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        memoName,
        title,
        signedBy,
        year: parseInt(year, 10),
        fileLink,
      },
    });

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch (error) {
    console.error('Error archiving document:', error);
    return NextResponse.json({ error: 'Failed to archive document' }, { status: 500 });
  }
}