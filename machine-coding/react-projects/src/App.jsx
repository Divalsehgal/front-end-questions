import { useState } from "react";
import { FlagProvider } from "./context/featureFlagProvider";
import ChallengeList from './pages/ChallengeList'
import ReactChallenge from "./pages/ReactChallenge";
import { Route, Routes } from "react-router-dom";
export default function App() {
  const [theme, setTheme] = useState(() => {
    JSON.parse(localStorage.getItem("ui-theme"));
  });

  const toggleTheme = () => {
    if (setTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <FlagProvider>
      <Routes>
        <Route path="/" element={<ChallengeList />} />
        <Route path="/react-challenge/:name" element={<ReactChallenge />} />
      </Routes>
    </FlagProvider>
  );
}
