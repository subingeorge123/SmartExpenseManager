import { useEffect, useState } from "react";
import { getExpenses, generateChart } from "../services/api";

function Analysis() {
  const [expenses, setExpenses] = useState([]);
  const [chartImage, setChartImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);

      await generateExpenseChart(data);
    } catch (err) {
      console.error("Failed to load expenses", err);
    } finally {
      setLoading(false);
    }
  };

  const generateExpenseChart = async (data) => {
    setChartLoading(true);
    
    const categoryTotals = {};

    data.forEach((exp) => {
      const category = exp.category;
      const amount = parseFloat(exp.amount);

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += amount;
    });

    const x_values = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const payload = {
      chart_type: "bar",
      title: "Expenses by Category",
      x_values,
      series: [
        {
          name: "Expenses",
          values,
        },
      ],
      show_values: true,
    };

    try {
      const response = await generateChart(payload);

      const base64Image = response.chart_response.body;

      setChartImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error("Chart API error", err);
    } finally {
      setChartLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Expense Analysis(€)</h2>


      {chartLoading && (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      )}

      {chartImage && !chartLoading && (
        <div style={styles.chartBox}>
          <img src={chartImage} alt="Expense Chart" style={styles.chartImage} />
        </div>
      )}

      {!loading && expenses.length === 0 && <p>No expenses available</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
  },

  title: {
    marginBottom: "20px",
    fontSize: "26px",
    color: "#333",
  },

  chartBox: {
    marginTop: "20px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "inline-block",
  },

  chartImage: {
    maxWidth: "100%",
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
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
    margin: "0 auto 10px",
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

export default Analysis;