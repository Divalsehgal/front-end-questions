class NotesStore {
    constructor() {
        this.notes = [];
        this.validStates = ['completed', 'active', 'others'];
    }

    addNote(state, name) {
        if (name === "") {
            throw new Error('Name cannot be empty');
        }

        if (!this.validStates.includes(state)) {
            throw new Error(`Invalid ${state}`);
        }

        this.notes.push({ state, name });
    }

    getNotes(state) {

        if (!this.validStates.includes(state)) {
            throw new Error(`Invalid ${state}`);
        }
        let temp = [];

        this.notes.forEach(note => note.state === state ? temp.push(note.name) : temp);
        return temp
    }
}

const ns = new NotesStore();
ns.addNote("active", "clean clothes");
ns.addNote("active", "go to market");
ns.addNote("active", "play cricket");
ns.addNote("completed", "pick up key from house");
ns.addNote("active", "call minal");

console.log(ns.getNotes("completed"))