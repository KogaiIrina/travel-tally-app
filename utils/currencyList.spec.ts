import { currencyList } from "./currencyList";

describe("currencyList", () => {
  it("has 100+ currencies", () => {
    expect(Object.keys(currencyList).length).toBeGreaterThan(100);
  });

  it("has a currency for USD", () => {
    expect(currencyList.USD).toBe("$");
  });
});
