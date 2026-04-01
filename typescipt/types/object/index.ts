/*
An interface in TypeScript is 
a way to define a contract for the shape of an object.

interfaces are preferred for public contracts,
while types are used for internal flexibility and 
composition.”
*/



interface Vehicle {
    name: string
    model: number
    type: string
    isLaunched?: boolean //optional
}

interface Name {
    id: string;
    name: string;
}

/*
Designed for extension
Scales better in large apps
*/

interface Admin extends Name {
    role: string;
}

interface User {
    name: string;
}

interface User {
    age: number;
}

class Person implements User {
    id = "1";
    name = "Dival";
    age = 30;
}

/*

Normaly Type we use for Union,Partial
*/

type UserType = {
    id: string;
    name: string;
    age: number;
};
type Status = "success" | "error" | "loading";

type PartialStatus = Partial<Status>;
type SuccessStatus = Extract<Status, 'success'>;
type OmitStatus = Exclude<Status, 'loading'>;
type UserWithoutAge = Omit<User, "age">;
type UserPreview = Pick<UserType, "id" | "name">;
type UserWithAddress = User & { address: string };



/*
Enums
*/

enum Direction {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

enum Direction1 {
    Up,
    Down,
    Left,
    Right,
}

console.log(Direction.Down)
console.log(Direction[2])
console.log(Direction1[2])




let x: unknown;
if (typeof x === 'string') {
    x.toUpperCase();
}