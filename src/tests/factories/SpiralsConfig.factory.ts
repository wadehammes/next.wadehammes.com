import { faker } from "@faker-js/faker";
import type { SpiralsConfig } from "src/components/Spirals/Spirals.utils";
import { BaseFactory } from "src/tests/factories/BaseFactory";

type SpiralsConfigFactoryOptions = Record<string, never>;

const SHAPES = ["circle", "square", "triangle", "polygon"] as const;

class SpiralsConfigFactory extends BaseFactory<
  SpiralsConfig,
  SpiralsConfigFactoryOptions
> {
  build(
    attributes?: Partial<SpiralsConfig>,
    _options?: SpiralsConfigFactoryOptions,
  ) {
    const instance: SpiralsConfig = {
      animationScale: faker.number.float({
        min: 0.5,
        max: 5,
        fractionDigits: 1,
      }),
      animationSpeed: faker.number.int({ min: 5000, max: 60000 }),
      chroma: faker.number.float({ min: 0.1, max: 0.4, fractionDigits: 2 }),
      circleCount: faker.number.int({ min: 5, max: 30 }),
      circleOffset: faker.number.int({ min: 30, max: 110 }),
      elementSize: faker.number.int({ min: 2, max: 80 }),
      fill: faker.datatype.boolean(),
      hue: faker.number.int({ min: 0, max: 359 }),
      id: faker.string.uuid(),
      lightness: faker.number.float({ min: 0.2, max: 0.9, fractionDigits: 2 }),
      name: faker.lorem.words(2),
      opacitySubtraction: faker.number.float({
        min: 0.04,
        max: 0.12,
        fractionDigits: 2,
      }),
      polygonSides: faker.number.int({ min: 3, max: 12 }),
      pulseEnabled: faker.datatype.boolean(),
      pulseIntensity: faker.number.float({
        min: 0.1,
        max: 0.35,
        fractionDigits: 2,
      }),
      pulseOffset: faker.number.float({
        min: 0,
        max: Math.PI * 2,
        fractionDigits: 2,
      }),
      pulseSpeed: faker.number.float({ min: 0.5, max: 2, fractionDigits: 1 }),
      shape: faker.helpers.arrayElement([...SHAPES]),
      spiralCount: faker.number.int({ min: 3, max: 10 }),
      spiralSpacing: faker.number.float({
        min: 0.25,
        max: 1,
        fractionDigits: 2,
      }),
      strokeWidth: faker.number.float({ min: 0, max: 6, fractionDigits: 1 }),
    };

    return { ...instance, ...(attributes ?? {}) };
  }
}

export const spiralsConfigFactory = new SpiralsConfigFactory();
