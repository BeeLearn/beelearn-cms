export const grow = function <T extends (v: any, k: number) => unknown>(
  length: number,
  mapFn: T
) {
  const prototype = Array();
  prototype.length = length;

  return Array.from(prototype, mapFn);
};
