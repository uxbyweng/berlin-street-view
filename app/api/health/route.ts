import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      ok: true,
      message: "MongoDB connection successful",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "MongoDB connection failed",
      },
      { status: 500 }
    );
  }
}
