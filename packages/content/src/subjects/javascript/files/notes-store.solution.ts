type State = 'completed' | 'active' | 'others';

export class NotesStore {
  private notes: { state: State; name: string }[] = [];
  private validStates = ['completed', 'active', 'others'];

  addNote(state: State, name: string): void {
    if (name === '') {
      throw new Error('Name cannot be empty');
    }
    if (!this.validStates.includes(state)) {
      throw new Error(`Invalid state ${state}`);
    }
    this.notes.push({ state, name });
  }

  getNotes(state: State): string[] {
    if (!this.validStates.includes(state)) {
      throw new Error(`Invalid state ${state}`);
    }
    const result: string[] = [];
    for (const note of this.notes) {
      if (note.state === state) {
        result.push(note.name);
      }
    }
    return result;
  }
}
