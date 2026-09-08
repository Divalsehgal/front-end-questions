/**
 * OOP IN JAVASCRIPT: CONSTRUCTORS, PRIVATE, AND PROTECTED
 */

class CoffeeMachine {
    // 1. PRIVATE FIELD (#)
    // Truly private. Only accessible inside this class.
    #waterAmount = 0;

    // 2. PROTECTED FIELD (_)
    // A convention. Not enforced by JS, but a "stay away" signal to devs.
    _power = 0;

    // 3. CONSTRUCTOR
    // The "setup" function that runs on 'new CoffeeMachine(100)'
    constructor(power) {
        this._power = power;
        console.log(`--- Initializing Machine ---`);
        console.log(`Power set to: ${this._power}W`);
    }

    // Using Getters/Setters to provide a "safe" interface to private fields
    set waterAmount(value) {
        if (value < 0) {
            console.error("Water cannot be negative!");
            return;
        }
        this.#waterAmount = value;
    }

    get waterAmount() {
        return this.#waterAmount;
    }

    displayStatus() {
        console.log(`Status: ${this.waterAmount}ml of water, ${this._power}W power.`);
    }
}

// --- USAGE ---
const machine = new CoffeeMachine(100);

// SAFE ACCESS (via setter)
machine.waterAmount = 200; 
machine.displayStatus();

// PRIVATE ACCESS ATTEMPT
// console.log(machine.#waterAmount); // ERROR: Private field '#waterAmount' must be declared...

// PROTECTED ACCESS (Technically works, but bad practice)
console.log("Accessing protected _power:", machine._power); 


// 4. SUBCLASS BEHAVIOR (Inheritance)
class MegaMachine extends CoffeeMachine {
    constructor(power) {
        super(power);
    }

    boostPower() {
        this._power += 50; // OK: Subclasses can access protected members
        // this.#waterAmount = 500; // ERROR: Subclasses CANNOT access parent private members
        console.log("Power boosted!");
    }
}

console.log("\n--- Subclass Example ---");
const bigMachine = new MegaMachine(500);
bigMachine.boostPower();
bigMachine.displayStatus();


// ===========================================================================
// INTERVIEW RECAP
// ===========================================================================
/*
Q: What is the hashtag (#) used for in JS classes?
A: It creates a truly private field that is inaccessible outside the class scope.

Q: Does JS have a 'protected' keyword?
A: No. We use the underscore (_) prefix by convention to signify that a 
   property should only be used by the class and its descendants.

Q: What is the role of 'super()' in a constructor?
A: It calls the constructor of the parent class. It MUST be called before 
   using 'this' in a subclass constructor.
*/
