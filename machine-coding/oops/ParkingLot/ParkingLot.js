class Slot {
    constructor(id) {
        this.id = id;
        this.vehicle = null;
        this.entryTime = null;
    }

    isAvailable() {
        return this.vehicle === null;
    }

    parkVehicle(vehicle, entryTime) {
        this.vehicle = vehicle;
        this.entryTime = entryTime;
    }

    removeVehicle(exitTime, ratePerHour) {
        if (!this.vehicle) return 0;

        const duration = (exitTime - this.entryTime) / (1000 * 60 * 60); // Convert ms to hours
        const cost = Math.ceil(duration) * ratePerHour;

        this.vehicle = null;
        this.entryTime = null;
        return cost;
    }
}

class ParkingLot {
    constructor(capacity, ratePerHour) {
        this.capacity = capacity;
        this.ratePerHour = ratePerHour;
        this.slots = Array.from({ length: capacity }, (_, i) => new Slot(i + 1));
    }

    findAvailableSlot() {
        return this.slots.find(slot => slot.isAvailable());
    }

    parkVehicle(vehicle) {
        const slot = this.findAvailableSlot();
        if (!slot) {
            console.log("Parking lot is full!");
            return null;
        }
        const entryTime = Date.now();
        slot.parkVehicle(vehicle, entryTime);
        console.log(`Vehicle ${vehicle} parked at slot ${slot.id}`);
        return slot.id;
    }

    exitVehicle(slotId) {
        const slot = this.slots.find(slot => slot.id === slotId);
        if (!slot || slot.isAvailable()) {
            console.log("Invalid slot or no vehicle found!");
            return 0;
        }
        const exitTime = Date.now();
        const cost = slot.removeVehicle(exitTime, this.ratePerHour);
        console.log(`Vehicle exited from slot ${slotId}. Total cost: $${cost}`);
        return cost;
    }
}

// Example Usage
const lot = new ParkingLot(3, 5); // 3 slots, $5 per hour

lot.parkVehicle("Car-101");
lot.parkVehicle("Car-102");
lot.parkVehicle("Car-103"); // All slots occupied

setTimeout(() => {
    lot.exitVehicle(2); // Exiting Car-102
    lot.parkVehicle("Car-104"); // New car parks
}, 2000); // Simulating a delay
