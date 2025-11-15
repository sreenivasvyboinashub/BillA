import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Bills API coming soon" });
}

export async function POST() {
  return NextResponse.json({ message: "POST endpoint coming soon" });
}
