/**
 *  Created by BoGao on 2018-03-08;
 *  helper to support hierarchy model. hierarchy tree component.
 */

/**
 * Created by yangyanmei on 18/1/25.
 */
import React from 'react';
import { fromJS, Map, List } from 'immutable';

const createHierarchy = () => {
  return {
    index: null, // Map(); id -> node
    data: null, // List()

    /** 根据id获取元素 */
    get: (id) => {
      return this.index.get(id);
    },

    // 获取数据 ????
    getData: () => {
      return this.data && this.data.toJSON();
    },
  };
};

const fromData = (index, data) => {
  return Object.assign(createHierarchy(), { index, data });
};

const init = (objs) => {
  const hi = createHierarchy();

  if (!objs || objs.length <= 0) {
    return false;
  }

  // step1 Build index
  const oindex = {};
  for (const obj of objs) {
    if (obj && obj.id) {
      oindex[obj.id] = obj;
    } else {
      console.error('obj in hiObj must have id', obj);
    }
  }

  // step2 建立结构, 修改model，需要将结果写回去。
  Object.keys(oindex).map((id) => {
    const obj = oindex[id];
    const parents = obj.parents;
    if (parents && parents.length > 0) {
      const pid = parents[0];
      const parent = oindex[pid];
      if (parent) {
        // 建立双向连接
        // obj.parent = parent;
        let childs = parent.childs || [];
        childs.push(obj);
        parent.childs = childs;
      }
    }
    return null;
  });

  // convert index.
  hi.index = fromJS(oindex);

  // step3 创建data
  hi.data = List();
  hi.data = hi.data.withMutations((list) => {
    for (const obj of hi.index.values()) {
      const id = obj && obj.get('id');
      const temp = hi.index.get(id);
      const parents = temp && temp.get("parents");
      if (!parents || parents.size === 0) {
        list.push(temp);
      }
    }
  });

  return hi;
};

// --------------------------------------
const findPath = (data, index, id) => {
  if (null == data || index == null) {
    return null;
  }
  const node = index.get(id);
  if (!node) {
    // console.log('ERROR FIND ID', id);
    return null;
  }

  // prepare parents path;
  let parents = node.get('parents');
  parents = parents && parents.toJS() || [];
  parents.reverse();
  parents.push(id);
  // console.log('>>>>>>>> node\'s parents is ', parents);

  // generate path.
  let currentList = data;
  let result = [];
  for (let i = 0; i < parents.length; i += 1) {
    const path = parents[i];
    const idx = currentList.findIndex(item => path === item.get('id'));
    if (idx < 0) {
      // console.log('>>>>>>>>>> error can\'find id ', path);
      return null;
    }

    result.push(idx);
    if (i < parents.length - 1) {
      result.push('childs');
      currentList = currentList.get(idx).get('childs');
    }
  }
  return result
};


export default { fromData, init, findPath };

