import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser, signAuthToken, SESSION_COOKIE_NAME } from "@/lib/auth/jwt";
import { getPrismaClient } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const prisma = await getPrismaClient();
  // Use prisma here for database operations
  // const users = await prisma.user.findMany();
  
  return NextResponse.json({ success: true, user });
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const prisma = await getPrismaClient();
    const body = await req.json();
    const { name, username, email, avatar, password } = body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (username) dataToUpdate.username = username;
    if (email) dataToUpdate.email = email;
    if (avatar !== undefined) dataToUpdate.avatar = avatar;

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: { id: true, name: true, username: true, email: true, avatar: true, role: true }
    });
