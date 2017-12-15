import { loadECharts, loadBMap } from 'utils/requirejs';
import { wget } from 'utils/request2';

//----------------------------------------datas
const color1 = ['#990033', '#CC6699', '#FF6699', '#FF3366', '#993366', '#CC0066', '#CC0033', '#FF0066', '#FF0033', '#CC3399', '#FF3399', '#FF9999', '#FF99CC', '#FF0099', '#CC3366', '#FF66CC', '#FF33CC', '#FFCCFF', '#FF99FF', '#FF00CC'];
const color2 = ['#FF66FF', '#CC33CC', '#CC00FF', '#FF33FF', '#CC99FF', '#9900CC', '#FF00FF', '#CC66FF', '#990099', '#CC0099', '#CC33FF', '#CC99CC', '#990066', '#993399', '#CC66CC', '#CC00CC', '#663366'];
const color3 = ['#660099', '#666FFF', '#000CCC', '#9933CC', '#666699', '#660066', '#333366', '#0066CC', '#9900FF', '#333399', '#99CCFF', '#9933FF', '#330099', '#6699FF', '#9966CC', '#3300CC', '#003366', '#330033', '#3300FF', '#6699CC', '#663399', '#3333FF', '#006699', '#6633CC', '#3333CC', '#3399CC', '#6600CC', '#0066FF', '#0099CC', '#9966FF', '#0033FF', '#66CCFF', '#330066', '#3366FF', '#3399FF', '#6600FF', '#3366CC', '#003399', '#6633FF', '#000066', '#0099FF', '#CCCCFF', '#000033', '#33CCFF', '#9999FF', '#0000FF', '#00CCFF', '#9999CC', '#000099', '#6666CC', '#0033CC'];
const color4 = ['#FFFFCC', '#FFCC00', '#CC9909', '#663300', '#FF6600', '#663333', '#CC6666', '#FF6666', '#FF0000', '#FFFF99', '#FFCC66', '#FF9900', '#FF9966', '#CC3300', '#996666', '#FFCCCC', '#660000', '#FF3300', '#FF6666', '#FFCC33', '#CC6600', '#FF6633', '#996633', '#CC9999', '#FF3333', '#990000', '#CC9966', '#FFFF33', '#CC9933', '#993300', '#FF9933', '#330000', '#993333', '#CC3333', '#CC0000', '#FFCC99', '#FFFF00', '#996600', '#CC6633'];
const color5 = ['#99FFFF', '#33CCCC', '#00CC99', '#99FF99', '#009966', '#33FF33', '#33FF00', '#99CC33', '#CCC333', '#66FFFF', '#66CCCC', '#66FFCC', '#66FF66', '#009933', '#00CC33', '#66FF00', '#336600', '#333000', '#33FFFF', '#339999', '#99FFCC', '#339933', '#33FF66', '#33CC33', '#99FF00', '#669900', '#666600', '#00FFFF', '#336666', '#00FF99', '#99CC99', '#00FF66', '#66FF33', '#66CC00', '#99CC00', '#999933', '#00CCCC', '#006666', '#339966', '#66FF99', '#CCFFCC', '#00FF00', '#00CC00', '#CCFF66', '#CCCC66', '#009999', '#003333', '#006633', '#33FF99', '#CCFF99', '#66CC33', '#33CC00', '#CCFF33', '#666633', '#669999', '#00FFCC', '#336633', '#33CC66', '#99FF66', '#006600', '#339900', '#CCFF00', '#999966', '#99CCCC', '#33FFCC', '#669966', '#00CC66', '#99FF33', '#003300', '#99CC66', '#999900', '#CCCC99', '#CCFFFF', '#33CC99', '#66CC66', '#66CC99', '#00FF33', '#009900', '#669900', '#669933', '#CCCC00'];
const color6 = ['#CCCCCC', '#999999', '#666666', '#333333', '#000000'];

const paperCache = [];
const infoCache = [];
const imageCache = [];
const blankAvatar = '/images/blank_avatar.jpg';

//-------------------------------------------functions
const cacheInfo = (domainId, callback) => {
  if (domainId !== 'aminer' && domainId !== '') {
    const dd = wget(`lab/trajectory/thinktanks/${domainId}.json`);
    dd.then((data) => {
      for (const y in data) {
        if (y) {
          const paper = data[y].paperInfo;
          const author = data[y].authorInfo;
          const img = new Image();
          img.src = author.avatar;
          img.name = author.id;//不能使用id,否则重复
          img.width = 90;
          img.onerror = () => {
            img.src = blankAvatar;
          };
          const { aid, pid } = data[y];
          infoCache[y] = { aid, pid };
          imageCache[author.id] = img;
          paperCache[paper.id] = paper.title;
        }
      }
      callback();
    });
  }
};

const getType = (obj) => {
  //tostring会返回对应不同的标签的构造函数
  const { toString } = Object.prototype;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};

const deepClone = (data) => {
  const type = getType(data);
  let obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i += 1) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (const key in data) {
      if (key) {
        obj[key] = deepClone(data[key]);
      }
    }
  }
  return obj;
};

const deepCopyImage = (imageId, size) => { //图像深度拷贝
  let img = imageCache[imageId];
  const image = new Image(); //进行深拷贝,
  if (typeof (img) === 'undefined') {
    img = imageCache[imageId];
    img.width = size;
  }
  image.src = img.src;
  image.name = img.name;
  image.width = img.width;
  return image;
};

const randomColor = (num) => { //选择不重复的颜色
  let color = [];
  let frequency = 0;
  while (color.length <= num) {
    if (color1.length >= frequency) {
      color.push(color1[frequency]);
    }
    if (color2.length >= frequency) {
      color.push(color2[frequency]);
    }
    if (color3.length >= frequency) {
      color.push(color3[frequency]);
    }
    if (color4.length >= frequency) {
      color.push(color4[frequency]);
    }
    if (color5.length >= frequency) {
      color.push(color5[frequency]);
    }
    if (color6.length >= frequency) {
      color.push(color6[frequency]);
    }
    frequency += 1;
  }
  color = color.slice(0, num);
  return color;
};

const loadEchartsWithBMap = (cb) => {
  loadBMap(() => {
    loadECharts((echarts) => {
      if (cb) {
        cb(echarts);
      }
    });
  });
};

const findBest = (id) => {
  const dd = wget(`lab/trajectory/thinktanks/${id}.json`);
  dd.then((data) => {
    return data;
  });
};

module.exports = {
  randomColor, loadEchartsWithBMap, findBest, deepCopyImage, cacheInfo,
  paperCache, infoCache, imageCache,
};
