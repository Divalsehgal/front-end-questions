import { useState, useEffect } from "react";

export const hint = `
### Learning Gotchas:
1. **Interval & Timeout Sync**: Using an interval for mole generation and a timeout for auto-hiding is essential. Ensuring the hide timeout is shorter than the spawn interval prevents "stacking" moles.
2. **Immediate Responsiveness**: Clearing the mole's visual state immediately upon a successful click (before the timeout triggers) is critical for a high-quality game feel.
3. **Cleanup Logic**: Always clear both the Game Interval and the Timer Interval when the countdown reaches zero or the component unmounts to prevent state updates on unmounted components.
`;

const wholes = Array.from({ length: 9 }, () => ({
  ele: (
    <img
      src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.png"
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
    />
  ),
  val: false,
}));

export default function WhackAMole() {
  const [whole, setWhole] = useState(wholes);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);

  // ⏱ Timer logic
  useEffect(() => {
    if (timer === 0) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer]);

  // 🐹 Mole logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * 9);

      setWhole((prev) =>
        prev.map((item, idx) => ({
          ...item,
          val: idx === random,
        }))
      );

      // hide mole after 700ms
      setTimeout(() => {
        setWhole((prev) =>
          prev.map((item) => ({ ...item, val: false }))
        );
      }, 700);
      
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🎯 Click handler
  const handleChange = (index: number) => {
    if (whole[index].val) {
      setScore((prev) => prev + 1);

      // hide immediately after hit
      setWhole((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, val: false } : item
        )
      );
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-xl font-bold">Time left: {timer}</h3>
      <h3 className="text-xl font-bold mb-4">Score: {score}</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "550px",
          flexWrap: "wrap",
        }}
      >
        {whole.map((wh, cdx) => (
          <div
            key={cdx}
            style={{
              display: "flex",
              width: "100px",
              height: "30px",
              cursor: "pointer",
              border: "1px solid gray",
              padding: "30px",
              position: "relative",
            }}
            onClick={() => handleChange(cdx)}
          >
            {wh.ele}
            {wh.val && (
              <img
                src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.png"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
