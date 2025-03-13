export function getDiffDate(from: Date, to: Date) {
  const diffTime = Math.abs(from.valueOf() - to.valueOf());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
