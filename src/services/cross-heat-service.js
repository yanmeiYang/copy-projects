/**
 * Created by ranyanchuan on 2017/9/12.
 */

import { request, config } from 'utils';

const { api } = config;
export async function getDiscipline(params) {
  const { area, k, depth } = params;
  return request(api.getDiscipline.replace(':area', area).replace(':k', k).replace(':depth', depth), {
    method: 'GET',
  });
}

export async function getACMDiscipline(params) {
  const { entry, rich, dp, dc, ns, nc } = params;
  return request(api.getACMDiscipline
    .replace(':entry', entry)
    .replace(':rich', rich)
    .replace(':dp', dp)
    .replace(':dc', dc)
    .replace(':ns', ns)
    .replace(':nc', nc), {
    method: 'GET',
  });
}

export async function createDiscipline(params) {
  return request(api.createDiscipline, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function getCrossTree(id) {
  return request(api.getCrossTree
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getCrossPredict(params) {
  const { dt } = params;
  return request(api.getCrossPredict, {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}
export async function getDomainExpert(ids) {
  return request(api.getExpertByIds, {
    method: 'POST',
    body: JSON.stringify(ids),
  });
}

export async function getDomainPub(ids) {
  return request(api.getPubByIds, {
    method: 'POST',
    body: JSON.stringify(ids),
  });
}


export async function delTaskList(id) {
  return request(api.delTaskList
    .replace(':id', id), {
    method: 'DELETE',
  });
}

export async function getSuggest(query) {
  return request(api.getSuggest
    .replace(':query', query), {
    method: 'GET',
  });
}


export async function addCrossField(params) {
  return request(api.addCrossField, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function getCrossFieldById(id) {
  return request(api.getCrossFieldById
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getTaskList(offset, size) {
  return request(api.getCrossFieldList
    .replace(':offset', offset)
    .replace(':size', size), {
    method: 'GET',
  });
}

export async function getAggregate(params) {
  const { method, dt } = params;
  return request(api.getAggregate
    .replace(':method', method), {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}

export function domainChange(dataSoure, key) {
  const { detail } = dataSoure;
  if (key === 'overview') {
    const arrNode = dataSoure.data;
    return { data: changeHeat(arrNode), detail, result: changeDetail(detail) };
  } else {
    return { data: changeHeat(dataSoure), detail: null, result: changeDetail(detail) };
  }
}


export function getCrossFieldNode(yTree, xTree) {
  const xNode = getNodeChildren(xTree);
  const yNode = getNodeChildren(yTree);
  const crossList = [];
  yNode.map((yVal) => {
    xNode.map((xVal) => {
      crossList.push({ _1: yVal, _2: xVal });
      return true;
    });
    return true;
  });
  return { crossList, xNode, yNode };
}


export function getTop(infoList, nodeData) {
  const info = [];
  let index = 0;
  for (const item of infoList) {
    if (item) {
      info.push({ id: index, heat: item.heat });
    }
    index += 1;
  }
  const info5 = info.sort(compare('heat')).slice(0, 10);
  const top5 = [];
  for (const item5 of info5) {
    top5.push(`${nodeData[item5.id]._1} & ${nodeData[item5.id]._2}`);
  }
  return top5;
}

// todo 算法优化
export function changeContrast(info) {
  const title = ['中国', '美国', '其他'];
  const { USA, China, OtherNation, authorsCount, EmptyNation, NationBoost } = info;
  const tAuthorsCount = Number(authorsCount) - Number(EmptyNation.authorsCount);
  let aBoost = 1;
  if (tAuthorsCount) {
    aBoost = Number(EmptyNation.authorsCount) / tAuthorsCount;
  }
  const cAuthors = (China.authorsCount * aBoost).toFixed(0);
  const uAuthors = (USA.authorsCount * aBoost).toFixed(0);
  const oAuthors = Number(authorsCount) - (Number(cAuthors) + Number(uAuthors));
  let cPubs = China.pubsCount;
  let uPubs = USA.pubsCount;
  let oPubs = OtherNation.pubsCount;

  let cCit = China.heat;
  let uCit = USA.heat;
  let oCit = OtherNation.heat;

  if (NationBoost) {
    cPubs = China.pubsCount.toFixed(0) * 1;
    uPubs = USA.pubsCount.toFixed(0) * 1;
    oPubs = (OtherNation.pubsCount).toFixed(0) * 1;
    cCit = (China.heat * NationBoost).toFixed(0) * 1;
    uCit = (USA.heat * NationBoost).toFixed(0) * 1;
    oCit = (OtherNation.heat * NationBoost).toFixed(0) * 1;
  }
  const comPub = { title, num: [cPubs, uPubs, oPubs] };
  const comCit = { title, num: [cCit, uCit, oCit] };
  const comPer = { title, num: [cAuthors, uAuthors, oAuthors] };
  return { comPub, comCit, comPer };
}


function compare(prop) {
  return (obj1, obj2) => {
    const val1 = obj1[prop];
    const val2 = obj2[prop];
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  };
}

function getNodeChildren(tree) {
  const list = [];
  tree.children.map(item => list.push(item.name));
  return list;
}


function changeDetail(detail) {
  const result = {
    authors: '#', pubs: '#', aHIndex: '#', aCitation: '#', ChinaAuthors: '#',
    autDis0: '#', autDis1: '#', autDis2: '#', autDis3: '#', autDis4: '#',
    pubDis0: '#', pubDis1: '#', pubDis2: '#', pubDis3: '#', pubDis4: '#',
  };
  if (detail) {
    const { authors, pubs } = detail;
    let boost = detail.authorsCount - detail.EmptyNation.authorsCount;
    if (boost) {
      boost = detail.EmptyNation.authorsCount / boost;
    }
    result.authors = detail.authorsCount;
    result.pubs = detail.pubsCount;
    result.aHIndex = detail.averageHIndex.toFixed(2) * 1;
    result.aCitation = detail.averageCitation.toFixed(2) * 1;
    result.ChinaAuthors = (detail.China.authorsCount * boost).toFixed(0) * 1;
    result.ChinaPro = ((result.ChinaAuthors / result.authors) * 100).toFixed(2);
    result.autDis0 = authors.distribute['0'];
    result.autDis1 = authors.distribute['1'];
    result.autDis2 = authors.distribute['2'];
    result.autDis3 = authors.distribute['3'];
    result.autDis4 = authors.distribute['4'];
    result.autDis0Pro = ((result.autDis0 / result.authors) * 100).toFixed(2);
    result.autDis1Pro = ((result.autDis1 / result.authors) * 100).toFixed(2);
    result.autDis2Pro = ((result.autDis2 / result.authors) * 100).toFixed(2);
    result.autDis3Pro = ((result.autDis3 / result.authors) * 100).toFixed(2);
    result.autDis4Pro = ((result.autDis4 / result.authors) * 100).toFixed(2);
    result.pubDis0 = pubs.distribute['0'];
    result.pubDis1 = pubs.distribute['1'];
    result.pubDis2 = pubs.distribute['2'];
    result.pubDis3 = pubs.distribute['3'];
    result.pubDis4 = pubs.distribute['4'];

    result.pubDis0Pro = ((result.pubDis0 / result.pubs) * 100).toFixed(2);
    result.pubDis1Pro = ((result.pubDis1 / result.pubs) * 100).toFixed(2);
    result.pubDis2Pro = ((result.pubDis2 / result.pubs) * 100).toFixed(2);
    result.pubDis3Pro = ((result.pubDis3 / result.pubs) * 100).toFixed(2);
    result.pubDis4Pro = ((result.pubDis4 / result.pubs) * 100).toFixed(2);


    const authorTable = [];
    const pubTable = [];
    authorTable.push(
      { key: '1', h_index: '小于10', author: result.autDis0, pro: `${result.autDis0Pro}%` },
      { key: '2', h_index: '10~20', author: result.autDis1, pro: `${result.autDis1Pro}%` },
      { key: '3', h_index: '20~40', author: result.autDis2, pro: `${result.autDis2Pro}%` },
      { key: '4', h_index: '大于40', author: result.autDis3, pro: `${result.autDis3Pro}%` },
      { key: '5', h_index: '总计', author: result.authors, pro: '100%' },
    );
    pubTable.push(
      { key: '1', citation: '小于10', author: result.pubDis0, pro: `${result.pubDis0Pro}%` },
      { key: '2', citation: '1~10', author: result.pubDis1, pro: `${result.pubDis1Pro}%` },
      { key: '3', citation: '10~100', author: result.pubDis2, pro: `${result.pubDis2Pro}%` },
      { key: '4', citation: '100~200', author: result.pubDis3, pro: `${result.pubDis3Pro}%` },
      { key: '5', citation: '大于200', author: result.pubDis4, pro: `${result.pubDis4Pro}%` },
      { key: '6', citation: '总计', author: result.pubs, pro: '100%' },
    );


    const authorTh = ['H-index', '专家人数', '分布占比'];
    const authorTd = [];
    authorTd.push(
      ['小于10', result.autDis0, `${result.autDis0Pro}%`], ['10~20', result.autDis1, `${result.autDis1Pro}%`],
      ['20~40', result.autDis2, `${result.autDis2Pro}%`], ['大于40', result.autDis3, `${result.autDis3Pro}%`],
      ['总计', result.authors, '100%'],
    );
    const pubTh = ['Citation', '专家人数', '分布占比'];
    const pubTd = [];
    pubTd.push(
      ['小于10', result.pubDis0, `${result.pubDis0Pro}%`], ['1~10', result.pubDis1, `${result.pubDis1Pro}%`],
      ['10~100', result.pubDis2, `${result.pubDis2Pro}%`], ['100~200', result.pubDis3, `${result.pubDis3Pro}%`],
      ['大于200', result.pubDis4, `${result.pubDis4Pro}%`], ['总计', result.pubs, '100%'],
    );
    result.authorTable = authorTable;
    result.pubTable = pubTable;
    result.eAuthorTable = { authorTh, authorTd };
    result.ePubTable = { pubTh, pubTd };
  }
  return result;
}

function changeHeat(arrNode) {
  const { maxBar, heatArray, maxHeat, top } = getMaxMinChange(arrNode);
  const data = arrNode.map((item) => {
    const temp = {};
    if (item) {
      const { pubsCount, authorsCount, heat, status } = item;
      const cPub = maxBar > 0 ? Math.log(pubsCount + 1) / Math.log(maxBar + 1) : 0;
      const cAuthor = maxBar > 0 ? Math.log(authorsCount + 1) / Math.log(maxBar + 1) : 0;
      temp.cHeat = (maxHeat > 0 && heat > 0) ? getColor(heat, heatArray, top) : (status === 'sleep' ? '#E6E5E5' : '#FFFFFF');
      temp.cPub = `${(cPub * 60).toFixed(0)}px`;
      temp.cAuthor = `${(cAuthor * 60).toFixed(0)}px`;
      temp.pubsCount = pubsCount;
      temp.authorsCount = authorsCount;
      temp.heat = heat;
    } else {
      temp.cHeat = '#FFFFFF';
      temp.cPub = '0px';
      temp.cAuthor = '0px';
      temp.pubsCount = 0;
      temp.authorsCount = 0;
      temp.heat = 0;
    }
    return temp;
  });
  return data;
}


function getColor(value, heatArray, top) {
  const colorHeat = ['#FFFFFF', '#FFF2EE', '#FFE5DC', '#FFD9CB', '#FFD9CB', '#FFBFA8', '#FFB296', '#FFA585', '#FF9973', '#FF8C62', '#cc4c1eeb'];
  let color = colorHeat[1];
  for (let i = heatArray.length; i > 0; i--) {
    if (value * 1 > heatArray[i]) {
      color = colorHeat[i];
      break;
    }
  }
  for (let j = 0; j < top.length; j++) {
    if (value * 1 === top[j]) {
      color = '#a92e01';
      break;
    }
  }
  return color;
}

function getMaxMinChange(nodeArray) {
  const bar = [];
  const heat = [];
  for (const item of nodeArray || []) {
    if (item) {
      bar.push(parseInt(item.pubsCount), parseInt(item.authorsCount));
      const tmpHeat = item.heat * 1;
      if (tmpHeat > 0) {
        heat.push(tmpHeat);
      }
    }
  }
  const top = heat.sort(sortNumDown).slice(0, 5);
  const heatSet = new Set(heat);
  const heatSetSort = [...heatSet].sort(sortNumUp);
  const len = heatSetSort.length >= 10 ? 10 : heatSetSort.length;
  const minHeat = len > 0 ? parseInt(heatSetSort.length / len) : 0;
  const heatArray = [];
  for (let i = 0; i < len - 1; i++) {
    heatArray.push(heatSetSort[i * minHeat]);
  }
  const maxBar = Math.max(...bar);
  const maxHeat = Math.max(...heatArray);
  return { maxBar, maxHeat, heatArray, top };
}

// 排序
function sortNumUp(a, b) {
  return a - b;
}

function sortNumDown(a, b) {
  return b - a;
}

// 处理特殊字符
export function filterStr(str) {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
  let specialStr = '';
  for (let i = 0; i < str.length; i++) {
    specialStr += str.substr(i, 1).replace(pattern, '');
  }
  return specialStr;
}
// 首字母大写
export function replaceStr(str) {
  const reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
  return str.toLowerCase().replace(reg, (m) => {
    return m.toUpperCase();
  });
}
