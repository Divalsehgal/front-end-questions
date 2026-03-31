/*

Facade pattern provides a simple interface to a complex system.
“Instead of calling many functions, we create one function that handles everything.”

*/


function startEngine() {
    console.log("Engine started")
}

function checkFuel() {
    console.log("Fuel checked")
}

function checkBattery() {
    console.log("Battery ok")
}

// Facade
function startCar() {
    checkFuel()
    checkBattery()
    startEngine()
}

startCar()