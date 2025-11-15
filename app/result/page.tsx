"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // This runs only on the client
    const params = new URLSearchParams(window.location.search);
    const dataStr = params.get("data");

    if (dataStr) {
      try {
        setData(JSON.parse(dataStr));
      } catch {
        setData({ raw: dataStr });
      }
    }
  }, []);

  if (!data) {
    return <div style={{ padding: 20 }}>Loading result...</div>;
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Extracted Bill Data</h1>

      <pre
        style={{
          background: "#f2f2f2",
          padding: 20,
          borderRadius: 6,
          marginTop: 20,
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "green",
          color: "white",
          borderRadius: 6,
        }}
      >
        Save to Dashboard
      </button>
    </div>
  );
}
