/**
 * Created by yangyanmei on 18/1/25.
 */
import React from 'react';
import { fromJS, Map, List } from 'immutable';

// objs 对象数组
const createHiObj = (objs) => {
  let index = null; // Map(); id -> node
  let data = List();

  const init = () => {
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
    index = fromJS(oindex);

    // step3 创建data
    data = data.withMutations((list) => {
      for (const obj of index.values()) {
        const id = obj && obj.get('id');
        const temp = index.get(id);
        const parents = temp && temp.get("parents");
        if (!parents || parents.size === 0) {
          list.push(temp);
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


// const createHiObj = (objs) => {
//   let index = null; // Map(); id -> node
//   let data = List();
//
//   const init = () => {
//     index = Map();
//
//     if (!objs || objs.length <= 0) {
//       return false;
//     }
//
//
//     // step1 Build index
//     index = index.withMutations((map) => {
//       for (const obj of objs) {
//         if (obj && obj.id) {
//           map.set(obj.id, fromJS(obj));
//         } else {
//           console.error('obj in hiObj must have id', obj);
//         }
//       }
//     });
//
//     // step2 建立结构, 修改model，需要将结果写回去。
//     // for (const obj of index.values()) {
//     for (const id of index.keys()) {
//       let obj = index.get(id);
//       const parents = obj.get('parents');
//
//       if (parents && parents.size > 0) {
//         const pid = parents.get(0);
//         let parent = index.get(pid);
//         if (parent) {
//           // 建立双向连接
//           obj = obj.set('parent', parent); // parent is not parents
//           // console.log('|||| --- ', obj);
//           let childs = parent.get('childs') || List();
//           childs = childs.push(obj);
//           parent = parent.set('childs', childs);
//           // console.log('[%s] %s;', pid, childs.size, childs,);
//           // update index.
//           index = index.set(id, obj);
//           index = index.set(pid, parent)
//         }
//       }
//     }
//
//     // step3 创建data
//     data = data.withMutations((list) => {
//       for (const obj of index.values()) {
//         if (obj && obj.get('id')) {
//           const id = obj.get('id');
//           const temp = index.get(id);
//           if (temp && !temp.get('parent')) {
//             list.push(temp);
//           }
//         }
//       }
//     });
//   };
//
//   init();
//
//   return {
//     // 根据id获取元素
//     get: (id) => {
//       return index.get(id);
//     },
//
//     getData: () => {
//       return data.toJSON();
//     },
//
//   };
// };
