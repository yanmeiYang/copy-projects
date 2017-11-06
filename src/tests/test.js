const {
  Map,
} = require('immutable');

let time1 = new Date();

const ldata = {};
for (let i = 0; i <= 100000; i += 1) {
  ldata[i] = i;
}

onsole.log('>>> TIME: calclate:', new Date() - time1);
time1 = new Date();

// change to immutable js

// method 1
const im = Map(ldata); // 2448
console.log('>>> TIME: translate1 ', new Date() - time1);
time1 = new Date();

// method 2
let im2 = Map();
for (let i = 0; i <= 100000; i += 1) {
  im2 = im2.set(i, i);
}
console.log('>>> TIME: translate2 ', new Date() - time1);
time1 = new Date();

// test merge
const im3 = im.merge(im2);
console.log('>>> TIME: merge ', new Date() - time1);
time1 = new Date();

// test batch modify.
let im4 = Map();
im4 = im4.withMutations((map) => {
  for (let i = 0; i <= 100000; i += 1) {
    map.set(i, i);
  }
});

console.log('>>> TIME: translate2 ', new Date() - time1);
time1 = new Date();

// print
// console.log(im);
// console.log(im2);
// console.log(im3);
console.log(im4);
// const map1 = Map({
//   a: 1,
//   b: 2,
//   c: 3,
// });
// const map2 = map1.set('b', 2);
// const map3 = map1.set('b', 50);

console.log('>>> TIME: ALL ', new Date() - time1);

export default class className {
  constructor() {
    this.super();
  }
};
