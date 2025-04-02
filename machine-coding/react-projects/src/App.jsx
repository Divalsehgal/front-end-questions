
import { useState } from "react";
import Board from "./tic-tac-toe/Board";
import { FlagProvider } from "./context/featureFlagProvider";
import MultiStepper from "./multi-stepper/MultiStepper";
// import Lights from "./lights/Lights";
// import Circles from "./overlapping-circles/Circles";
// import ProgressBar from "./progress-bar/ProgressBar";
// import Timer from "./timer/timer";
// import Calender from "./google-calender/Calender";
// import InfiniteReloading from "./infinite-reloading/InfiniteReloading";
// import Popover from "./Popover/Popover";
// import Carousel from "./image-carousel/Carousel";
// import Otp from "./otp-input/otp";

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
      <h1>Projects</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
      {/* <Circles /> */}
      {/* <ProgressBar /> */}
      {/* <Timer/> */}
      {/* <Lights /> */}
      {/* <Calender/> */}
      {/* <InfiniteReloading /> */}
      {/* <Popover/> */}
      {/* <Carousel/> */}
      {/* <Otp/> */}
      {/* <Board /> */}
      <MultiStepper />
    </FlagProvider>
  );
}
