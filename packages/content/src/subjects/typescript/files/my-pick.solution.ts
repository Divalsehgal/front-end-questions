// A mapped type over only the chosen keys; the constraint rejects keys T doesn't have.
export type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
