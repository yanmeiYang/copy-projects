/* eslint-disable camelcase */
import React from 'react';

/**
 * Created by BoGao on 2017/8/3.
 */
const default_placeholder = '__DEFAULT_PLACEHOLDER__';

// TODO with parameters.
function fill(holeList, defaultHoleList, config) {
  if (!holeList) {
    return defaultHoleList;
  }
  if (!defaultHoleList) {
    return holeList;
  }
  const holes = holeList;
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
    if (config && (config.withContainer || config.containerClass)) {
      return (
        <div className={config.containerClass}>
          {newHoles}
        </div>
      );
    } else {
      return newHoles;
    }
  }
  return null;
}

function fillFuncs(holeList, defaultHoleList, payload, config) {
  let holes = holeList;
  if (!holes) {
    holes = defaultHoleList;
  }
  if (holes && holes && holes.length > 0) {
    const newHoles = [];
    holes.map((elm) => {
      if (elm === default_placeholder) {
        // apply defaults
        if (defaultHoleList && defaultHoleList.length > 0) {
          defaultHoleList.map((hole) => {
            newHoles.push(hole(payload));
            return false;
          });
        }
      } else {
        const jsx = elm(payload);
        // console.log('jsx:', jsx);
        // jsx.props.style = { border: 'solid 1px red' };
        // console.log('jsx:', jsx);
        newHoles.push(jsx);
      }
      return false;
    });
    if (config && (config.withContainer || config.containerClass)) {
      return (
        <div className={config.containerClass}>
          {newHoles}
        </div>
      );
    } else {
      return newHoles;
    }
  }
  return false;
}

module.exports = {

  // placeholders
  IN_COMPONENT_DEFAULT: undefined,
  EMPTY_BLOCK_FUNC: () => null,
  // EMPTY_BLOCK: '',
  EMPTY_ZONE_FUNC: [],
  DEFAULT_PLACEHOLDER: default_placeholder,

  // methods
  fill, fillFuncs,
};
