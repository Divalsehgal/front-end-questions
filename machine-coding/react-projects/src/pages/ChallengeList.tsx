import { Link } from "react-router-dom";
import { challengeNames } from "../challenges";
import React, { useState } from "react";
import "./ChallengeList.scss";
import { challengeNamesData } from "../utils";

export type ChallengeName = (typeof challengeNames)[number];

export default function ChallengeList() {
  const [data, setData] = useState(challengeNamesData);
  const [inputValue, setInputValue] = useState("");

  const searchHandler = (e) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setData(
        challengeNamesData.filter((challenge) => {
          if (
            challenge.name
              .toLocaleLowerCase()
              .includes(e.target.value.toLowerCase())
          ) {
            return challenge;
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
      <h1 className="text-2xl font-bold mb-4">React Challenges</h1>
      <div className="inner">
        <input type="text" value={inputValue} onChange={searchHandler} />

        <ul className="list-container">
          {data.map(({ name, hint }) => (
            <div key={name} className="list-item">
              <li>
                <Link
                  to={`/react-challenge/${name}`}
                  className="text-blue-600 hover:underline"
                >
                  {name}
                </Link>
                <div className="hint">{hint}</div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
