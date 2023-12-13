export function join(self: string, ...others: Array<string | undefined>) {
  return others.reduceRight(
    (acc, value) => (value ? acc + " " + value : acc),
    self
  ) as string;
}
