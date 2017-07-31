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
