/*
Adapter allows two objects with incompatible
interfaces to interact with each other.
*/

const citiesHabitantsInMillions = [
    { city: "London", habitants: 8.9 },
    { city: "Rome", habitants: 2.8 },
    { city: "New York", habitants: 8.8 },
    { city: "Paris", habitants: 2.1 },
]

const BuenosAires = {
    city: "Buenos Aires",
    habitants: 3100000
}

// Our adapter takes a city with raw population values and returns
// a new object whose interface matches the rest of the collection.
const toMillionsAdapter = city => ({
    ...city,
    habitants: Number.parseFloat((city.habitants / 1000000).toFixed(1))
})

const adaptedBuenosAires = toMillionsAdapter(BuenosAires)
console.log(adaptedBuenosAires)
