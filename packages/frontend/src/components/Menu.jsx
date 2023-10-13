import React, { useState } from "react";
export function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4">
      {isOpen && (
        <div className="bg-white shadow-lg rounded-md p-4">
          <button className="flex items-center mb-2">
            <span className="mr-2">❓</span> My Questions
          </button>
          <button className="flex items-center mb-2">
            <span className="mr-2">👀</span> All Questions
          </button>
          <button className="flex items-center" onClick={() => { window.location.href = '/leaderboard'}}>
            <span className="mr-2">🏆</span> Leaderboard
          </button>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white rounded-full shadow-lg"
      >
        🏉
      </button>
    </div>
  );
}
