/* eslint-disable camelcase */
/**
 * Created by BoGao on 2017/8/3.
 */
const default_placeholder = '__DEFAULT_PLACEHOLDER__';

// TODO with parameters.
function fill(holeList, defaultHoleList) {
  let holes = holeList;
  if (!holes) {
    holes = defaultHoleList;
  }
  if (holes && holes && holes.length > 0) {
    const newHoles = [];
    holes.map((elm) => {
      if (elm === default_placeholder && defaultHoleList && defaultHoleList.length > 0) {
        newHoles.push(...defaultHoleList);
      } else {
        newHoles.push(elm);
      }
      return false;
    });
    return newHoles;
  }
  return false;
}

function fillFuncs(holeList, defaultHoleList, payload) {
  let holes = holeList;
  if (!holes) {
    holes = defaultHoleList;
  }
  if (holes && holes && holes.length > 0) {
    const newHoles = [];
    holes.map((elm) => {
      if (elm === default_placeholder && defaultHoleList && defaultHoleList.length > 0) {
        defaultHoleList.map((hole) => {
          newHoles.push(hole(payload));
          return false;
        });
      } else {
        newHoles.push(elm(payload));
      }
      return false;
    });
    return newHoles;
  }
  return false;
}

module.exports = {

  // placeholders
  IN_COMPONENT_DEFAULT: undefined,
  // EMPTY_BLOCK: '',
  // EMPTY_BLOCK_FUNC: () => false,
  // EMPTY_BLOCK_FUNC_LIST: [],
  DEFAULT_PLACEHOLDER: default_placeholder,

  // methods
  fill, fillFuncs,
};
