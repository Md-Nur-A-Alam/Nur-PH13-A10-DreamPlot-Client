import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.role !== 'Admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();

    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ error: "Email, password and name are required" }, { status: 400 });
    }

    const newUser = await auth.api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
        role: body.role || 'Admin',
        dob: body.dob || '1990-01-01',
        phone: body.phone || '01000000000',
        address: body.address || 'N/A',
        gender: body.gender || 'Other',
        profession: body.profession || 'Administrator',
        isActive: true
      }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user from admin:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}
