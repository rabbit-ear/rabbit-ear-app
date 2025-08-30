export const makeShortUUID = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .concat("aaaaa")
    .substring(0, 5);

export const makeUUID = () =>
  Math.random()
    .toString(16)
    .substring(2);

