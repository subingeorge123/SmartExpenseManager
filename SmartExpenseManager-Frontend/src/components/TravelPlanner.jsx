import { useState } from "react";
import { planTrip } from "../services/api";

function TravelPlanner() {
  const [trip, setTrip] = useState({
    locations: "",
    budget: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setTrip(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateTrip = () => {
    if (!trip.locations.trim()) {
      setError("Please enter a location");
      return false;
    }

    if (!trip.budget || parseFloat(trip.budget) <= 0) {
      setError("Please enter a valid budget");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setResult(null);
    setError("");

    if (!validateTrip()) return;

    setLoading(true);

    try {
      const requestData = [
        {
          locations: trip.locations,
          budget: trip.budget,
        },
      ];

      console.log("Sending trip data:", requestData);

      const data = await planTrip(requestData);

      console.log("Received response:", data);

      if (data?.trip_plan) {
        setResult(data.trip_plan);
      } else if (data?.result) {
        setResult(data.result);
      } else if (typeof data === "string") {
        setResult(data);
      } else {
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to plan trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Smart Travel Planner</h2>

      <div style={styles.tripRow}>
        <input
          placeholder="Location"
          value={trip.locations}
          onChange={(e) => handleChange("locations", e.target.value)}
          style={styles.input}
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Budget"
          value={trip.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          style={styles.input}
          disabled={loading}
        />
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.submitButton,
            backgroundColor: loading ? "#9e9e9e" : "#4CAF50",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Planning..." : "Submit"}
        </button>
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>
            
          </p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {result && (
        <div style={styles.resultBox}>
          <h3 style={styles.resultTitle}>Travel Plan</h3>
          <div style={styles.resultContent}>
            <pre style={styles.resultText}>
              {typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  title: {
    marginBottom: "30px",
    fontSize: "32px",
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
    letterSpacing: "-0.5px",
  },

  tripRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "15px",
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.3s ease",
  },

  input: {
    flex: 1,
    minWidth: "150px",
    padding: "12px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
    color: "#2d3748",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },

  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
    marginBottom: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  submitButton: {
    padding: "12px 32px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  loadingContainer: {
    marginTop: "30px",
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #2196F3",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },

  loadingText: {
    color: "#2196F3",
    fontSize: "16px",
    fontWeight: "500",
    margin: 0,
  },

  errorBox: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#fff5f5",
    borderLeft: "4px solid #f44336",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },

  errorText: {
    color: "#c62828",
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5",
  },

  resultBox: {
    marginTop: "30px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },

  resultTitle: {
    padding: "20px 24px",
    margin: 0,
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "20px",
    fontWeight: "600",
  },

  resultContent: {
    padding: "24px",
    backgroundColor: "#f8f9fa",
  },

  resultText: {
    margin: 0,
    fontSize: "16px",
    color: "#2d3748",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: "1.6",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.getElementById("spinner-style")) {
  styleSheet.id = "spinner-style";
  document.head.appendChild(styleSheet);
}

export default TravelPlanner;