import { describe, expect, it } from "@jest/globals";
import { getLruMapEntry, setLruMapEntry } from "src/helpers/lruMap";

describe("setLruMapEntry", () => {
  it("evicts the oldest entry when the map exceeds maxEntries", () => {
    const map = new Map<string, string>();

    setLruMapEntry(map, "a", "1", 2);
    setLruMapEntry(map, "b", "2", 2);
    setLruMapEntry(map, "c", "3", 2);

    expect(map.has("a")).toBe(false);
    expect(map.get("b")).toBe("2");
    expect(map.get("c")).toBe("3");
  });

  it("getLruMapEntry refreshes LRU order on hit", () => {
    const map = new Map<string, string>();

    setLruMapEntry(map, "a", "1", 2);
    setLruMapEntry(map, "b", "2", 2);
    expect(getLruMapEntry(map, "a", 2)).toBe("1");
    setLruMapEntry(map, "c", "3", 2);

    expect(map.has("b")).toBe(false);
    expect(map.get("a")).toBe("1");
    expect(map.get("c")).toBe("3");
  });

  it("refreshes an existing key without growing the map", () => {
    const map = new Map<string, string>([
      ["a", "1"],
      ["b", "2"],
    ]);

    setLruMapEntry(map, "a", "updated", 2);

    expect(map.size).toBe(2);
    expect(map.get("a")).toBe("updated");
  });
});
