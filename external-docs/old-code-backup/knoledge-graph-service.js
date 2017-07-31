/**
 *  Created by BoGao on 2017-06-12;
 */
import { request, config } from '../utils';
import { wget } from '../utils/request';

const { api } = config;

export async function kgFind(query, rich, dp, dc, ns, nc) {
  const apimeta = api.kgFind;
  return request(apimeta.api.replace(':entry', query), {
    method: 'GET', data: { rich, dp, dc, ns, nc },
    // { rich: 0, dp: 1, dc: 1, ns: 4, nc: 100 },
  });
}

// -------------------------------------------------------------
// 一些转换的方法.
/**
 * @param data
 *
 * map: id -> index
 * index: 100000000 Hits的节点是 一百万+index.
 */
export function indexingKGData(data) {
  const index = {};

  const add = (node, idx, base) => {
    if (!node) {
      console.error('Node invalid!');
      return false;
    }
    if (index[node.id]) {
      const rawindex = index[node.id];
      const oldNode = rawindex && rawindex >= 1000000 ?
        data.hits[rawindex - 1000000] :
        data.ref[rawindex];
      oldNode.duplicated = true;
      const oldidx = index[node.id];

      // console.warn('Ignore duplicated node! ', idx, '==', oldidx, node, oldNode);

    } else {
      // add index.
      index[node.id] = base + idx;
    }
    return true;
  };

  if (data && data.hits) {
    data.hits.map((node, idx) => {
      // eslint-disable-next-line no-param-reassign
      node.hit = true;
      return add(node, idx, 1000000);
    });
    if (data.ref) {
      data.ref.map((node, idx) => {
        return add(node, idx, 0);
      });
    }
  }
  return index;
}

export function kgFetcher(kgdata, kgindex) {
  this.kgdata = kgdata;
  this.kgindex = kgindex;

  const getNode = (nodeId) => {
    const rawIndex = this.kgindex[nodeId];
    return rawIndex && rawIndex >= 1000000 ?
      this.kgdata.hits[rawIndex - 1000000] :
      this.kgdata.ref[rawIndex];
  };

  return {
    kgdata,
    kgindex,
    getChildNode: (node) => {
      if (node && node.child_nodes && node.child_nodes.length > 0) {
        return node.child_nodes.map((cid) => {
          // console.log('------------', cid, this.kgindex[cid]);
          const rawindex = this.kgindex[cid];
          return rawindex && rawindex >= 1000000 ?
            this.kgdata.hits[rawindex - 1000000] :
            this.kgdata.ref[rawindex];
        });
      }
      return null;
    },
    getNode,
    findTops: () => {
      if (!kgdata || !kgdata.hits) {
        return null;
      }
      const tops = {};
      kgdata.hits.map((hit) => {
        let node = hit;
        let max = 100;
        while (node && node.parent && getNode(node.parent) && max > 0) {
          node = getNode(node.parent);
          max -= 1;
        }
        tops[node.id] = true;
        return null;
      });
      // console.log('tops is : ', tops);
      const topNodes = Object.keys(tops).map(top => getNode(top));
      // TODO sort it.
      return topNodes;
    },
    findTop: (fromNode) => {
      if (!fromNode || !kgdata || !kgdata.hits) {
        return null;
      }
      let node = fromNode;
      let max = 100;
      while (node && node.parent && getNode(node.parent) && max > 0) {
        node = getNode(node.parent);
        max -= 1;
      }
      return node;
    },
  };
}


// ------------------------------------------------------------- deprecated below. ------

const LSKEY_KGDATA = 'LSKEY_KGDATA';

// Special Query '__ALL'
const QUERY_ALL = '__ALL';

export async function getKGSuggest(query, callback) {
  let kgdata;
  const obj = localStorage.getItem(LSKEY_KGDATA);
  if (obj) {
    try {
      kgdata = JSON.parse(obj);
    } catch (err) {
      console.error(err);
    }
  }

  if (!kgdata) {
    console.log('>>>>> fetch :');
    const pms = wget('/lab/kg_detailed.json');
    pms.then(((data) => {
      console.log('>>>>> save to ls:', data);
      kgdata = createIndex(data);
      localStorage.setItem(LSKEY_KGDATA, JSON.stringify(kgdata));
      return postDone(kgdata, query, callback);
    })).catch((error) => {
      console.error(error);
      localStorage.removeItem(LSKEY_KGDATA);
      return undefined;
    });
  }
  return postDone(kgdata, query, callback);
}

function postDone(kgdata, query, callback) {
  // localStorage.removeItem(LSKEY_KGDATA);// debug always remove this.
  // TODO use kgdata to do something.....
  // i.e. search...and return 3 level things
  let findResult;
  if (QUERY_ALL === query) {
    findResult = getAll(kgdata);
  } else {
    findResult = lookup(kgdata, query);
  }
  // console.log(kgdata);
  // console.log(findResult);
  if (callback) {
    callback(findResult);
  }
  return findResult;
}


function createIndex(data) {
  console.log('---- create index to data', data);

  const indexes = {};

  let index = -1;
  data && data.nodes && data.nodes.map((item) => {
    index += 1;
    addToIndex(indexes, item.name, index);
    addToIndex(indexes, item.zh_name, index);
    if (item.alias && item.alias.length > 0) {
      item.alias.map((alias) => {
        return addToIndex(indexes, alias, index);
      });
    }

    return '';
  });
  return { index: indexes, data: data.nodes };
}

function addToIndex(indexes, name, index) {
  const cleanedName = cleanData(name);
  if (!indexes[cleanedName]) {
    indexes[cleanedName] = index;
  } else {
    console.error('Error: already has key ', cleanedName);
  }
}

function cleanData(name) {
  return name.trim().toLowerCase();
}


function lookup(kgdata, query) {
  // TODO do some search...
  const cleanedQuery = cleanData(query);
  const idx = kgdata.index[cleanedQuery];
  if (idx >= 0) {
    const item = kgdata.data[idx];
    // 当前 Key
    let node = {
      name: item.name,
      children: [],
      definition: item.definition,
      zh: item.zh_name,
      type: 'current',
    };
    // Child keys.
    if (item.cn && item.cn.length > 0) {
      item.cn.map((childKey) => {
        const cleanedChildKey = cleanData(childKey);
        const childIdx = kgdata.index[cleanedChildKey];
        if (childIdx >= 0) {
          const childNode = kgdata.data[childIdx];
          node.children.push({
            name: childNode.name,
            level: 3,
            definition: childNode.definition,
            zh: childNode.zh_name,
            type: 'child',
          });
        }
        return null;
      });
    }
    // parent keys.
    // TODO
    if (item.pn && item.pn.length > 0) {
      // first we load only one parent node.
      const cleanedParentKey = cleanData(item.pn[0]);
      const idx = kgdata.index[cleanedParentKey];
      if (idx >= 0) {
        const parentItem = kgdata.data[idx];
        const oldNode = node;
        node = {
          name: parentItem.name,
          children: [],
          definition: parentItem.definition,
          zh: parentItem.zh_name,
          type: 'parent',
        };
        // add two more simblings of search.// TODO ......
        // if(parentItem.cn && parentItem.cn.length>0){
        //   const pcIdx = kgdata.index[]
        // }
        // 推荐词：sibling


        node.children.push(oldNode);
      }
    }
    return node;
  }
  return null;
}


function getAll(kgdata) {
  // return lookupAdvanced(kgdata, 'Mathematics of computing', 2);
  return lookupAdvanced(kgdata, '_root', 2);
}

// Now only suport search _root.
function lookupAdvanced(kgdata, query, depth) {
  // TODO do some search...
  // current node.
  const cleanedQuery = cleanData(query);
  const idx = kgdata.index[cleanedQuery];
  if (idx >= 0) {
    const item = kgdata.data[idx];
    // 当前 Key
    let node = {
      name: item.name,
      children: [],
      definition: item.definition,
      zh: item.zh_name,
    };
    // Child keys.
    appendChilds(kgdata, node, item, 2);

    // parent keys.
    // TODO
    if (item.pn && item.pn.length > 0) {
      // first we load only one parent node.
      const cleanedParentKey = cleanData(item.pn[0]);
      const idx = kgdata.index[cleanedParentKey];
      if (idx >= 0) {
        const parentItem = kgdata.data[idx];
        const oldNode = node;
        node = {
          name: parentItem.name,
          children: [],
          definition: parentItem.definition,
          zh: parentItem.zh_name,
        };

        // add two more simblings of search.// TODO ......
        // if(parentItem.cn && parentItem.cn.length>0){
        //   const pcIdx = kgdata.index[]
        // }


        node.children.push(oldNode);
      }
    }
    return node;
  }
  return null;
}

// node - generated current node.
// item - current original data item.
function appendChilds(kgdata, node, item, level) {
  // console.log(node.zh, level, item.cn);
  if (item.cn && item.cn.length > 0) {
    item.cn.map((childKey) => {
      const cleanedChildKey = cleanData(childKey);
      const childIdx = kgdata.index[cleanedChildKey];
      if (childIdx >= 0) {
        const childNode = kgdata.data[childIdx];
        const newNode = {
          name: childNode.name,
          level,
          definition: childNode.definition,
          zh: childNode.zh_name,
        };
        // go recursion
        appendChilds(kgdata, newNode, childNode, level + 1);
        if (!node.children) {
          node.children = [];
        }
        node.children.push(newNode);
      }
      return null;
    });
  }
  return null;
}
