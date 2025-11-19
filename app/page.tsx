export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-xl w-full text-center">
        
        <h1 className="text-4xl font-bold text-black">
          Billa
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Upload any bill and get the details in seconds. 
          Simple, fast, and powered by AI.
        </p>

        <a
          href="/upload"
          className="inline-block mt-8 bg-black text-white py-3 px-6 rounded-lg text-lg hover:bg-gray-800 transition"
        >
          Upload Your Bill →
        </a>
        <a
          href="/dashboard"
          className="inline-block mt-8 ml-4 bg-black text-white py-3 px-6 rounded-lg text-lg hover:bg-gray-800 transition"
        >
          Dashboard →
        </a>
      </div>
    </main>
  );
}
