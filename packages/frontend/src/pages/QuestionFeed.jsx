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

        method: "POST",
      }
    );
    const question = await questionResponse.json();
    return question;
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {id} -- {question.value.text}
    </div>
  );
}
