export const MAX_SPIRALS_CACHE_ENTRIES = 2000;

export const setLruMapEntry = (
  map: Map<string, string>,
  key: string,
  value: string,
  maxEntries = MAX_SPIRALS_CACHE_ENTRIES,
): void => {
  if (map.has(key)) {
    map.delete(key);
  } else if (map.size >= maxEntries) {
    const oldestKey = map.keys().next().value;
    if (oldestKey !== undefined) {
      map.delete(oldestKey);
    }
  }

  map.set(key, value);
};

export const getLruMapEntry = (
  map: Map<string, string>,
  key: string,
  maxEntries = MAX_SPIRALS_CACHE_ENTRIES,
): string | undefined => {
  const value = map.get(key);
  if (value === undefined) {
    return undefined;
  }

  setLruMapEntry(map, key, value, maxEntries);
  return value;
};
