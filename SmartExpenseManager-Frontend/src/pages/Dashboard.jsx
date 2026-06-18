import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import PreviousExpenses from "../components/PreviousExpenses";
import TravelPlanner from "../components/TravelPlanner";
import Analysis from "../components/Analysis";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("add");

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <ExpenseForm />;
      case "previous":
        return <PreviousExpenses />;
      case "travel":
        return <TravelPlanner />;
      case "analysis":
        return <Analysis />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🧾 Smart Expense Manager</h1>
        <p style={styles.subtitle}>
          Upload receipts, track expenses, save money
        </p>
      </header>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["add", "previous", "analysis", "travel"].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "add"
              ? "Add Expense"
              : tab === "previous"
                ? "Previous Expenses"
                : tab === "travel"
                  ? "Smart Travel Planner"
                  : "Analysis"}
          </button>
        ))}
      </div>

      {/* Main */}
      <main style={styles.main}>{renderContent()}</main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e3edec",
  },

  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "30px 20px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "36px",
    fontWeight: "600",
  },

  subtitle: {
    margin: 0,
    fontSize: "18px",
    opacity: 0.9,
  },

  tabContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    margin: "30px auto",
    maxWidth: "700px",
    padding: "0 20px",
  },

  tabButton: {
    flex: 1,
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    backgroundColor: "#ecf0f1",
    color: "#555",
    transition: "all 0.25s ease",
  },

  activeTab: {
    backgroundColor: "#4CAF50",
    color: "white",
    transform: "scale(1.05)",
    boxShadow: "0 4px 10px rgba(76,175,80,0.35)",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },

  successMessage: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    margin: "20px auto",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
};

export default Dashboard;
