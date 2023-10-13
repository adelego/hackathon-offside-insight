import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { useAsyncFn } from "../hooks/useAsyncFn";

import { useParams } from "react-router-dom";

export function QuestionFeed() {
  let { id } = useParams();
  const [responses, setResponses] = useState([]);

  const question = useAsync(async () => {
    console.log("fetching");
    const questionResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/question/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await questionResponse.json();
  }, []);

  useAsync(async () => {
    console.log("fetching");
    const responsesResponse = await fetch(
      `${process.env.REACT_APP_API_URL}/responses/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const jsonResponse = await responsesResponse.json();
    setResponses(jsonResponse.responses);
  }, []);

  const [myAnswer, setMyAnswer] = useState();
  const onAnswerChange = (event) => {
    setMyAnswer(event.target.value);
  };

  const [newAnswer, submit] = useAsyncFn(
    async (event) => {
      event.preventDefault();
      const userSession = JSON.parse(localStorage.getItem("userSession"));

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/responses`,
        {
          headers: {
            "Content-Type": "application/json",
          },

          method: "POST",
          body: JSON.stringify({
            username: userSession.username,
            questionId: id,
            responseText: myAnswer,
          }),
        }
      );
      const newResponse = await response.json();
      setResponses([...responses, newResponse]);
      setMyAnswer("");
    },
    [myAnswer, responses],
    ""
  );
  console.log(responses);

  return (
    <div className="min-h-screen flex flex-col flex-top align-top bg-gray-100 p-20">
      <div className="w-300px h-max p-10 border-solid border-2 border-blue-600 rounded-md bg-white mb-5">
        <p>
          {question.loading || question.value === undefined
            ? "ta question ?"
            : question.value.questionText}
        </p>
      </div>
      {responses.map((response) => (
        <div className="w-300px h-max p-10 border-solid border-2 border-blue-600 rounded-md bg-white mb-5">
          {response.responseText.S || response.responseText}
        </div>
      ))}
      <form>
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Input ta question"
          value={myAnswer}
          onChange={onAnswerChange}
        ></textarea>
        <button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={submit}
        >
          Envoyer 💌
        </button>
      </form>
    </div>
  );
}
