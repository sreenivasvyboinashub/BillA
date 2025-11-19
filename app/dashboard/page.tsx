"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bills from your API
  useEffect(() => {
    fetch("/api/bills")
      .then((res) => res.json())
      .then((data) => {
        setBills(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Total spend calculation
  const totalSpent = bills.reduce((sum, b) => sum + Number(b.total), 0);

  // Category summary
  const categoryTotals: any = {};
  bills.forEach((b) => {
    const cat = b.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(b.total);
  });

  const categoryColors: any = {
    Fuel: "bg-blue-100 text-blue-700",
    Grocery: "bg-green-100 text-green-700",
    Food: "bg-amber-100 text-amber-700",
    Shopping: "bg-purple-100 text-purple-700",
    Medicine: "bg-red-100 text-red-700",
    Other: "bg-gray-200 text-gray-700",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-lg">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-black">Your Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your scanned bills</p>
        </div>

        {/* TOTAL SPENT CARD */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Total Spent</h2>
          <p className="text-4xl font-bold text-black mt-2">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        {/* CATEGORY SUMMARY */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Spending by Category
          </h2>

          <div className="space-y-2">
            {Object.keys(categoryTotals).map((cat) => (
              <div
                key={cat}
                className="flex justify-between bg-gray-50 p-3 rounded-xl border border-gray-200"
              >
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    categoryColors[cat] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {cat}
                </span>
                <span className="font-bold text-gray-800">
                  ${categoryTotals[cat].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT BILLS */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Bills
          </h2>

          <div className="space-y-4">
            {bills.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200"
              >
                <div>
                  <p className="text-lg font-semibold text-black">
                    {b.vendor}
                  </p>
                  <p className="text-gray-500 text-sm">{b.date}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-black text-lg">
                    ${Number(b.total).toFixed(2)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categoryColors[b.category] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.category}
                  </span>
                </div>
              </div>
            ))}

            {bills.length === 0 && (
              <p className="text-gray-600 text-center py-6">
                No bills saved yet.
              </p>
            )}
          </div>
        </div>

        {/* SCAN AGAIN BUTTON */}
        <a
          href="/upload"
          className="block w-full text-center bg-black text-white py-3 rounded-xl text-lg font-semibold"
        >
          Scan New Bill →
        </a>
      </div>
    </div>
  );
}
