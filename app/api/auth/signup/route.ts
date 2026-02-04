import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { generateVerificationEmailHTML } from "@/lib/email";
import { featureFlags } from "@/lib/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Check if registrations are enabled
    if (!featureFlags.registrationEnabled) {
      return NextResponse.json(
        { message: "Registrations are currently disabled" },
        { status: 403 }
      );
    }

    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json({ message: "Invalid username" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        page: { create: {} },
      },
    });

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await resend.emails.send({
      from: "Puls <noreply@updates.aevorastudios.com>",
      to: email,
      subject: "Verify your Puls account",
      html: generateVerificationEmailHTML(token),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal error" },
      { status: 500 }
    );
  }
}
