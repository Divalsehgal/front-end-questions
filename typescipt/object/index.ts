/*
An interface in TypeScript is 
a way to define a contract for the shape of an object.
*/

interface Vehicle {
    name: string
    model: number
    type: string
    isLaunched?:boolean //optional
}