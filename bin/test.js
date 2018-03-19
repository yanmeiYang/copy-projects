const { fromJS, Map } = require('immutable');

const data = [
  {
    id: 1,
    childs: [
      { id: 12 },
      { id: 13 },
      { id: 14 },
      { id: 15 },
      { id: 16 },
    ]
  }
];

const imd = fromJS(data);


// console.log('a is ', data);
// console.log('a is ', imd);

const imdc = imd.setIn([0, "childs", { id: 13 }, "id"], 888);

console.log('a is ', imdc);
