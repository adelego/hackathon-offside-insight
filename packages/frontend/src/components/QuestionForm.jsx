import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
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
  const [videoFile, setVideoFile] = useState(null);

  // Drag and Drop Handlers
  const onDrop = useCallback((acceptedFiles) => {
    setVideoFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "video/mp4",
    maxFiles: 1,
  });

  const getUploadUrl = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/videos/upload-url`,
      {
        method: "POST",
      }
    );
    const { uploadUrl, fileName } = await response.json();
    return { uploadUrl, fileName };
  };

  const uploadVideoToS3 = async (file, uploadUrl) => {
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  };

  const onQuestionChange = (event) => {
    setQuestion(event.target.value);
  };
  const onGameChange = (event) => {
    setGame(event.target.value);
  };

  const [newQuestion, submit] = useAsyncFn(
    async (event) => {
      let videoFileName = null;
      event.preventDefault();
      const userSession = JSON.parse(localStorage.getItem("userSession"));
      const selectedGame = GAMES.find(
        (upcomingGame) => upcomingGame.id === gameId
      );

      if (videoFile) {
        const { uploadUrl, fileName } = await getUploadUrl();
        await uploadVideoToS3(videoFile, uploadUrl);
        videoFileName = fileName;
        // Add additional logic if you need to associate the video with the question
      }

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
            videoFileName,
          }),
        },
        [],
        ""
      );
      const questionResponse = await response.json();
      return questionResponse.questionId;
    },
    [question, gameId, timestamp, videoFile],
    ""
  );

  useEffect(() => {
    if (newQuestion.value !== "" && newQuestion.loading === false) {
      setTimeout(() => {
        window.location.href = `/questions/${newQuestion.value}`;
      }, 1500);
    }
  }, [newQuestion]);

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
        <div
          {...getRootProps()}
          className="mb-4 border-2 border-dashed border-gray-400 rounded p-6 cursor-pointer hover:bg-gray-200 transition-colors duration-300 dropzone"
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-center space-x-3 text-gray-600">
            <span className="text-2xl" role="img" aria-label="rugby">
              📽️
            </span>
            {isDragActive ? (
              <p>Release the video here ...</p>
            ) : (
              <p>Drop ta vidéo où y'a un doute... 🤔</p>
            )}
          </div>
        </div>

        {videoFile && <p className="mb-4">Selected video: {videoFile.name}</p>}

        <button
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={submit}
        >
          Submit
        </button>

        <p>
          {newQuestion.value !== "" &&
            newQuestion.value !== undefined &&
            "La question a été enregistrée. Redirection dans 3, 2, 1 🚀"}
        </p>
      </form>
    </div>
  );
}
