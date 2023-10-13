import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { HelpMe } from "./pages/HelpMe";
import { QuestionFeed } from "./pages/QuestionFeed";
import { Leaderboard } from "./pages/Leaderboard";
import { Layout } from "./Layout";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="help"
          element={
            <Layout>
              <HelpMe />
            </Layout>
          }
        />
        <Route
          path="about"
          element={
            <Layout>
              <div>About</div>
            </Layout>
          }
        />
        <Route
          path="questions/:id"
          element={
            <Layout>
              <QuestionFeed />
            </Layout>
          }
        />
        <Route
          path="leaderboard"
          element={
            <Layout>
              <Leaderboard />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
