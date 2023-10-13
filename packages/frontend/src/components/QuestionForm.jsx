import { useState } from "react";
import { useAsyncFn } from "../hooks/useAsyncFn";

const GAMES = [
  { id: 1, team1: "🇫🇷", team2: "🇿🇦", date: new Date("2023-10-15") },
  { id: 2, team1: "🇳🇿", team2: "🇮🇪", date: new Date("2023-10-14") },
  { id: 3, team1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2: "🇫🇯", date: new Date("2023-10-15") },
  { id: 4, team1: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", team2: "🇦🇷", date: new Date("2023-10-14") },
];

export function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [gameId, setGame] = useState(1);
  const [timestamp, setTimestamp] = useState(Date.now());

  const onQuestionChange = (event) => {
    setQuestion(event.target.value);
  };
  const onGameChange = (event) => {
    setGame(event.target.value);
  };

  const [newQuestion, submit] = useAsyncFn(async (event) => {
    event.preventDefault();
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    const selectedGame = GAMES.find(
      (upcomingGame) => upcomingGame.id === gameId
    );
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/questions`,
      {
        headers: {
          "Content-Type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
          username: userSession.username,
          questionText: question,
          questionTimestamp: timestamp.toString(),
          matchDetails: selectedGame,
        }),
      },
      [],
      ""
    );
    return true;
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="p-8 bg-white shadow-md rounded-md">
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Input ta question</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Input ta question"
            value={question}
            onChange={onQuestionChange}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Match concerné</label>
          <select
            className="w-full p-2 border rounded"
            onChange={onGameChange}
            value={gameId}
          >
            {GAMES.map((upcomingGame) => (
              <option
                value={upcomingGame.id}
                key={upcomingGame.id}
              >{`${upcomingGame.team1} vs ${upcomingGame.team2}`}</option>
            ))}
          </select>
        </div>
        {/* <div className="mb-4">
          <label className="block mb-2 text-gray-700">Timestamp</label>
          <input
            className="w-full p-2 border rounded"
            type="text"
            placeholder="timestamp ?"
          />
        </div> */}
        <button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={submit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
