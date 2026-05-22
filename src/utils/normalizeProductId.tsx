export const normalizeProductId = (id: string) => {
  if (id.startsWith(" ")) {
    return `%20${id.slice(1)}`; // manually encode leading space only
  }
  return id; // return as-is if no space
};