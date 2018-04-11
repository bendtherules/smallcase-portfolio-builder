export function deepCloneNaive(originalObject) {
  return JSON.parse(JSON.stringify(originalObject));
}
