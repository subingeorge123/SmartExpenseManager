import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../services/api";

function PreviousExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await getExpenses();
      setExpenses(data);
    };
    loadExpenses();
  }, []);

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((exp) => exp.expense_id !== id));
  };

  return (
    <div style={styles.expense_container}>
      {expenses.map((exp) => (
        <div
          key={exp.expense_id}
          style={{
            ...styles.expense_card,
            ...(hovered === exp.expense_id && styles.card_hover)
          }}
          onMouseEnter={() => setHovered(exp.expense_id)}
          onMouseLeave={() => setHovered(null)}
        >
          {exp.image_url && (
            <img
              src={exp.image_url}
              alt="expense"
              style={styles.expense_image}
            />
          )}

          <div style={styles.expense_info}>
            <p><strong>Amount:</strong> €{exp.amount}</p>
            <p><strong>Category:</strong> {exp.category}</p>
            <p><strong>Location:</strong> {exp.location}</p>
          </div>

          <button
            style={styles.delete_button}
            onClick={() => handleDelete(exp.expense_id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {

  expense_container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
    padding: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  expense_card: {
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.2s ease",
  },

  card_hover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  expense_image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  expense_info: {
    width: "100%",
    marginTop: "10px",
    fontSize: "14px",
    color: "#222",
    lineHeight: "1.6",
  },

  delete_button: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    backgroundColor: "rgb(76, 175, 80)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

};

export default PreviousExpenses;