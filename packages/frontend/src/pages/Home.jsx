import * as React from "react";

export function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="p-8 bg-white shadow-md rounded-md">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Ton nom</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="ton nom ?"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Ton mail</label>
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="ton mail ?"
          />
        </div>
        <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
