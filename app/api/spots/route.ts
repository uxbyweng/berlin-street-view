import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Spot } from "@/lib/models/spot";

export async function GET() {
  try {
    await connectDB();
    const spots = await Spot.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, data: spots });
  } catch (error) {
    console.error("GET /api/spots error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to fetch spots" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const newSpot = await Spot.create({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl ?? "",
      locationName: body.locationName,
      coordinates: body.coordinates ?? undefined,
      tags: body.tags ?? [],
    });

    return NextResponse.json({ ok: true, data: newSpot }, { status: 201 });
  } catch (error) {
    console.error("POST /api/spots error:", error);

    return NextResponse.json(
      { ok: false, message: "Failed to create spot" },
      { status: 500 }
    );
  }
}
