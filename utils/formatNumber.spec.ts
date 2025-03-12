import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("returns the number as a string", () => {
    expect(formatNumber(123)).toBe("123");
  });

  it("returns the number in millions as a string with 3 decimal places and an M suffix", () => {
    expect(formatNumber(1234567)).toBe("1.235M");
  });

  it("returns the number in billions as a string with 4 decimal places and a B suffix", () => {
    expect(formatNumber(1234567890)).toBe("1.2346B");
  });

  it("returns the number in trillions as a string with 4 decimal places and a T suffix", () => {
    expect(formatNumber(1234567890123)).toBe("1.2346T");
  });
});
