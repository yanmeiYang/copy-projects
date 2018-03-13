/**
 * Created by ranyanchuan on 2018/3/13.
 */


export const menuData = [
  "1.||||||||||||||", "2.||||||||||||||", "3.||||||||||||||", "4.||||||||||||||", "5.||||||||||||||",
  "6.||||||||||||||", "7.||||||||||||||", "8.||||||||||||||", "9.||||||||||||||", "10.|||||||||||||",
];

export const weekSubscribeData = [
  {key: '1', all: 4000, add: 320, active: 30, cancel: 10, date: '2018-03-10'},
  {key: '2', all: 4200, add: 420, active: 40, cancel: 4, date: '2018-03-05'},
  {key: '3', all: 4300, add: 320, active: 50, cancel: 20, date: '2018-03-01'},
  {key: '4', all: 4440, add: 320, active: 30, cancel: 3, date: '2018-02-25'},
  {key: '5', all: 4500, add: 420, active: 40, cancel: 30, date: '2018-02-20'},
  {key: '6', all: 4630, add: 320, active: 50, cancel: 10, date: '2018-02-15'},
  {key: '7', all: 4650, add: 320, active: 30, cancel: 3, date: '2018-02-10'},
];

export const daySubscribeData = [
  {key: '1', all: 4000, add: 32, active: 3, cancel: 3, date: '2018-03-10'},
  {key: '2', all: 5000, add: 42, active: 4, cancel: 4, date: '2018-03-11'},
  {key: '3', all: 6000, add: 32, active: 5, cancel: 5, date: '2018-03-12'},
  {key: '4', all: 4000, add: 32, active: 3, cancel: 3, date: '2018-03-10'},
  {key: '5', all: 5000, add: 42, active: 4, cancel: 4, date: '2018-03-11'},
  {key: '6', all: 6000, add: 32, active: 5, cancel: 5, date: '2018-03-12'},
  {key: '7', all: 4000, add: 32, active: 3, cancel: 3, date: '2018-03-10'},
];


export const weekLineData = {
  date: ['2018-02-10', '2018-02-15', '2018-02-20', '2018-02-25', '2018-03-01', '2018-03-05', '2018-03-10'],
  data: [
    {
      name: '新增用户',
      type: 'line',
      data: [320, 420, 320, 320, 420, 320, 320]
    },
    {
      name: '主动订阅',
      type: 'line',
      data: [220, 182, 191, 234, 290, 230, 310]
    },
    {
      name: '退订用户',
      type: 'line',
      data: [150, 232, 201, 154, 190, 130, 410]
    },
    {
      name: '订阅用户',
      type: 'line',
      data: [4000, 4200, 4300, 4440, 4500, 4630, 4650]
    }
  ]
};


export const dayLineData = {
  date: ['2018-03-04', '2018-03-05', '2018-03-06', '2018-03-07', '2018-03-08', '2018-03-09', '2018-03-10'],
  data: [
    {
      name: '新增用户',
      type: 'line',
      data: [32, 42, 32, 32, 42, 32, 32]
    },
    {
      name: '主动订阅',
      type: 'line',
      data: [22, 18, 19, 23, 29, 23, 31]
    },
    {
      name: '退订用户',
      type: 'line',
      data: [15, 23, 20, 15, 19, 13, 1]
    },
    {
      name: '订阅用户',
      type: 'line',
      data: [4320, 4390, 4440, 4580, 4610, 4630, 4650]
    }
  ]
};

export function emailListData() {
  const emailData = [];
  for (let i = 0; i < 100; i++) {
    emailData.push({
      key: i,
      email: 'jery.tang@gmail.com',
      aid: '53f46a3edabfaee43ed05f08',
      attr: '主动',
      status: '正常',
      name: `jie tang ${i}`,
      pushNum: i,
      openNum: i,
      aff: '清华大学',
      position: '副教授',
      keyword: "Data Mining,Social Network",
      origin: "扫码",
      bookDate: "2018-02-01",
      cancelDate: "2018-03-08",
    });
  }
  return emailData;
}
