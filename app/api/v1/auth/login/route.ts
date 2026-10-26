import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lusc-platform-super-secret-key-2026"
);

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    // 1. Look up account in the AdminAccount table
    const account = await prisma.adminAccount.findUnique({
      where: { username },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // 2. Compare against the 'credential' field in DB
    const isValidPassword = await bcrypt.compare(password, account.credential);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // 3. Resolve role to exact /admin/* office path
    const normalizedRole = (account.role || "").toLowerCase().trim();
    const redirectUrl =
      normalizedRole === "super" || normalizedRole === "superadmin"
        ? "/admin/super"
        : `/admin/${normalizedRole}`;

    // 4. Issue session JWT
    const token = await new SignJWT({
      id: account.id,
      username: account.username,
      office: account.office,
      role: normalizedRole,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        username: account.username,
        office: account.office,
        role: normalizedRole,
      },
    });

    // 5. Store session in HTTP-only cookie
    response.cookies.set("lusc_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Server error during authentication." },
      { status: 500 }
    );
  }
}