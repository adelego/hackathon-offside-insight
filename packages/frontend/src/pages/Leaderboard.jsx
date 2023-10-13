import * as React from "react";
import { useAsync } from "../hooks/useAsync";
import { Menu } from '../components/Menu';

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
      <Menu />
      <h1
        className="text-4xl font-bold text-center mb-4"
      >Leaderboard</h1>
      <div className="flex flex-col gap-2">
      <div className="flex w-1/2 gap-4 justify-between full-width">
            <div
              className="bg-gray-200 flex justify-center items-center p-2 rounded full-width"
            >Username</div>
            <div
              className="bg-gray-200 flex justify-center items-center p-2 rounded full-width"
            >Score</div>
          </div>
      {
        leaderboard.loading === false && leaderboard.value.map(({ username, score }, i) => (
          <div className="flex justify-between gap-4 full-width">
            <div
              className="bg-gray-200 flex justify-center items-center p-2 full-width"
            >{i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{username}</div>
            <div
              className="bg-gray-200 flex justify-center items-center p-2 full-width"
            >{score}</div>
          </div>
        ))
      }
      </div>
    </div>
  );
}
