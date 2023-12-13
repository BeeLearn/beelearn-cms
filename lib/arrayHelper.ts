export function get<T extends Record<string, any>>(__value: T, __name: string) {
  const keys = __name.split(".");
  let result = __value;

  for (const key of keys) {
    if (result && result.hasOwnProperty(key)) result = result[key];
    else return null;
  }

  return result;
}

export function groupBy<T, R>(values: T[], predicate: (value: T) => R) {
  const groupedMap = new Map<R, T[]>();

  for (const value of values) {
    const key = predicate(value);
    const group = groupedMap.get(key) || [];

    group.push(value);
    groupedMap.set(key, group);
  }

  return groupedMap;
}

export function diffObject<T extends Record<string, any>>(
  first: T,
  second: T
): Partial<T> {
  const diff: Record<string, any> = {};

  for (const [key, value] of Object.entries(first)) {
    const newValue = second[key];
    if (Array.isArray(value)) {
      const result = diffArray(value, newValue);
      if (result) diff[key] = result;
    } else if (typeof value === "object") {
      const result = diffObject(value, newValue);
      if (Object.keys(result).length > 0) diff[key] = result;
    } else if (newValue !== value) {
      diff[key] = newValue;
    }
  }

  return diff as Partial<T>;
}

type TEntity = { id: number };

type TDiff = {
  add: number[];
  create: TEntity[];
  remove: number[];
  update:  Record<any, TEntity>;
};

export function diffArray<T extends Array<TEntity>>(a: T, b: T) {
  const diff: TDiff = {
    add: [],
    create: [],
    remove: [],
    update: {},
  };

  for (const element of b) {
    if (!element.id) {
      diff.create.push(element);
      continue;
    }

    const original = a.filter((value) => value.id === element.id).at(0);

    if (original) { 
      const value = diffObject(original, element);

      if (Object.keys(value).length > 0) {
        diff.update[original.id] = {
          id: original.id,
          ...value,
        };
      }
    } else  if(element.id){
      diff.add.push(element.id);
    }
  }

  for (const element of a) {
    const original = b.filter((value) => value.id === element.id).at(0);

    if (!original) {
      diff.remove.push(element.id);
    }
  }

  if (
    diff.create.length > 0 ||
    diff.add.length > 0 ||
    Object.keys(diff.update).length > 0 ||
    diff.remove.length > 0
  )
    return diff;

  return null;
}
