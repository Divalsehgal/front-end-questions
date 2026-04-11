class EventEmitter {

    constructor() {
        this.obj = new Map()
    }

    subscribe(eventName, callback) {
        if (!callback || typeof callback !== 'function') {
            return;
        }

        if (!this.obj.has(eventName)) {
            this.obj.set(eventName, new Set())
        }
        const eventSub = this.obj.get(eventName)
        eventSub.add(callback)

        return {
            unsubscribe: () => {

                eventSub.delete(callback)

                if (eventSub.size === 0) {
                    this.obj.delete(eventName)
                }

            }
        };
    }

    emit(eventName, args = []) {
        if (!this.obj.has(eventName)) {
            return [];
        }
        const eventSub = this.obj.get(eventName)

        // Use map to collect the results from all listeners
        return Array.from(eventSub).map((invoke) => invoke(...args))
    }
}

const emitter = new EventEmitter();

// Subscribe to the onClick event with onClickCallback
function onClickCallback() { return 99 }
const sub = emitter.subscribe('onClick', onClickCallback);

// Emit the event and log the result
console.log(emitter.emit('onClick')); // [99]

// Unsubscribe from the event
sub.unsubscribe();

// Emit again and log the result
console.log(emitter.emit('onClick')); // []
