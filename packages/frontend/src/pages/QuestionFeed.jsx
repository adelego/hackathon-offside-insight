import * as React from "react";
import { useAsync } from "../hooks/useAsync";

import { useParams } from "react-router-dom";

export function QuestionFeed() {
  let { id } = useParams();

  const question = useAsync(async () => {
    console.log("fetching");
    const questionResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/questions/{id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await questionResponse.json();
  }, []);

  const responses = useAsync(async () => {
    console.log("fetching");
    const responsesResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/responses/{id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await responsesResponse.json();
  }, []);

  return (
    <div className="min-h-screen flex justify-center align-top bg-gray-100">
      <div className="w-300px h-max p-10 border-solid border-2 border-blue-600 rounded-md bg-white mb-5">
        <p>
          {question.loading || question.value === undefined
            ? "ta question ?"
            : question.questionText}
        </p>
      </div>
      {/* {!responses.loading &&
        responses.value !== undefined &&
        responses.value.responses.map((response) => response)} */}
    </div>
  );
}
