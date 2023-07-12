export const getActualEntityUpdates = <T>(
  before: T,
  data: Partial<T>
): Partial<T> => {
  const update = {} as Partial<T>;
  for (const prop in before) {
    if (data.hasOwnProperty(prop) && before[prop] !== data[prop]) {
      update[prop] = data[prop];
    }
  }
  return update;
};
