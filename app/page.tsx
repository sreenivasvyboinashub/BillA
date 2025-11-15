export default function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>BillA – AI Bill Scanner</h1>
      <p style={{ marginTop: 10 }}>
        Upload a bill and get structured data instantly.
      </p>

      <a
        href="/upload"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
        }}
      >
        Upload Your Bill →
      </a>
    </div>
  );
}
