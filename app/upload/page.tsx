"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/parse", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    router.push(`/result?data=${encodeURIComponent(JSON.stringify(json))}`);
  };

  // LOADING SCREEN — PREMIUM
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
        {/* Animated loader */}
        <div className="loader-premium"></div>

        <p className="text-gray-700 mt-8 text-lg font-medium animate-fadeIn">
          Reading your bill…
        </p>

        <p className="text-gray-500 text-sm mt-2 animate-fadeIn">
          Sit tight. This will only take a moment.
        </p>
      </main>
    );
  }

  // UPLOAD UI — PREMIUM+
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gray-100">
      <div className="max-w-xl w-full">

        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Upload Your Bill
        </h1>

        <form onSubmit={handleUpload} className="space-y-6">
          <label
            htmlFor="bill"
            className="relative block rounded-2xl border border-gray-300 bg-white/30 backdrop-blur-xl p-10 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 text-center group"
          >
            {/* Floating Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>

            {!file && (
              <div className="text-gray-600">
                <div className="text-5xl mb-3">📄</div>
                <p className="text-lg font-medium">Tap to upload your bill</p>
                <p className="text-sm mt-1 text-gray-500">JPEG, PNG supported</p>
              </div>
            )}

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="rounded-xl w-full max-h-80 object-cover shadow-md animate-fadeIn"
              />
            )}

            <input
              id="bill"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
            />
          </label>

          <button
            type="submit"
            disabled={!file}
            className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </form>
      </div>
    </main>
  );
}
