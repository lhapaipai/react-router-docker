import { describe, expect, test } from "vitest";
import { calculateDimensions, Dimensions } from "./util";
import { ResizeOptions } from "./media.validation";
import { createEmptyImage } from "./.server/image";

function calculateRealDimensions(original: Dimensions, options: ResizeOptions) {
  return new Promise((resolve, reject) => {
    const image = createEmptyImage(original);
    image.resize(options).toBuffer((err, buffer, info) => {
      if (err) {
        reject(err);
      } else {
        const { width, height } = info;
        resolve({ width, height });
      }
    });
  });
}

const testData: [Dimensions, ResizeOptions][] = [];

(["cover", "contain", "fill", "inside", "outside"] as const).forEach((fit) => {
  [
    { width: 400, height: 130 },
    { width: 130, height: 400 },
  ].forEach((inputDimensions) => {
    [{ width: 100 }, { height: 100 }, { width: 100, height: 100 }].forEach((outputDimensions) => {
      testData.push([inputDimensions, { ...outputDimensions, fit }]);
    });
  });
});

describe("calculate Dimensions", () => {
  test.each<[Dimensions, ResizeOptions]>(testData)("basic %o -> %o", async (original, options) => {
    const dimensions = calculateDimensions(original, options);

    const expectedDimensions = await calculateRealDimensions(original, options);
    expect(dimensions).toEqual(expectedDimensions);
  });
});
