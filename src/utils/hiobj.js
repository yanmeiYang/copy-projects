/**
 * Created by yangyanmei on 18/1/25.
 */
import React from 'react';
import { Map, List } from 'immutable';

// objs 对象数组
const createHiObj = (objs) => {
  let index = null; // Map();
  let data = List();

  const init = () => {
    index = Map();

    if (!objs || objs.length <= 0) {
      return false;
    }

    // step1
    index = index.withMutations((map) => {
      for (const obj of objs) {
        if (obj && obj.id) {
          const newObj = Object.assign({}, obj);
          map.set(obj.id, newObj);
        } else {
          console.error('obj in hiObj must have id', obj);
        }
      }
    });

    // step2 建立结构
    for (const obj of index.values()) {
      if (obj.parents && obj.parents.length > 0) {
        const pid = obj.parents[0];
        const parent = index.get(pid);
        if (parent) {
          // 建立双向连接
          obj.parent = parent;
          parent.childs = parent.childs || [];
          parent.childs.push(obj);
        }
      }
    }

    // step3 创建data
    data = data.withMutations((list) => {
      for (const obj of objs) {
        if (obj && obj.id) {
          const temp = index.get(obj.id);
          if (temp && !temp.parent) {
            list.push(temp);
          }
        }
      }
    });
  };
  init();

  return {
    // 根据id获取元素
    get: (id) => {
      return index.get(id);
    },

    getData: () => {
      return data.toJSON();
    },

  };
};

export { createHiObj };
