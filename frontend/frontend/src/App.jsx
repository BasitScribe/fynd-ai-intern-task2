import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

function UserDashboard() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/submit_review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(rating), review }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to call backend" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Dashboard</h2>
      <p>Rate your experience and leave a short review.</p>

      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 12 }}>
        <textarea
          rows={4}
          style={{ width: "100%", padding: 8 }}
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 12, padding: "8px 16px" }}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      {result && (
        <div style={{ marginTop: 20, borderTop: "1px solid #ddd", paddingTop: 10 }}>
          <h3>AI Analysis</h3>
          {result.error && <p style={{ color: "red" }}>{result.error}</p>}
          {!result.error && (
            <>
              <p><strong>Summary:</strong> {result.summary}</p>
              <p><strong>Recommended Action:</strong> {result.recommended_action}</p>
              <p><strong>AI Response:</strong> {result.ai_response}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin_data`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <button onClick={fetchData} style={{ marginBottom: 10 }}>
        Refresh
      </button>
      {loading && <p>Loading...</p>}
      {!loading && entries.length === 0 && <p>No entries yet.</p>}

      {entries.length > 0 && (
        <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Summary</th>
              <th>Recommended Action</th>
              <th>AI Response</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, idx) => (
              <tr key={idx}>
                <td>{e.timestamp}</td>
                <td>{e.rating}</td>
                <td>{e.review}</td>
                <td>{e.summary}</td>
                <td>{e.recommended_action}</td>
                <td>{e.ai_response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function App() {
  const [view, setView] = useState("user");

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#222",
          color: "#fff",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Fynd AI Feedback System</h1>
        <div>
          <button
            onClick={() => setView("user")}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              background: view === "user" ? "#fff" : "#444",
              color: view === "user" ? "#000" : "#fff",
            }}
          >
            User Dashboard
          </button>
          <button
            onClick={() => setView("admin")}
            style={{
              padding: "6px 12px",
              background: view === "admin" ? "#fff" : "#444",
              color: view === "admin" ? "#000" : "#fff",
            }}
          >
            Admin Dashboard
          </button>
        </div>
      </header>

      {view === "user" ? <UserDashboard /> : <AdminDashboard />}
    </div>
  );
}

export default App;
