export function formatNumber(sum: number): string {
  if (sum >= 1.0e12) {
    return (sum / 1.0e12).toFixed(4) + "T"; // Trillions
  }
  if (sum >= 1.0e9) {
    return (sum / 1.0e9).toFixed(4) + "B"; // Billions
  }
  if (sum >= 1.0e6) {
    return (sum / 1.0e6).toFixed(3) + "M"; // Millions
  }

  return sum.toString();
}
