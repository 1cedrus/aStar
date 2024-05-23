export class BigMap<Key = string, Value = 'string'> {
  maps: [Map<Key, Value>];
  perMapSizeLimit: number;

  constructor() {
    this.maps = [new Map()];
    this.perMapSizeLimit = 14000000;
  }

  has(key: Key) {
    for (let map of this.maps) {
      if (map.has(key)) {
        return true;
      }
    }
    return false;
  }

  get(key: Key) {
    for (let map of this.maps) {
      if (map.has(key)) {
        return map.get(key);
      }
    }
    return undefined;
  }

  set(key: Key, value: Value) {
    for (let map of this.maps) {
      if (map.has(key)) {
        map.set(key, value);
        return this;
      }
    }
    let map = this.maps[this.maps.length - 1];
    if (map.size > this.perMapSizeLimit) {
      map = new Map();
      this.maps.push(map);
    }
    map.set(key, value);
    return this;
  }

  clear() {
    this.maps.forEach((m) => m.clear());
    this.maps.length = 1;
  }

  get size() {
    return this.maps.reduce((o, map) => o + map.size, 0);
  }
}
