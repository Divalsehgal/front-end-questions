/*
Factory method pattern provides an interface for 
creating objects that can be modified after creation
*/


class Pirates {
    constructor(name, phrase) {
        this.name = name
        this.phrase = phrase
        this.species = "straw hats"
    }
    fly = () => console.log("wuhohoh!!")
    sayPhrase = () => console.log(this.phrase)
}

const alien1 = new Pirates("Zoro", "I'm Zoro the alien!")
console.log(alien1.name) 



function AlienPirates(name, phrase) {
    this.name = name
    this.phrase = phrase
    this.species = "alien"
}

AlienPirates.prototype.fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!")
AlienPirates.prototype.sayPhrase = () => console.log(this.phrase)

const pirates = new AlienPirates("Zoro", "I'm Zoro the alien!")

console.log(pirates.name) 
console.log(pirates.phrase) 
pirates.fly() 