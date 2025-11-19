"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bills")
      .then((res) => res.json())
      .then((data) => {
        setBills(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-lg">
        Loading dashboard…
      </div>
    );
  }

  // Helpers
  const toNum = (x: any) => Number(x) || 0;

  // TODAY details
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // TOTAL SPENT
  const totalSpent = bills.reduce((acc, b) => acc + toNum(b.total), 0);

  // CATEGORY TOTALS
  const foodTotal = bills
    .filter((b) => b.category === "Food")
    .reduce((acc, b) => acc + toNum(b.total), 0);

  const fuelTotal = bills
    .filter((b) => b.category === "Fuel")
    .reduce((acc, b) => acc + toNum(b.total), 0);

  const groceryTotal = bills
    .filter((b) => b.category === "Grocery")
    .reduce((acc, b) => acc + toNum(b.total), 0);

  // MONTHLY SPENDING (This month)
  const monthlySpent = bills
    .filter((b) => {
      const d = new Date(b.createdAt);
      return d.getMonth() + 1 === currentMonth;
    })
    .reduce((acc, b) => acc + toNum(b.total), 0);

  // YEARLY SPENDING (This year)
  const yearlySpent = bills
    .filter((b) => {
      const d = new Date(b.createdAt);
      return d.getFullYear() === currentYear;
    })
    .reduce((acc, b) => acc + toNum(b.total), 0);

  // MONTH-BY-MONTH SUMMARY
  const monthlyBreakdown: any = {};

  bills.forEach((b) => {
    const date = new Date(b.createdAt);
    const month = date.toLocaleString("default", { month: "short" });
    monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + toNum(b.total);
  });

  const categoryColors: any = {
    Fuel: "bg-blue-100 text-blue-700",
    Grocery: "bg-green-100 text-green-700",
    Food: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your spending smartly</p>
        </div>

        {/* OVERVIEW */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>

          <div className="grid grid-cols-2 gap-4 text-center mt-4">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold">${monthlySpent.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-gray-600 text-sm">This Year</p>
              <p className="text-2xl font-bold">${yearlySpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* CATEGORY SPENDING */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Spending by Category
          </h2>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="font-semibold text-amber-700">Food</p>
              <p className="font-bold text-xl">${foodTotal.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="font-semibold text-blue-700">Fuel</p>
              <p className="font-bold text-xl">${fuelTotal.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="font-semibold text-green-700">Groceries</p>
              <p className="font-bold text-xl">${groceryTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* MONTHLY TOTALS */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Breakdown
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {Object.keys(monthlyBreakdown).map((month) => (
              <div key={month} className="bg-gray-50 p-4 rounded-xl border text-center">
                <p className="font-semibold text-gray-700">{month}</p>
                <p className="font-bold text-lg">
                  ${monthlyBreakdown[month].toFixed(2)}
                </p>
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
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border"
              >
                <div>
                  <p className="text-lg font-semibold text-black">{b.vendor}</p>
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
          </div>
        </div>

        {/* Scan Again */}
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
