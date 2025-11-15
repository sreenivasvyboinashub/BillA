"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/parse", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    // Redirect to /result with JSON data encoded
    window.location.href =
      "/result?data=" + encodeURIComponent(JSON.stringify(data));
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Upload Bill</h1>

      <input type="file" accept="image/*" onChange={handleFile} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img src={preview} width={300} />
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "black",
            color: "white",
            borderRadius: 6,
          }}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      )}
    </div>
  );
}
