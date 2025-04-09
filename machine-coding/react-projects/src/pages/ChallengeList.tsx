import { Link } from "react-router-dom";
import { challengeNames, challengeNamesData } from "../challenges";
import React, { useRef, useState } from "react";
import "./ChallengeList.scss";

export type ChallengeName = (typeof challengeNames)[number];

export default function ChallengeList() {
  const [data, setData] = useState(challengeNamesData);
  const [inputValue, setInputValue] = useState("");

  const searchHandler = (e) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setData(
        challengeNamesData.filter((name) => {
          if (name.toLocaleLowerCase().includes(e.target.value.toLowerCase())) {
            return name;
          }
        })
      );
    } else {
      setData(challengeNamesData);
    }
  };

  console.log(data, inputValue);

  return (
    <div className="container">
      <input type="text" value={inputValue} onChange={searchHandler} />
      <h1 className="text-2xl font-bold mb-4">React Challenges</h1>

      <ul className="space-y-2">
        {data.map((name) => (
          <li key={name}>
            <Link
              to={`/react-challenge/${name}`}
              className="text-blue-600 hover:underline"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
