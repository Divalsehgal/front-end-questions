/*

Builder pattern means creating an object step by step using methods,
instead of passing an existing object and modifying it.

Instead of passing all values at once in the constructor,
we build the object step by step using methods.

*/


function UserBuilder() {
    this.user = {}

    this.setName = function (name) {
        this.user.name = name
        return this
    }

    this.setAge = function (age) {
        this.user.age = age
        return this
    }

    this.build = function () {
        return this.user
    }
}

const user = new UserBuilder()
    .setName("Dival")
    .setAge(25)
    .build()