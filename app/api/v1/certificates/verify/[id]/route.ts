import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: "Certificate ID is required." },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate record not found in council archives." },
        { status: 404 }
      );
    }

    const cert = certificate as any;

    return NextResponse.json({
      success: true,
      certificate: {
        id: cert.id,
        // Checks all possible field names including student and description
        recipientName:
          cert.student ||
          cert.studentName ||
          cert.recipient ||
          cert.recipientName ||
          cert.name ||
          "Student Recipient",
        regNo:
          cert.regNo ||
          cert.matricNo ||
          cert.studentRegNo ||
          "LUSC-VERIFIED",
        title:
          cert.description ||
          cert.title ||
          cert.honor ||
          cert.event ||
          cert.role ||
          "Certificate of Honor",
        office:
          cert.issuerOffice ||
          cert.office ||
          "Vice Chairman (VCM) - LUSC Executive Council",
        status: (cert.status || "VALID").toString().toUpperCase(),
        issueDate:
          cert.createdAt ||
          cert.issueDate ||
          cert.date ||
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Verification lookup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during record verification." },
      { status: 500 }
    );
  }
}