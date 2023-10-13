import * as React from "react";
import { useAsync } from "../hooks/useAsync";

export function Leaderboard() {
  const leaderboard = useAsync(async () => {
    const leaderboardResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/users/leaderboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { users } = await leaderboardResponse.json();
    return users;
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 flex-col">
      <h1>Leaderboard</h1>
      <div className="flex flex-col items-center">
      {
        leaderboard.loading === false && leaderboard.value.map(({ username, score }) => (
          <div className="flex justify-between w-1/2 gap-4">
            <div
              className="bg-gray-400 flex justify-center items-center p-2 border-r"
            >{username}</div>
            <div
              className="bg-gray-400 flex justify-center items-center p-2 rounded-l"
            >{score}</div>
          </div>
        ))
      }
      </div>
    </div>
  );
}
