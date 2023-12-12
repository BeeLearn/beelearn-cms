export type PropsWithClassName = {
  className?: string;
};

export type PropsWithVisibility = {
  visible: boolean,
};

export const join = function (self: string, ...values: Array<string|undefined>) : string {
  return values.reduceRight((a, b) => b ? a + " " + b : a, self) as string;
};
