import { useEffect, useState } from "react";
import './Circle.css'
const handleContextMenu = (e) => {
  e.preventDefault();
};
const Circles = () => {
  const [circle, setCircle] = useState([
    {
      id: "left",
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      backgroundColor: "red",
    },
    {
      id: "right",
      width: 0,
      height: 0,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      backgroundColor: "red",
    },
  ]);
  const [currenCircleId, setCurrenCircleId] = useState(null);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  console.log(circle)
  const doElementsOverlap = (lc, rc) => {
    const leftCircleRadius = lc.width / 2;
    const rightCircleRadius = rc.width / 2;
    const leftCenter = {
      x: lc.x + leftCircleRadius,
      y: lc.y + leftCircleRadius,
    };
    const rightCenter = {
      x: rc.x + rightCircleRadius,
      y: rc.y + rightCircleRadius,
    };

    const distancebetween = Math.sqrt(
      Math.pow(leftCenter.x - rightCenter.x, 2) +
        Math.pow(leftCenter.y - rightCenter.y, 2)
    );
    return distancebetween < rightCircleRadius + leftCircleRadius;
  };

  const handleMouseMove = (e) => {
    if (currenCircleId === null) {
      return;
    }

    const upadatedCircles = circle.map((circl) => {
      if (circl.id === currenCircleId) {
        const distanceX = e.clientX - circl.startX;
        const distanceY = e.clientY - circl.startY;

        const size = Math.max(Math.abs(distanceX), Math.abs(distanceY));

        const newX = distanceX < 0 ? circl.startX - size : circl.startX;
        const newY = distanceY < 0 ? circl.startY - size : circl.startY;
        return {
          ...circl,
          width: size,
          height: size,
          x: newX,
          y: newY,
        };
      }
      return circl;
    });

    const doCirlesOverLap = doElementsOverlap(
      upadatedCircles[0],
      upadatedCircles[1]
    );

    const newCircles = upadatedCircles.map((cir) => {
      if (cir.id === currenCircleId) {
        return {
          ...cir,
          backgroundColor: doCirlesOverLap ? "blue" : "red",
        };
      }
      return cir
    });

    setCircle(newCircles);
  };

  const handleMouseDown = (e) => {
    const { button } = e;

    const currentId = button === 0 ? "left" : "right";
    setCurrenCircleId(currentId);
    setCircle((prev) => {
      return prev.map((cir) => {
        if (cir.id === currentId) {
          return {
            ...cir,
            startX: e.clientX,
            startY: e.clientY,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
          };
        }
        return cir;
      });
    });
  };

  const handleMouseUp = () => {
    setCurrenCircleId(null);
  };

  return (
    <div
      className="board"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="circle">
        {circle?.map((cir) => {
          return <CircleItem {...cir} key={cir.id} />;
        })}
      </div>
    </div>
  );
};

export default Circles;

const CircleItem = ({ width, height, x, y, backgroundColor }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: `${width}px`,
        height: `${height}px`,
        top: `${y}px`,
        left: `${x}px`,
        background: backgroundColor,
        borderRadius: "50%",
      }}
    ></div>
  );
};
