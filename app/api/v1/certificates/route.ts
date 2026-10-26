import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List all issued certificates
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

// POST: Issue a new certificate with non-sequential UUID
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientName, description, issuedBy } = body;

    if (!recipientName || !description) {
      return NextResponse.json(
        { error: 'Recipient name and description are required' },
        { status: 400 }
      );
    }

    // Prisma automatically handles the non-sequential UUID generation via @default(uuid())
    const newCertificate = await prisma.certificate.create({
      data: {
        recipientName,
        description,
        issuedBy: issuedBy || 'Vice Chairman Office',
      },
    });

    return NextResponse.json({ success: true, certificate: newCertificate }, { status: 201 });
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 });
  }
}