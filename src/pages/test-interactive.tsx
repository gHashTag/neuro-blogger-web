// 🧪 Простой тест интерактивности React
import React, { useState } from "react";

export default function TestInteractive() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Начальный текст");

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">🧪 Тест интерактивности</h1>
      
      {/* Тест кнопки */}
      <div className="space-y-2">
        <p>Счетчик: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Увеличить счетчик
        </button>
      </div>

      {/* Тест input */}
      <div className="space-y-2">
        <p>Текст: {text}</p>
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded"
        />
      </div>

      {/* Состояние */}
      <div className="text-sm text-gray-600">
        <p>✅ React работает если этот текст виден</p>
        <p>✅ JS Events работают если кнопка увеличивает счетчик</p>
        <p>✅ Input работает если можно печатать в поле</p>
      </div>
    </div>
  );
}