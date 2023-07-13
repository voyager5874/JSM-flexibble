export function stripObjectEmptyProperties<T extends Record<string, any>>(
  obj: T
): T {
  const newObj = {} as T;
  for (const prop in obj) {
    if (obj[prop] !== undefined && obj[prop] !== "" && obj[prop] !== null) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}
