import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { HelpMe } from "./pages/HelpMe";
import { QuestionForm } from "./components/QuestionForm";

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
]);
