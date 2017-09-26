// 头像定时消失的函数 加在getSeries里
// const getImage = () => {
//   console.log('==============================');
//   const temp = [];
//   if (this.ifButton) {
//     const timeNow = new Date().getTime();
//     // const index = authorImg.length;
//     Object.keys(authorImg).map((key) => { // key是地名
//       // console.log("key1111",key)
//       imageData[key] = [];
//       imageData[key][0] = authorImg[key];
//       imageData[key][1] = timeNow;
//       // console.log("imageData1 ",imageData);
//       // console.log("timeNow",timeNow)
//       // console.log("---------",timeNow - imageData[key][1]);
//     });
//
//     Object.keys(imageData).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
//       if (timeNow - imageData[key][1] >= 5000) {
//         // console.log("delete", key)
//         delete imageData[key];
//         // console.log("imageData2 ",imageData);
//       } else {
//         temp.push({
//           name: 'Author',
//           coord: geoCoordMap[key],
//           symbol: `image://https://${imageData[key][0]}`,
//           // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
//           symbolSize: [32, 40],
//           symbolOffset: [0, '-70%'],
//           label: {
//             normal: {
//               show: false,
//             },
//             emphasis: {
//               show: false,
//             },
//           },
//           itemStyle: {
//             normal: {
//               borderColor: '#fff',
//               borderWidth: 5,
//             },
//           },
//         });
//       }
//     });
//   } else {
//     Object.keys(authorImg).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
//       temp.push({
//         name: 'Author',
//         coord: [-180,40],
//         // coord: [-180,50],
//         // coord: geoCoordMap[key],
//         symbol: `image://https://${authorImg[key]}`,
//         // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
//         symbolSize: [32, 40],
//         symbolOffset: [0, '-70%'],
//         label: {
//           normal: {
//             show: false,
//           },
//           emphasis: {
//             show: false,
//           },
//         },
//         itemStyle: {
//           normal: {
//             borderColor: '#fff',
//             borderWidth: 5,
//           },
//         },
//       });
//     });
//   }
//
//
//   return temp;
// };

//画头像到地点的连线 和 画头像
// const lineToImage = () => { // 从头像到地点的连线
//   const temp = [];
//   let west = 0;
//   let middle = 0;
//   let east = 0;
//   // console.log('--------', authorImgWest);
//   Object.keys(authorImgWest).map((key) => {
//     if (west < 5) {
//       const middleLat = ((parseFloat(geoCoordMap[key][0]) - parseFloat(imagePosWest[west][0])) * 0.764) + parseFloat(imagePosWest[west][0]);
//       temp.push({
//         coords: [imagePosWest[west], [middleLat, imagePosWest[west][1]]],
//       });
//       temp.push({
//         coords: [[middleLat, imagePosWest[west][1]], geoCoordMap[key]],
//       });
//       west += 1;
//     }
//   });
//   Object.keys(authorImgMid).map((key) => {
//     if (middle < 4) {
//       const middleLat = ((parseFloat(geoCoordMap[key][0]) - parseFloat(imagePosMid[middle][0])) * 0.764) + parseFloat(imagePosMid[middle][0]);
//       const middleLng = ((parseFloat(geoCoordMap[key][1]) - parseFloat(imagePosWest[middle][1])) * 0.764) + parseFloat(imagePosWest[middle][1]);
//       temp.push({
//         coords: [[imagePosMid[middle][0], (imagePosMid[middle][1] + 12)], [middleLat, middleLng]],
//       });
//       temp.push({
//         coords: [[middleLat, middleLng], geoCoordMap[key]],
//       });
//       middle += 1;
//     }
//   });
//   Object.keys(authorImgEast).map((key) => {
//     if (east < 4) {
//       const middleLat = parseFloat(imagePosEast[east][0]) - ((parseFloat(imagePosEast[east][0]) - parseFloat(geoCoordMap[key][0])) * 0.764);
//       const middleLng = parseFloat(imagePosEast[east][1]) - ((parseFloat(imagePosEast[east][1]) - parseFloat(geoCoordMap[key][1])) * 0.764);
//       temp.push({
//         coords: [[imagePosEast[east][0], (imagePosEast[east][1] + 2)], [middleLat, imagePosEast[east][1]]],
//       });
//       temp.push({
//         coords: [[middleLat, imagePosEast[east][1]], geoCoordMap[key]],
//       });
//       east += 1;
//     }
//   });
//   return temp;
// };
//
// const getImage = () => { // 获得头像
//   const temp = [];
//   let west = 0;
//   let middle = 0;
//   let east = 0;
//   // console.log('authorImgwest', authorImgEast);
//   Object.keys(authorImgWest).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
//     if (west < 5) {
//       temp.push({
//         name: 'Author',
//         coord: imagePosWest[west],
//         symbol: `image://https://${authorImgWest[key][0]}`,
//         // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
//         symbolSize: [32, 40],
//         symbolOffset: [0, '-50%'],
//         label: {
//           normal: {
//             show: false,
//           },
//           emphasis: {
//             show: false,
//           },
//         },
//         itemStyle: {
//           normal: {
//             borderColor: '#fff',
//             borderWidth: 5,
//           },
//         },
//       });
//       west += 1;
//     }
//   });
//   Object.keys(authorImgMid).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
//     if (middle < 4) {
//       temp.push({
//         name: 'Author',
//         coord: imagePosMid[middle],
//         symbol: `image://https://${authorImgMid[key][0]}`,
//         // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
//         symbolSize: [32, 40],
//         symbolOffset: [0, '-70%'],
//         label: {
//           normal: {
//             show: false,
//           },
//           emphasis: {
//             show: false,
//           },
//         },
//         itemStyle: {
//           normal: {
//             borderColor: '#fff',
//             borderWidth: 5,
//           },
//         },
//       });
//       middle += 1;
//     }
//   });
//   Object.keys(authorImgEast).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
//     if (east < 4) {
//       temp.push({
//         name: 'Author',
//         coord: imagePosEast[east],
//         symbol: `image://https://${authorImgEast[key][0]}`,
//         // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
//         symbolSize: [32, 40],
//         symbolOffset: [0, '-70%'],
//         label: {
//           normal: {
//             show: false,
//           },
//           emphasis: {
//             show: false,
//           },
//         },
//         itemStyle: {
//           normal: {
//             borderColor: '#fff',
//             borderWidth: 5,
//           },
//         },
//       });
//       east += 1;
//     }
//   });
//   console.log('temp2', temp);
//   return temp;
// };

// 头像和地点的连线 和 头像 的series
// {
//   name: 'image',
//   type: 'scatter',
//   zlevel: 4,
//   z: 1,
//   coordinateSystem: 'geo',
//   markPoint: {
//     // zlevel:6,
//     // z: 7,
//     symbol: 'rect',
//     symbolSize: [40, 60],
//     color: '#fff',
//     // symbolOffset:[0,'-70%'],
//     label: {
//       normal: {
//         show: false,
//       },
//       emphasis: {
//         show: false,
//       },
//     },
//     itemStyle: {
//       normal: {
//         borderColor: '#fff',
//         borderWidth: 10,
//       },
//     },
//     data: getImage(),
//     animation: true,
//   },
//   // data: [{value: [123,40,100]}],
//   // symbolSize(val){
//   //   return val[2];
//   // }
// },
//
// {
//   type: 'lines',
//   large: this.ifLarge,
//   largeThreshold: 400,
//   // animation: true,
//   // animationDuration: 0,
//   zlevel: 3,
//   symbol: ['', ''],
//   symbolSize: 3,
//   lineStyle: {
//     normal: {
//       color: themes[this.state.theme].line2Color,
//       // width: 10,
//       width: 1.6,
//       opacity: 0.7,
//       curveness: 0,
//       shadowColor: 'rgba(198, 198, 198, 0.3)',
//       shadowBlur: 10,
//     },
//   },
//   data: lineToImage(),
//   animation: false,
//   // animationThreshold: 1000000,
//   blendMode: themes[this.state.theme].line2BlendMode, // lighter
// },

//加入插值的播放
// onButtoon = (value) => { // 按下热力图的播放按钮
//   // console.log('value', value);
//   const index = value - this.state.startYear;
//   const data = [];
//   const nextYearData = [];
//   let geoCoordMap = {};
//
//   geoCoordMap = this.doHeatGeoMap();
//   const merge = {};
//   const merge2 = {};
//   const nextYear = {};
//   author = {};
//   author2 = {};
//   for (const temp of table) { // 计算当年该地点学者数
//     if (temp[index] !== 0) {
//       if (temp[index] in merge) {
//         merge[temp[index]] += 1;
//       } else {
//         merge[temp[index]] = 1;
//       }
//     }
//
//     if ((index - 1) >= 0 && temp[index - 1] !== 0) { // 计算去年各地点人数
//       // console.log("*******")
//       if (temp[index - 1] in merge2) {
//         merge2[temp[index - 1]] += 1;
//       } else {
//         merge2[temp[index - 1]] = 1;
//       }
//     }
//   }
//
//   for (let aid = 0; aid < table.length; i += 1) {
//     if (index < (this.state.endYear - this.state.startYear)) {
//       if (table[aid][index + 1] !== 0) {
//         if (!(table[aid][index + 1] in nextYear)) {
//           nextYear[table[aid][index + 1]] = 1;
//         }
//       }
//     }
//   }
//
//   const piece = 7; // 每隔一年插入20个变化人数时间段
//   for (const key in merge) {
//     let middle;
//     if (key in merge2) {
//       middle = (merge[key] - merge2[key]) / (piece + 1); // 插入渐变值
//     } else {
//       middle = (merge[key] - 0) / (piece + 1);
//     }
//     const onenode = { name: key, value: [merge[key], middle] }; // 实际数据中乘20应删去
//     data.push(onenode);
//   }
//
//   for (const key in merge2) { // 去年有今年没有的
//     let middle;
//     if (!(key in merge)) {
//       middle = (0 - merge2[key]) / (piece + 1);
//       // middle = (merge2[key]-0) / (piece + 1);
//       const onenode = { name: key, value: [0, middle] };
//       data.push(onenode);
//     }
//   }
//
//   if (index < (this.state.endYear - this.state.startYear)) {
//     for (const key in nextYear) {
//       // console.log('key', key);
//       const onenode = { name: key, value: nextYear[key] }; // 实际数据中乘20应删去！
//       nextYearData.push(onenode);
//     }
//   }
//
//   for (let j = 0; j < (piece + 2); j += 1) {
//     setTimeout(() => { // 每隔0.2秒刷新一次，每隔4秒换一年
//       option2.series = this.getHeatSeries(geoCoordMap, data, (piece + 1 - j), true, index, nextYearData);
//       this.myChart2.setOption(option2);
//     }, j * 400);
//   }
// }

// 地图高亮联动参数
// legend: {
//   orient: 'vertical',
//   y: 'bottom',
//   x: 'right',
//   data: ['location'],
//   textStyle: {
//     color: '#fff',
//   },
// },
