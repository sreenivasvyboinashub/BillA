"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-xl mx-auto">
        
        <h1 className="text-2xl font-bold text-black mb-4 text-center">
          Extracted Bill Data
        </h1>

        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <pre className="text-sm whitespace-pre-wrap break-all text-gray-800">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <a
          href="/upload"
          className="block text-center mt-6 bg-black text-white py-3 rounded-lg text-lg"
        >
          Scan Another Bill
        </a>

      </div>
    </div>
  );
}
