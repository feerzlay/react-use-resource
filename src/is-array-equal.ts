export function isArrayEqueal(a: unknown[], b: unknown[]) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}
