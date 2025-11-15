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

    setLoading(true); // Show loader

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/parse", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    // redirect after AI is done
    router.push(`/result?data=${encodeURIComponent(JSON.stringify(json))}`);
  };

  // ----------------------------------------
  // LOADING SCREEN
  // ----------------------------------------
  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-gray-300 border-t-black"></div>

        <p className="text-gray-700 mt-6 text-lg">
          Processing your bill…
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Give me a few seconds.
        </p>
      </main>
    );
  }

  // ----------------------------------------
  // NORMAL UPLOAD UI
  // ----------------------------------------
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-semibold text-black mb-6">
          Upload Your Bill
        </h1>

        <form onSubmit={handleUpload}>
          <label
            htmlFor="bill"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-10 cursor-pointer hover:border-black transition"
          >
            {!file && (
              <p className="text-gray-600">
                Click or drag an image here
              </p>
            )}

            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="rounded-lg w-full max-h-72 object-cover shadow"
              />
            )}

            <input
              id="bill"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </label>

          <button
            type="submit"
            disabled={!file}
            className="w-full bg-black text-white py-3 rounded-lg mt-6 text-lg disabled:bg-gray-400"
          >
            Continue →
          </button>
        </form>
      </div>
    </main>
  );
}
