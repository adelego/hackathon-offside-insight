import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { HelpMe } from "./pages/HelpMe";
import { QuestionForm } from "./pages/QuestionForm";

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
    path: "form",
    element: <QuestionForm />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);
