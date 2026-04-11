/**
 * A Class Decorator that logs every method call made to the class it decorates.
 */
function LogMethodCalls<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            
            // Scan the prototype of the original class for methods
            const proto = constructor.prototype;
            const propertyNames = Object.getOwnPropertyNames(proto);

            for (const name of propertyNames) {
                const originalMethod = (this as any)[name];

                // We only want to wrap actual functions, and skip the 'constructor'
                if (name !== 'constructor' && typeof originalMethod === 'function') {
                    // Replace the method on THIS instance with a logging wrapper
                    (this as any)[name] = (...methodArgs: any[]) => {
                        console.log(`\n>> [LOG] Calling method: "${name}"`);
                        console.log(`>> [LOG] Arguments:`, methodArgs);
                        
                        const result = originalMethod.apply(this, methodArgs);
                        
                        console.log(`>> [LOG] Result:`, result);
                        return result;
                    };
                }
            }
        }
    };
}

// --- Usage Example ---

@LogMethodCalls
class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }

    multiply(a: number, b: number): number {
        return a * b;
    }

    greet(name: string): string {
        return `Hello, ${name}!`;
    }
}

// Instantiate the decorated class
const calc = new Calculator();

calc.add(5, 10);
calc.multiply(3, 4);
calc.greet("Dival");
