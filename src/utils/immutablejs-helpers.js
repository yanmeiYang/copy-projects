import { Map } from 'immutable';

const Maps = {

  getAll: (map, ...keys) => {
    if (!Map.isMap(map)) {
      throw new Error('map is not a immutable Map!' + map);
    }
    // TODO justify obj is immutablejs Map.
    if (!map || !keys || keys.length <= 0) {
      return [];
    }
    return keys.map(key => map.get(key));
  },
  isSame: (map1, map2) => {
    return map1.equals(map2);
  },

};


export {
  Maps,
};
