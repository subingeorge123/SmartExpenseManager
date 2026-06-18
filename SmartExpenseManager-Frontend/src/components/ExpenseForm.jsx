import { useState, useEffect } from "react";
import {
  convertToEuro,
  getLocation,
  getAvailableCurrencies,
  compressImage,
  submitExpenseData,
} from "../services/api";
import Map from "./Map";

function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [category, setCategory] = useState("Food & Dining");
  const [currencies, setCurrencies] = useState([]);
  const [conversionResult, setConversionResult] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLocation, setShowLocation] = useState(false);

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Groceries",
    "Other",
  ];

  useEffect(() => {
    const loadCurrencies = async () => {
      const list = await getAvailableCurrencies();
      setCurrencies(list);
    };

    loadCurrencies();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File size too large. Max 20MB");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await compressImage(file);
      if (result && result.compressedImageUrl) {
        setCompressedImage(result.compressedImageUrl);
        if (result.blob) {
          setImageBlob(result.blob);
        }
        setError(null);
      } else {
        throw new Error("No image URL in response");
      }
    } catch (err) {
      console.error("Compression error:", err);
      setError(err.message || "Failed to compress image");
      setCompressedImage(null);
      setImageBlob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCompressedImage(null);
    setImageBlob(null);
    setError(null);
  };

  const fetchLocation = async () => {
    setLocationLoading(true);
    try {
      const locationData = await getLocation();
      setLocation(locationData);
      setError(null);
      setShowLocation(true);
    } catch (error) {
      console.error("Location fetch error:", error);
      setError("Failed to get location");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!amount || !currency) {
      setError("Please enter amount and select currency");
      return;
    }

    setLoading(true);
    try {
      const result = await convertToEuro(amount, currency);
      setConversionResult(result);
      setError(null);
    } catch (err) {
      setError("Currency conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      if (imageBlob) formData.append("image", imageBlob);
      formData.append("category", category);
      formData.append("amount", conversionResult.convertedAmount);
      formData.append("location", location?.formatted || "");
      await submitExpenseData(formData);

      // reset
      setAmount("");
      setConversionResult(null);
      setCompressedImage(null);
      setImageBlob(null);
      setLocation(null);
    } catch (error) {
      setError("Submit failed");
    } finally {
      setLoading(false);
    }
  };
  const onClear = () => {
    setAmount("");
    setCurrency("EUR");
    setCategory("Food & Dining");
    setConversionResult(null);
    setCompressedImage(null);
    setImageBlob(null);
    setLocation(null);
    setError(null);
    setShowLocation(false);
  };
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {!compressedImage && (
        <div style={styles.container}>
          <h3 style={styles.title}>Upload Receipt</h3>

          <div style={styles.uploadArea}>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={loading}
              style={styles.fileInput}
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload" style={styles.fileLabel}>
              {loading ? "Processing..." : "Choose Image"}
            </label>
          </div>

          {loading && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>Compressing image...</p>
            </div>
          )}

          {error && (
            <div style={styles.error}>
              <p>❌ {error}</p>
              <button onClick={handleClear} style={styles.clearButton}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {compressedImage && (
        <div style={styles.imagePreview}>
          <img
            src={compressedImage}
            alt="Receipt"
            style={styles.previewImage}
          />
          <button
            type="button"
            onClick={handleClear}
            style={styles.changeImageButton}
          >
            Remove Image
          </button>
        </div>
      )}

      {compressedImage && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount *</label>
            <div style={styles.amountRow}>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                style={styles.amountInput}
                disabled={loading}
              />

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={styles.currencySelect}
                disabled={loading}
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleConvert}
                style={styles.convertButton}
                disabled={loading || !amount || !currency}
              >
                {loading ? "..." : "Convert"}
              </button>
            </div>
          </div>

          {/* Conversion Result */}
          {conversionResult && (
            <div style={styles.conversionBox}>
              <p style={styles.conversionText}>
                <strong>€{conversionResult.convertedAmount} EUR</strong>
              </p>
              <p style={styles.conversionRate}>
                {conversionResult.originalAmount}{" "}
                {conversionResult.originalCurrency}×{" "}
                {conversionResult.exchangeRate} = €
                {conversionResult.convertedAmount}
              </p>
            </div>
          )}

          {/* Category Dropdown */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
              required
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.locationContainer}>
            <button
              type="button"
              onClick={fetchLocation}
              disabled={locationLoading}
              style={{
                ...styles.locationButton,
                opacity: locationLoading ? 0.7 : 1,
                cursor: locationLoading ? "not-allowed" : "pointer",
              }}
            >
              <span style={styles.buttonIcon}>📍</span>
              <span>{locationLoading ? "Loading..." : "Get Location"}</span>
              {locationLoading && <span style={styles.loadingSpinner}>⏳</span>}
            </button>

            {location &&
              showLocation &&
              location.method !== "disabled" &&
              location.method !== "unsupported" && (
                <div style={styles.locationDetailsBox}>
                  <div style={styles.locationHeader}>
                    <span style={styles.locationIcon}>📍</span>
                    <span style={styles.locationTitle}>
                      Your Current Location
                    </span>
                  </div>

                  <div style={styles.locationContent}>
                    <p style={styles.locationText}>{location.formatted}</p>

                    {location.coordinates && (
                      <p style={styles.coordinates}>
                        {location.coordinates.latitude.toFixed(4)}°,{" "}
                        {location.coordinates.longitude.toFixed(4)}°
                      </p>
                    )}
                  </div>
                </div>
              )}
            {location && location.method === "ip" && (
              <Map location={location} />
            )}
            {location?.method === "disabled" && (
              <p style={{ color: "gray" }}>
                Location access denied, need to enable location permissions
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>❌ {error}</p>
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClear}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading || locationLoading}
            >
              {loading ? "Submitting..." : "Submit Expense"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

const styles = {
  form: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "25px",
    color: "#333",
    textAlign: "center",
    fontSize: "24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#555",
  },
  amountRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  amountInput: {
    flex: 2,
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    color: "black",
    backgroundColor: "#fff",
    outline: "none",
  },
  currencySelect: {
    flex: 2,
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "white",
    cursor: "pointer",
    outline: "none",
    color: "black",
  },
  convertButton: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
    whiteSpace: "nowrap",
    ":hover:not(:disabled)": {
      backgroundColor: "#1976D2",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    color: "black",
    backgroundColor: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    ":focus": {
      borderColor: "#4CAF50",
    },
  },
  imagePreview: {
    marginBottom: "20px",
    textAlign: "center",
    position: "relative",
  },
  previewImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    borderRadius: "8px",
    border: "2px solid #4CAF50",
    marginBottom: "10px",
  },
  changeImageButton: {
    display: "block",
    margin: "0 auto",
    padding: "8px 16px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  conversionBox: {
    backgroundColor: "#e8f5e9",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #4CAF50",
  },
  conversionText: {
    margin: "0 0 5px 0",
    fontSize: "18px",
    color: "#2e7d32",
  },
  conversionRate: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    color: "#666",
  },
  errorBox: {
    backgroundColor: "#ffebee",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #f44336",
  },
  errorText: {
    margin: "0",
    color: "#c62828",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
  },
  submitButton: {
    flex: 2,
    padding: "14px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover:not(:disabled)": {
      backgroundColor: "#45a049",
    },
    ":disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  cancelButton: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#9e9e9e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover:not(:disabled)": {
      backgroundColor: "#757575",
    },
    ":disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },

  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "25px",
    backgroundColor: "#fff",
    borderRadius: "12px",
  },
  uploadArea: {
    textAlign: "center",
    marginBottom: "20px",
  },
  fileInput: {
    display: "none",
  },
  fileLabel: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    color: "#2196F3",
  },
  spinner: {
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #2196F3",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 10px",
  },
  error: {
    backgroundColor: "#ffebee",
    padding: "15px",
    borderRadius: "6px",
    color: "#c62828",
    textAlign: "center",
  },
  clearButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  locationContainer: {
    flex: 2,
    width: "100%",
  },

  locationButton: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "white",
    cursor: "pointer",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#333",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "#d0d0d0",
    },
    ":active": {
      backgroundColor: "#e8e8e8",
    },
  },

  buttonIcon: {
    fontSize: "18px",
  },

  loadingSpinner: {
    marginLeft: "8px",
    animation: "spin 1s linear infinite",
  },

  locationDetailsBox: {
    marginTop: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },

  locationHeader: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #e0e0e0",
    gap: "8px",
  },

  locationIcon: {
    fontSize: "16px",
  },

  locationTitle: {
    flex: 1,
    fontWeight: "500",
    color: "#333",
  },

  locationContent: {
    padding: "12px",
  },

  locationText: {
    margin: "0 0 8px 0",
    color: "#333",
    fontSize: "15px",
    lineHeight: "1.5",
  },

  coordinates: {
    margin: "0 0 8px 0",
    color: "#666",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
};
const styleSheet = document.createElement("style");

styleSheet.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

document.head.appendChild(styleSheet);

export default ExpenseForm;
