import { randomIntFromInterval } from "./helpers";

describe("randomIntFromInterval", () => {
  it("generated integer is between the two provided integers", () => {
    const lowerBound = 0;
    const upperBound = 10;
    const randomInteger = randomIntFromInterval(lowerBound, upperBound);

    expect(randomInteger).toBeGreaterThanOrEqual(lowerBound);
    expect(randomInteger).toBeLessThanOrEqual(upperBound);
  });
});
