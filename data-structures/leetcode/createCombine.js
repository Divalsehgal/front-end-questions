const items = [
  {
    id: 1,
    name: "A",
  },
  {
    id: 2,
    name: "B",
  },
  {
    id: 3,
    name: "C",
  },
  {
    id: 4,
    name: "D",
  },
];

const connections = [
  {
    cid: "1",
    source: "A",
    destination: "B",
  },
  {
    cid: "2",
    source: "A",
    destination: "C",
  },
  {
    cid: "3",
    source: "A",
    destination: "D",
  },
  {
    cid: "4",
    source: "B",
    destination: "C",
  },
  {
    cid: "5",
    source: "C",
    destination: "D",
  },
];

const combine = [
  {
    id: 1,
    name: "A",
    source: ["A"],
    destination: ["B", "C", "D"],
  },
  {
    id: 2,
    name: "B",
    source: ["A"],
    destination: ["C"],
  },
  {
    id: 3,
    name: "C",
    source: ["A", "B"],
    destination: ["D"],
  },
  {
    id: 4,
    name: "D",
    source: ["C", "D"],
    destination: [],
  },
];

function createCombine(items, connections) {
  let temp = {};

  for (let i of items) {
    temp[i.name] = {
      id: i.id,
      name: i.name,
      source: [],
      destination: [],
    };
  }

  for (let connection of connections) {
    temp[connection.source].destination.push(connection.destination);
    temp[connection.destination].source.push(connection.source);
  }

  let final = Object.values(temp);

  return final;
}

const combineResult = createCombine(items, connections);
console.log(combineResult);
