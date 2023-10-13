import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { useAsyncFn } from "../hooks/useAsyncFn";

import { useParams } from "react-router-dom";

export function QuestionFeed() {
  let { id } = useParams();
  const [responses, setResponses] = useState([]);

  const question = useAsync(async () => {
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

  const getUpvoteFn = (response, responseKey) => {
    return (event) => {
      event.preventDefault();
      const userSession = JSON.parse(localStorage.getItem("userSession"));
      console.log(
        `Upvoting response ${response.SK.S} by ${userSession.username}`
      );
      response.upvotes.N = parseInt(response.upvotes.N) + 1;

      setResponses([
        ...responses.slice(0, responseKey),
        response,
        ...responses.slice(responseKey + 1, responses.length),
      ]);
    };
  };
  const getDownvoteFn = (response, responseKey) => {
    return (event) => {
      event.preventDefault();
      const userSession = JSON.parse(localStorage.getItem("userSession"));
      console.log(
        `Downvote response ${response.SK.S} by ${userSession.username}`
      );
      response.downvotes.N = parseInt(response.downvotes.N) + 1;
      setResponses([
        ...responses.slice(0, responseKey),
        response,
        ...responses.slice(responseKey + 1, responses.length),
      ]);
    };
  };

  return (
    <div className="min-h-screen flex flex-col flex-top align-top bg-gray-100 p-20">
      {!question.loading && (
        <div className="flex flex-col w-300px h-max p-10 border-solid border-4 border-blue-600 rounded-md bg-white mb-5">
          <p className="text-sm">🤔 {question.value.username} demande :</p>
          <p className="self-center">{question.value.questionText}</p>
        </div>
      )}
      {responses.map((response, key) => (
        <div
          key={key}
          className="flex flex-col w-300px h-max p-10 border-solid border-2 border-blue-400 rounded-md bg-white mb-5"
        >
          <p className="text-sm">
            💁 {response.username || "anonyme"} répond :
          </p>
          <p className="self-center">
            {response.responseText.S || response.responseText}
          </p>
          <div className="self-end">
            <button onClick={getUpvoteFn(response, key)}>
              {response.upvotes.N || 0}👍
            </button>{" "}
            <button onClick={getDownvoteFn(response, key)}>
              {response.downvotes.N || 0} 👎
            </button>
          </div>
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
