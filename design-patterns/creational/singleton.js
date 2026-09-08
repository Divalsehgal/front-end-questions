/*
Singleton Pattern ensures a class has only one instance
and provides a global point of access to it.

This example uses a class with a cached instance,
and prevents modifications after the first creation.
*/

class ConfigSingleton {
    constructor() {
        if (ConfigSingleton.instance) {
            return ConfigSingleton.instance
        }

        this.start = () => console.log('App has started')
        this.update = () => console.log('App has updated')
        Object.freeze(this)

        ConfigSingleton.instance = this
    }
}

const configA = new ConfigSingleton()
const configB = new ConfigSingleton()

console.log(configA === configB) // true
configA.start()
configB.update()

configA.name = 'Robert' // no effect because instance is frozen
console.log('Config instance', configA)



