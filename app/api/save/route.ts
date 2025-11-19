export const runtime = "nodejs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";



const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const saved = await prisma.bill.create({
      data: {
        vendor: data.vendor,
        date: data.date,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        category: data.category,
        paymentMethod: data.payment_method,
        items: data.items,
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Database save failed" },
      { status: 500 }
    );
  }
}
