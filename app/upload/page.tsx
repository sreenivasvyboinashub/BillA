"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    router.push(`/result?pending=true`);
    fetch("/api/parse", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        router.push(`/result?data=${encodeURIComponent(JSON.stringify(json))}`);
      });
  };

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
