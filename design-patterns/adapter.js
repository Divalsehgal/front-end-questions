/*
Adapter allows two objects with incompatible interfaces to interact with each other.


*/


const citiesHabitantsInMillions = [
    { city: "London", habitants: 8.9 },
    { city: "Rome", habitants: 2.8 },
    { city: "New york", habitants: 8.8 },
    { city: "Paris", habitants: 2.1 },
]

const BuenosAires = {
    city: "Buenos Aires",
    habitants: 3100000
}

// Our adapter function takes our city and converts the habitants property to the same format all the other cities have
const toMillionsAdapter = city => { city.habitants = parseFloat((city.habitants / 1000000).toFixed(1)) }

toMillionsAdapter(BuenosAires)