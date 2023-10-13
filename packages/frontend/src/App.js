import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { HelpMe } from "./pages/HelpMe";
import { QuestionFeed } from "./pages/QuestionFeed";
import { Leaderboard } from "./pages/Leaderboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "help",
    element: <HelpMe />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "questions/:id",
    element: <QuestionFeed />,
  },
  {
    path: "leaderboard",
    element: <Leaderboard />
  }
]);
