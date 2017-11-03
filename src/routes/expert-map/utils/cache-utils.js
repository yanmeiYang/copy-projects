
const copyImage = (imageId, divId, size) => { //图像深度拷贝
  let img = imageCache[imageId];
  console.log(img);
  const image = new Image(); //进行深拷贝
  if (typeof (img) === 'undefined') {
    img = imageCache[imageId];
    img.width = size;
  }
  image.src = img.src;
  image.name = img.name;
  image.width = img.width;

  document.getElementById(divId).appendChild(image);
}

const cacheInfo = (ids, listPersonByIds, profileUtils) => { // 缓存基本信息
  const resultPromise = [];
  let count = 0;
  let count1 = 0;
  for (let i = 0; i < ids.length; i += 100) { // 可控制cache的数目
    const cids = ids.slice(i, i + 100);
    resultPromise[count] = listPersonByIds(cids);
    count += 1;
  }
  resultPromise.map((r) => {
    r.then((data) => {
      for (const p of data.data.persons) {
        dataCache[p.id] = p;
        const url = profileUtils.getAvatar(p.avatar, p.id, 50);
        const img = new Image();
        img.src = url;
        img.name = p.id;//不能使用id,否则重复
        img.width = 50;
        img.onerror = () => {
          img.src = blankAvatar;
        };
        imageCache[p.id] = img;
      }
      count1 += 1;
      if (count === count1) {
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

module.exports = {
  dataCache,
  imageCache,
  copyImage,
  cacheInfo,
};
