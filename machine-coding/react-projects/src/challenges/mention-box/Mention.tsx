import React from 'react'
import "./App.css";
import DATA from "./data.json";
import MentionBox from "./components/MentionBox/MentionBox";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
};
function Mention() {
  return <MentionBox data={DATA} />;
}

export default Mention;
