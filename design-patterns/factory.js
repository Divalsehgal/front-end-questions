/*
Factory method pattern provides an interface for 
creating objects that can be modified after creation
*/


class Pirate {
    constructor(name, phrase) {
        this.name = name
        this.phrase = phrase
        this.species = "straw hats"
    }
    fly() {
        console.log("wuhohoh!!")
    }
    sayPhrase() {
        console.log(this.phrase)
    }
}

class AlienPirate extends Pirate {
    constructor(name, phrase) {
        super(name, phrase)
        this.species = "alien"
    }
    fly() {
        console.log("Zzzzzziiiiiinnnnnggggg!!")
    }
}



class PirateFactory {
    createPirate(type, name, phrase) {
        switch (type) {
            case "alien":
                return new AlienPirate(name, phrase)
            default:
                return new Pirate(name, phrase)
        }
    }
}

const factory = new PirateFactory()
const luffy = factory.createPirate("pirate", "Luffy", "I'm going to be king of the pirates!")
const zoro = factory.createPirate("alien", "Zoro", "I'm Zoro the alien!")

luffy.sayPhrase()
zoro.sayPhrase()
zoro.fly() 