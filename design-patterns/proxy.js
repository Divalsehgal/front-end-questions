/*

Proxy pattern means using a middleman (proxy) to control access to an object.
“Instead of calling the real object directly,
 we call a proxy that controls how the real object is accessed.
 intercepting behavior
*/

const user = {
    name: "Dival",
    age: 25
}

const userProxy = new Proxy(user, {
    get(target, prop) {
        console.log("Accessing:", prop)
        return target[prop]
    }
})

userProxy.name = "Minal"
console.log(userProxy.name, user)

