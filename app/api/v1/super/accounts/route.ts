import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: Retrieve all provisioned accounts
export async function GET() {
  try {
    const accounts = await prisma.adminAccount.findMany({
      select: {
        id: true,
        username: true,
        office: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

// POST: Issue new office credential
export async function POST(req: NextRequest) {
  try {
    const { username, password, office, role } = await req.json();

    if (!username || !password || !office || !role) {
      return NextResponse.json(
        { error: "Username, password, office, and role are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.adminAccount.findUnique({
      where: { username: username.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Account with username "${username}" already exists.` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await prisma.adminAccount.create({
      data: {
        username: username.trim().toLowerCase(),
        credential: hashedPassword,
        office,
        role: role.toLowerCase().trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        account: {
          id: newAccount.id,
          username: newAccount.username,
          office: newAccount.office,
          role: newAccount.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

// DELETE: Void / Revoke an office credential
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Account ID is required." }, { status: 400 });
    }

    const account = await prisma.adminAccount.findUnique({ where: { id } });

    if (!account) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    // Guard against deleting the root superadmin account
    if (account.username === "superadmin" || account.role === "super") {
      return NextResponse.json(
        { error: "Cannot void primary Super Admin master credentials." },
        { status: 403 }
      );
    }

    await prisma.adminAccount.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Credentials for "${account.username}" have been revoked.`,
    });
  } catch (error) {
    console.error("Error voiding account:", error);
    return NextResponse.json({ error: "Failed to void account." }, { status: 500 });
  }
}