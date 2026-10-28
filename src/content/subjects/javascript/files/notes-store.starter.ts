type State = 'completed' | 'active' | 'others';

/**
 * addNote(state, name): throws Error('Name cannot be empty') for '', and Error(`Invalid state ${state}`) for unknown states.
 * getNotes(state): names of notes in that state, in insertion order; throws the same invalid-state error.
 */
export class NotesStore {
  addNote(state: State, name: string): void {
    // your code
  }

  getNotes(state: State): string[] {
    // your code
  }
}
