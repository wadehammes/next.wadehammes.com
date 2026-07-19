const actual = jest.requireActual<typeof import("../helpers")>("../helpers");

export const randomIntFromInterval = actual.randomIntFromInterval;
export const randomDecFromInterval = actual.randomDecFromInterval;
export const saveSvg = jest.fn(() => true);
