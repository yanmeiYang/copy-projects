import { config } from '../utils';
import { wget } from '../utils/request';

const { api } = config;

const LSKEY_KGDATA = 'LSKEY_KGDATA';

export async function getKGSuggest(query, callback) {
  console.log('>>>>> enter getKGSupport function ...');
  let kgdata;
  const obj = localStorage.getItem(LSKEY_KGDATA);
  if (obj) {
    try {
      kgdata = JSON.parse(obj);
    } catch (err) {
      console.error(err);
    }
  }
  // console.log('>>>>> getKGData from LS:', kgdata);

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
  // i.e. search...and return 3 level things.
  const findResult = lookup(kgdata, query);
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
