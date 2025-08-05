// 🧪 Минимальный тест React без зависимостей
import React, { useState } from "react";

export default function MinimalTest() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧪 Минимальный тест</h1>
      <p>Счетчик: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Увеличить
      </button>
      <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        ✅ Если кнопка увеличивает счетчик, React работает
      </p>
    </div>
  );
}