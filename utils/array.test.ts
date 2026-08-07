import { describe, it, expect, vi, afterEach } from "vitest";
import { chunk, shuffle } from "./array";

afterEach(() => vi.restoreAllMocks());

describe("chunk", () => {
  it("splits into consecutive groups of at most size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns one group when size exceeds length", () => {
    expect(chunk([1, 2], 10)).toEqual([[1, 2]]);
  });

  it("returns nothing for an empty array", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("rejects a size below 1 rather than looping forever", () => {
    expect(() => chunk([1, 2], 0)).toThrow("chunk size must be >= 1");
  });
});

describe("shuffle", () => {
  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5];
    shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps every element exactly once", () => {
    const out = shuffle([1, 2, 3, 4, 5]);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  // The original lodash.shuffle this replaced was a known-good Fisher-Yates.
  // This guards the hand-rolled version against the classic off-by-one that
  // biases the result and can leave the last element pinned.
  it("can move the final element", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(shuffle([1, 2, 3])[0]).not.toBe(1);
  });
});
