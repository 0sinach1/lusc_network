import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all council members
export async function GET() {
  try {
    const members = await prisma.councilMember.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching council members:', error);
    return NextResponse.json({ error: 'Failed to fetch council members' }, { status: 500 });
  }
}

// POST: Add a new council member with manual ID (LUSC-INT-#### or LUSC-EXT-####)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, role, contact } = body;

    if (!id || !name || !category || !role) {
      return NextResponse.json(
        { error: 'ID, name, category, and role are required' },
        { status: 400 }
      );
    }

    // Format validation for LUSC-INT-#### or LUSC-EXT-####
    const idPattern = /^LUSC-(INT|EXT)-\d{4}$/;
    if (!idPattern.test(id)) {
      return NextResponse.json(
        { error: 'ID must follow the format LUSC-INT-#### or LUSC-EXT-####' },
        { status: 400 }
      );
    }

    // Check if ID already exists
    const existing = await prisma.councilMember.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json(
        { error: `Council member with ID "${id}" already exists` },
        { status: 400 }
      );
    }

    const member = await prisma.councilMember.create({
      data: {
        id,
        name,
        category,
        role,
        contact: contact || '',
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) {
    console.error('Error adding council member:', error);
    return NextResponse.json({ error: 'Failed to add council member' }, { status: 500 });
  }
}