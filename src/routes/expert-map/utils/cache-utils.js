import { listPersonByIds } from 'services/person';
import * as profileUtils from 'utils/profile-utils';

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

const requestDataNow = (ids, callback) => {
  const info = ifAllInCache(ids);
  if (info.length === 0) { //有没有缓存的
    const resultPromise = listPersonByIds(ids);
    resultPromise.then(
      (data) => {
        //加入到缓存中
        for (const p of data.data.persons) {
          dataCache[p.id] = p;
        }
        for (let i = 0; i < ids.length; i += 1) {
          indexCache.push(ids[i]);
          const personInfo = dataCache[ids[i]];
          const url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 90);
          const image2 = new Image();
          image2.src = url;
          image2.name = personInfo.id;//不能使用id,否则重复
          image2.width = 90;
          image2.onerror = () => {
            image2.src = blankAvatar;
          };
          imageCache[personInfo.id] = image2;
        }
        if (typeof (callback) === 'function') {
          callback();
        }
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
    });
  } else {
    const imgInfo = UnCachedImg(ids);
    if (imgInfo !== 0) {
      for (let i = 0; i < imgInfo.length; i += 1) {
        const personInfo = dataCache[imgInfo[i]];
        const url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 90);
        const image2 = new Image();
        image2.src = url;
        image2.name = personInfo.id;//不能使用id,否则重复
        image2.width = 90;
        image2.onerror = () => {
          image2.src = blankAvatar;
        };
        imageCache[personInfo.id] = image2;
      }
    }
    if (typeof (callback) === 'function') {
      callback();
    }
  }
};

const copyImage = (imageId, divId, size) => {
  const doc = document.getElementsByName(divId); //必定会有两个
  for (const d of doc) { //插入图像
    const image = deepCopyImage(imageId, size); //注意，copyImage在使用的时候必定是缓存了的
    d.innerHTML = '';
    d.appendChild(image);
  }
};

const UnCachedImg = (ids) => { //判断一串作者ids是否全部缓存了的
  const info = [];
  for (const id of ids) {
    if (id !== '') { //非空
      if (typeof (imageCache[id]) === 'undefined') { //不包含的记录下来
        info.push(id);
      }
    }
  }
  return info;
};

const ifAllInCache = (ids) => { //判断一串作者ids是否全部缓存了的
  let info = [];
  for (const id of ids) {
    if (id !== '') { //非空
      if (!indexCache.includes(id)) { //只要有不包含的就全部去找
        info = [];
        break;
      } else {
        info.push(dataCache[id]);
      }
    }
  }
  return info;
};

const cacheImage = (size) => { //一般用来缓存160图像
  for (const ic of indexCache) {
    const p = dataCache[ic];
    const url = profileUtils.getAvatar(p.avatar, p.id, size);
    const img = new Image();
    img.src = url;
    img.name = p.id;//不能使用id,否则重复
    img.width = size;
    img.onerror = () => {
      img.src = blankAvatar;
    };
    if (size === 160) {
      bigImageCache[p.id] = img;
    } else {
      imageCache[p.id] = img;
    }
  }
};

//0的时候不缓存，1的时候缓存信息，2的时候缓存信息和90头像，3的时候缓存信息和90、160头像
const checkCacheLevel = (level, ids) => {
  switch (level) {
    case 0:
      console.log('Nothing cached');
      break;
    case 1:
      onlyCacheInfo(ids);
      break;
    case 2:
      cacheInfo(ids);
      break;
    case 3:
      cacheInfo(ids);
      cacheImage(ids, 160);
      break;
    default:
      console.log('Wait for configuring!');
  }
};

const onlyCacheInfo = (ids) => { // 缓存基本信息
  const idsneeded = [];
  for (const id of ids) {
    if (!indexCache.includes(id)) { //现在的id还没有被缓存
      idsneeded.push(id);
    }
  }
  if (idsneeded.length === 0) { //没有数据的时候不去缓存
    return true;
  }
  const resultPromise = [];
  let count = 0;
  for (let i = 0; i < idsneeded.length; i += 100) { // 可控制cache的数目
    const cids = idsneeded.slice(i, i + 100);
    resultPromise[count] = listPersonByIds(cids);
    count += 1;
  }
  resultPromise.map((r) => {
    r.then((data) => {
      for (const p of data.data.persons) {
        dataCache[p.id] = p;
        indexCache.push(p.id); //将id存到里面
      }
    });
    return true;
  });
};

const cacheInfo = (ids) => { // 缓存基本信息
  /*
  如果有的时候不缓存
   */
  const idsneeded = [];
  for (const id of ids) {
    if (!indexCache.includes(id)) { //现在的id还没有被缓存
      idsneeded.push(id);
    }
  }
  if (idsneeded.length === 0) { //没有数据的时候不去缓存
    return true;
  }
  const resultPromise = [];
  let count = 0;
  let count1 = 0;
  for (let i = 0; i < idsneeded.length; i += 100) { // 可控制cache的数目
    const cids = idsneeded.slice(i, i + 100);
    resultPromise[count] = listPersonByIds(cids);
    count += 1;
  }
  resultPromise.map((r) => {
    r.then((data) => {
      for (const p of data.data.persons) {
        dataCache[p.id] = p;
        indexCache.push(p.id); //将id存到里面
        //缓存图片
        const url = profileUtils.getAvatar(p.avatar, p.id, 90);
        const img = new Image();
        img.src = url;
        img.name = p.id;//不能使用id,否则重复
        img.width = 90;
        img.onerror = () => {
          img.src = blankAvatar;
        };
        imageCache[p.id] = img;
      }
      count1 += 1;
      if (count === count1) {
        //cacheImage();
        console.log('cached in!');
      }
    });
    return true;
  });
};


//------------------------------------Data
const blankAvatar = '/images/blank_avatar.jpg';
const dataCache = [];
const imageCache = [];
const bigImageCache = [];
const indexCache = [];

module.exports = {
  dataCache,
  indexCache,
  imageCache,
  ifAllInCache,
  copyImage,
  cacheInfo,
  cacheImage,
  onlyCacheInfo,
  checkCacheLevel,
  requestDataNow,
};
