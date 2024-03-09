export const BLOCK_MAX_DENSITY = 3;

export const getRange = (length: number) => [...Array(length).keys()];

const getRandomBrick = () => Math.floor(Math.random() * BLOCK_MAX_DENSITY);

export const getBricks = (rows: any, columns: any) =>
  getRange(rows).map(() => getRange(columns).map(getRandomBrick));
