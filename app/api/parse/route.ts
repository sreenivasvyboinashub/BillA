import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert image to Base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const prompt = `
Extract structured data from this bill image.
Return ONLY valid JSON.
Do NOT wrap output in backticks.
Schema:

{
  "vendor": "string",
  "date": "YYYY-MM-DD",
  "items": [ { "name": "string", "price": number } ],
  "subtotal": number,
  "tax": number,
  "total": number,
  "category": "string",
  "payment_method": "string"
}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64}`,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const result = await response.json();

    // Extract raw text
    let text = result.choices?.[0]?.message?.content || "";

    // Remove unwanted format
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
