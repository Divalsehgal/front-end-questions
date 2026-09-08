/*
Abstract Factory pattern provides an interface to create families of related objects
without specifying their concrete classes.

This example creates two families of vehicles:
- land vehicles: Car, Truck
- air vehicles: Helicopter, Airplane

The abstract factory returns the right concrete factory,
and each concrete factory creates related products.
*/

class Car {
    constructor() {
        this.name = "Car"
        this.wheels = 4
    }
    turnOn = () => console.log("Chacabúm!!")
}

class Truck {
    constructor() {
        this.name = "Truck"
        this.wheels = 8
    }
    turnOn = () => console.log("RRRRRRRRUUUUUUUUUMMMMMMMMMM!!")
}

class Helicopter {
    constructor() {
        this.name = "Helicopter"
        this.wheels = 0
    }
    turnOn = () => console.log("Wrooom wrooom! Helicopter is rising!")
}

class Airplane {
    constructor() {
        this.name = "Airplane"
        this.wheels = 3
    }
    turnOn = () => console.log("Vroooom! Airplane is ready for takeoff!")
}

class LandVehicleFactory {
    createVehicle(type) {
        switch (type) {
            case "car":
                return new Car()
            case "truck":
                return new Truck()
            default:
                return null
        }
    }
}

class AirVehicleFactory {
    createVehicle(type) {
        switch (type) {
            case "helicopter":
                return new Helicopter()
            case "airplane":
                return new Airplane()
            default:
                return null
        }
    }
}

const vehicleFactory = {
    createFactory: function (type) {
        switch (type) {
            case "land":
                return new LandVehicleFactory()
            case "air":
                return new AirVehicleFactory()
            default:
                return null
        }
    }
}

const landFactory = vehicleFactory.createFactory("land")
const car = landFactory.createVehicle("car")
const truck = landFactory.createVehicle("truck")

const airFactory = vehicleFactory.createFactory("air")
const helicopter = airFactory.createVehicle("helicopter")
const airplane = airFactory.createVehicle("airplane")

console.log(car, truck, helicopter, airplane)