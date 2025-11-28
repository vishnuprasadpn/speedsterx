import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema, sanitizeString } from "@/lib/validation";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limiting - 5 registrations per 15 minutes per IP
    const clientId = getClientIdentifier(request);
    const rateLimitResult = rateLimit(`register:${clientId}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate and sanitize input
    const validationResult = registerSchema.safeParse({
      name: sanitizeString(body.name || ""),
      email: (body.email || "").toLowerCase().trim(),
      password: body.password,
      phone: body.phone ? sanitizeString(body.phone) : "",
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    // Don't leak error details
    console.error("Registration error:", error);
    
    // Handle Prisma unique constraint error
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

