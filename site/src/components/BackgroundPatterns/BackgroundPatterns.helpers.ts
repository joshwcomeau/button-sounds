/**
 * Convert a CSS linear-gradient angle (0deg = upward) into SVG objectBoundingBox
 * gradient coordinates.
 */
export function angleToGradientCoords(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;

  return {
    x1: 0.5 - Math.sin(rad) / 2,
    y1: 0.5 + Math.cos(rad) / 2,
    x2: 0.5 + Math.sin(rad) / 2,
    y2: 0.5 - Math.cos(rad) / 2,
  };
}
