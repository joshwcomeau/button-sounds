export const range = (start: number, end?: number, step = 1) => {
  const output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export function sampleOne<T>(arr: ReadonlyArray<T>): T {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- The index is always within bounds.
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function sample<T>(arr: Array<T>, len = 1): Array<T> {
  const output = [];

  for (let i = 0; i < len; i++) {
    output.push(sampleOne(arr));
  }

  return output;
}

export const random = (
  min: number,
  max: number,
  { rounded }: { rounded: boolean } = { rounded: true },
) => {
  const partialVal = Math.random() * (max - min);

  if (rounded) {
    return Math.floor(partialVal) + min;
  } else {
    return partialVal + min;
  }
};
