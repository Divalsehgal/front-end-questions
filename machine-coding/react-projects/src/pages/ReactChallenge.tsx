import React from "react";
import { useParams } from "react-router-dom";
import { challenges } from "../challenges";

export default function ReactChallenge() {
  const { name } = useParams();

  const temp = challenges[name as keyof typeof challenges];
  const ChallengeComponent = challenges[name as keyof typeof challenges];
  console.log("temp", temp);

  return (
    <div className="p-4">
      {ChallengeComponent ? <ChallengeComponent /> : <p>Challenge not found</p>}
    </div>
  );
}
