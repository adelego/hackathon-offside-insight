import * as React from "react";
import { useAsyncFn } from "../hooks/useAsyncFn";
import { redirect } from "react-router-dom";

import { BrowserRouter as Router, useParams } from "react-router-dom";

export function QuestionFeed() {
  let { id } = useParams();

  const [answers] = useAsync(async () => {
    const answersResponses = await fetch(
      `${process.env.REACT_APP_API_URL}/questions`
    );
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {id}
    </div>
  );
}
