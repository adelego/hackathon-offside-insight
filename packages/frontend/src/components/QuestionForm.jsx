export function QuestionForm() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="p-8 bg-white shadow-md rounded-md">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Input ta question</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Input ta question"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Match concerné</label>
          <select className="w-full p-2 border rounded">
            <option>🇫🇷 vs 🇿🇦</option>
            <option>🇳🇿 vs 🇮🇪</option>
            <option>🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs 🇫🇯</option>
            <option>🏴󠁧󠁢󠁷󠁬󠁳󠁿 vs 🇦🇷</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Timestamp</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="timestamp ?"
          />
        </div>
        <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
