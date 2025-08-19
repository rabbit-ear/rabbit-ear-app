export interface Command {
  // todo: consider a static initializer which can return null
  // if conditions are not met, then it avoids being added to undo history
  execute(): void;
  undo(): void;
}
