"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);

  // 1️⃣ Extract JSON from URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const raw = params.get("data");

    if (!raw) {
      setData({ error: "No result received." });
      return;
    }

    try {
      setData(JSON.parse(raw));
    } catch {
      setData({ raw });
    }
  }, []);

  // 2️⃣ AUTO-SAVE BILL TO DATABASE
  useEffect(() => {
    if (!data) return;
    if (data.raw) return; // skip if raw error

    fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((err) => console.error("Database save failed:", err));
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        Loading…
      </div>
    );
  }

  const isRaw = data.raw !== undefined;

  // Category Badge Colors
  const categoryColors: any = {
    Fuel: "bg-blue-100 text-blue-700",
    Grocery: "bg-green-100 text-green-700",
    Food: "bg-amber-100 text-amber-700",
    Shopping: "bg-purple-100 text-purple-700",
    Medicine: "bg-red-100 text-red-700",
    Other: "bg-gray-200 text-gray-700",
  };

  const catColor =
    categoryColors[data.category] || "bg-gray-100 text-gray-700";

  // Vendor Icons
  const vendorIcons: any = {
    "Circle K": "⛽",
    Walmart: "🛒",
    Amazon: "📦",
    Costco: "🏬",
    Default: "🧾",
  };

  const vendorIcon = vendorIcons[data.vendor] || vendorIcons.Default;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 animate-fadeIn">
      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-6xl">{vendorIcon}</div>
          <h1 className="text-3xl font-bold text-black mt-3">Bill Summary</h1>
          <p className="text-gray-500 mt-1 text-lg">
            AI processed your bill with high accuracy.
          </p>
        </div>

        {/* BILL CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-200 animate-slideUp">

          {/* Vendor + Category */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">{data.vendor}</h2>

            {data.category && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${catColor}`}
              >
                {data.category}
              </span>
            )}
          </div>

          {/* Date */}
          {data.date && (
            <div className="text-gray-600 text-lg flex items-center gap-2">
              📅 <span>{data.date}</span>
            </div>
          )}

          <hr className="border-gray-300" />

          {/* ITEMS */}
          {data.items && data.items.length > 0 && (
            <div>
              <h3 className="text-gray-800 font-semibold mb-3 text-lg">
                Items
              </h3>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                {data.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between py-1 text-gray-700"
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-gray-300" />

          {/* TOTALS */}
          <div className="space-y-3 text-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                ${Number(data.subtotal).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">
                ${Number(data.tax).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-xl pt-2">
              <span className="font-bold text-black">Total</span>
              <span className="font-bold text-black">
                ${Number(data.total).toFixed(2)}
              </span>
            </div>

            {data.payment_method && (
              <div className="flex justify-between pt-1">
                <span className="text-gray-600">Payment</span>
                <span className="font-semibold">{data.payment_method}</span>
              </div>
            )}
          </div>

          {/* AI Confidence */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3">
            <p className="text-blue-700 font-semibold">
              🤖 AI Confidence: High
            </p>
            <p className="text-blue-600 text-sm">
              Your bill had clear text and structure.
            </p>
          </div>
          <a
          href="/dashboard"
          className="inline-block mt-8 ml-4 bg-black text-white py-3 px-6 rounded-lg text-lg hover:bg-gray-800 transition"
        >
          Dashboard →
          </a>

        </div>
            
        {/* JSON TOGGLE */}
        {!isRaw && (
          <button
            onClick={() => setShowJson(!showJson)}
            className="w-full mt-6 bg-black text-white py-3 rounded-xl text-lg font-medium transition hover:bg-gray-900"
          >
            {showJson ? "Hide Raw JSON" : "Show Raw JSON"}
          </button>
        )}

        {showJson && (
          <pre className="bg-white mt-4 p-4 rounded-xl border border-gray-300 shadow text-sm text-gray-900 whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        
      </div>
        
        {/* Scan Again */}
        <a
          href="/upload"
          className="block text-center mt-8 text-black underline text-lg font-medium"
        >
          Scan Another Bill →
        </a>
        
    </div>
  );
}
