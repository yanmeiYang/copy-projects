/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './ExpertHeatmap.less';
import { wget } from '../../utils/request';
// import echarts from 'echarts';
// import world from 'echarts/map/js/world';
import mapData from '../../../external-docs/expert-trajectory/testData.json';
// import heatData from '../../../external-docs/expert-trajectory/heatData.json';
import { Slider, Layout, InputNumber, Row, Col, Icon, Button, message } from 'antd';
// import expert

const { Content, Sider } = Layout;
let startYear;
let endYear;
let location;
let table;
let authors;
let option2 = {};
let author = {};
let author2 = {};
let authorImg = {};
let mapinterval;

// const authorImage = heatData.authorImage;
const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
const jietang = 'am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90';
// const myChart2 = echarts.init(document.getElementById('world'));
let play = false;
let yearNow;
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    inputValue: startYear,
    ifPlay: 'play-circle',
    startYear: '1978',
    endYear: '2016',
  };

  componentDidMount() {
    this.getHeatmapData();
    this.seriesNo = false;
    this.type = '';
    this.personList = '';
    this.myChart2 = echarts.init(document.getElementById('heatmap'));

  }

  onAfterChange = (value) => {
    // if (value === startYear) {
    //   this.onChange(value);
    // }
  }

  getHeatmapData = () => {
    // let startYear;
    let heatData;
    if (!heatData) {
      const pms = wget('/lab/heatData.json');
      console.log("okay",pms)
      pms.then((data) => {
        heatData = data;
        this.setState({startYear:heatData.startYear, endYear: heatData.endYear});
        location = heatData.locations;
        table = heatData.table;
        authors = heatData.authors;
        this.playon = startYear;
        this.setHeatmap(); // 热力图
        // this.authorImage = heatData.authorImage;
        console.log("hhhh",this.table);

        // return interestsData;
      }).catch((error) => {
        localStorage.removeItem(LSKEY_INTERESTS);
        return undefined;
      });
    }
  }

  onDbChange = (value) => {
  }

  onChange = (value) => { // 点击滑动条或数字框
    this.setState({
      inputValue: value,
    });
    // if (this.seriesNo === true) {
    //   option2.series.pop();
    //   this.seriesNo = false;
    //   this.myChart2.setOption(option2, true);
    // }
    this.playon = value;
    // console.log('value', value, this.playon);
    yearNow = this.playon;
    const index = value - startYear;
    // console.log('index', index);
    const data = [];
    const nextYearData = [];
    const geoCoordMap = this.doHeatGeoMap();

    const merge = {};
    const nextYear = {};
    author = {};
    author2 = {};
    authorImg = {};
    for (let aid = 0; aid < table.length; aid += 1) {
      const addressID = table[aid][index];
      if (addressID) {
        if (!merge[addressID]) {
          merge[addressID] = 0;
        }
        merge[addressID] += 1;

        if (!author[addressID]) {
          author[addressID] = [];
        }
        author[addressID].push(authors[aid]);

        // if (authorImage[aid] !== 0) {
        //   if (table[aid][index] in authorImg) { // 取今年各地点的作者id
        //     authorImg[table[aid][index]].push(authorImage[aid]);
        //   } else {
        //     authorImg[table[aid][index]] = [];
        //     authorImg[table[aid][index]].push(authorImage[aid]);
        //   }
        // }

        // console.log('image', authorImg);
        // console.log('author', author);
      }

      // 第二年数据
      if (index < (endYear - startYear)) {
        const addressID2 = table[aid][index + 1];
        if (addressID2) {
          if (!nextYear[addressID2]) {
            nextYear[addressID2] = 0;
          }
          nextYear[addressID2] += 1;
        }

        if (!author2[addressID2]) {
          author2[addressID2] = [];
        }
        author2[addressID2].push(authors[aid]);
      }
    }

    for (const key in merge) {
      // console.log('key', key);
      const onenode = { name: key, value: merge[key] }; // 实际数据中乘20应删去！
      data.push(onenode);
    }

    if (index < (endYear - startYear)) {
      for (const key in nextYear) {
        // console.log('key', key);
        const onenode = { name: key, value: nextYear[key] }; // 实际数据中乘20应删去！
        nextYearData.push(onenode);
      }
    }
    // console.log('nextYear Data', nextYearData);
    option2.series = this.getHeatSeries(geoCoordMap, data, 0, false, index, nextYearData);
    this.myChart2.setOption(option2, true);
  }


  onClick=() => { // 点击热力图按钮
    if (!play) {
      play = true;
      this.setState({ ifPlay: 'pause' });
    } else {
      play = false;
      this.setState({ ifPlay: 'play-circle' });
    }
    yearNow = this.playon;
    // console.log('playon', this.playon, yearNow);
    this.onChange(this.playon);
    // this.setState({
    //   inputValue: this.playon,
    // });
    // this.onButtoon(this.playon);
    if (play) {
      mapinterval = setInterval(() => {
        if (play && this.playon < endYear) {
          this.playon += 1;
          yearNow = this.playon;
          this.onChange(this.playon);
          // this.setState({
          //   inputValue: this.playon,
          // });
          // this.onButtoon(this.playon);
        } else {
          if (this.playon >= endYear) {
            // console.log('daole');
            this.playon = startYear;
            play = false;
            this.setState({ ifPlay: 'play-circle' });
          }
          clearInterval(mapinterval);
        }
      }, 11000);
    } else {
      clearInterval(mapinterval);
    }
  }


  onButtoon = (value) => { // 按下热力图的播放按钮
    // console.log('value', value);
    const index = value - startYear;
    const data = [];
    const nextYearData = [];
    let geoCoordMap = {};

    geoCoordMap = this.doHeatGeoMap();
    const merge = {};
    const merge2 = {};
    const nextYear = {};
    author = {};
    author2 = {};
    for (const temp of table) { // 计算当年该地点学者数
      if (temp[index] !== 0) {
        if (temp[index] in merge) {
          merge[temp[index]] += 1;
        } else {
          merge[temp[index]] = 1;
        }
      }

      if ((index - 1) >= 0 && temp[index - 1] !== 0) { // 计算去年各地点人数
        // console.log("*******")
        if (temp[index - 1] in merge2) {
          merge2[temp[index - 1]] += 1;
        } else {
          merge2[temp[index - 1]] = 1;
        }
      }
    }

    for (let aid = 0; aid < table.length; i += 1) {
      if (index < (endYear - startYear)) {
        if (table[aid][index + 1] !== 0) {
          if (!(table[aid][index + 1] in nextYear)) {
            nextYear[table[aid][index + 1]] = 1;
          }
        }
      }
    }

    const piece = 7; // 每隔一年插入20个变化人数时间段
    for (const key in merge) {
      let middle;
      if (key in merge2) {
        middle = (merge[key] - merge2[key]) / (piece + 1); // 插入渐变值
      } else {
        middle = (merge[key] - 0) / (piece + 1);
      }
      const onenode = { name: key, value: [merge[key], middle] }; // 实际数据中乘20应删去
      data.push(onenode);
    }

    for (const key in merge2) { // 去年有今年没有的
      let middle;
      if (!(key in merge)) {
        middle = (0 - merge2[key]) / (piece + 1);
        // middle = (merge2[key]-0) / (piece + 1);
        const onenode = { name: key, value: [0, middle] };
        data.push(onenode);
      }
    }

    if (index < (endYear - startYear)) {
      for (const key in nextYear) {
        // console.log('key', key);
        const onenode = { name: key, value: nextYear[key] }; // 实际数据中乘20应删去！
        nextYearData.push(onenode);
      }
    }

    for (let j = 0; j < (piece + 2); j += 1) {
      setTimeout(() => { // 每隔0.2秒刷新一次，每隔4秒换一年
        option2.series = this.getHeatSeries(geoCoordMap, data, (piece + 1 - j), true, index, nextYearData);
        this.myChart2.setOption(option2);
      }, j * 400);
    }
  }

  onInputNum = (value) => { // 数字框输入年份
    this.setState({
      inputValue: value,
    });
    this.onChange(value);
  }

  getDownPlay = (params) => {
    this.myChart2.dispatchAction({
      type: 'downplay',
      seriesIndex: [0, 1, 2],
      name: (`${params.name[0]}`),
    });
    this.myChart2.dispatchAction({
      type: 'downplay',
      seriesIndex: [0, 1, 2],
      name: (`${params.name[1]}`),
    });
  }

  getHighLight = (params) => {
    this.myChart2.dispatchAction({
      type: 'highlight',
      seriesIndex: [0, 1, 2],
      name: (`${params.name[0]}`),
    });
    this.myChart2.dispatchAction({
      type: 'highlight',
      seriesIndex: [0, 1, 2],
      name: (`${params.name[1]}`),
    });
    // this.myChart2.dispatchAction({
    //   type: 'showTip',
    //   // 系列的 index，在 tooltip 的 trigger 为 axis 的时候可选。
    //   seriesIndex: 0,
    //   // 可选，数据名称，在有 dataIndex 的时候忽略
    //   name: (`${params.name[0]}`),
    //   position: [123,41],
    // })
    // this.myChart2.dispatchAction({
    //   type: 'showTip',
    //   // 系列的 index，在 tooltip 的 trigger 为 axis 的时候可选。
    //   seriesIndex: 0,
    //   // 可选，数据名称，在有 dataIndex 的时候忽略
    //   name: (`${params.name[1]}`),
    //   position: [110,41],
    // })
  }


  setHeatmap = () => { // 设置热力图参数
    option2 = {
      backgroundColor: '#abc1db',
      title: {
        text: '历年学者热力图',
        subtext: 'data from aminer',
        left: 'center',
        textStyle: {
          color: '#404040',
        },
        subtextStyle: {
          color: '#5a5a5a',
        },
      },
      visualMap: {
        min: 0,
        max: 120,
        // splitNumber: 5,
        type: 'continuous',
        // seriesIndex: 0,
        inRange: {
          color: ['#eb3323', '#EC5428', '#F19436', '#F8D247', '#eeee4f', '#cbfa50', '#00a854'].reverse(),
          // color: ['#eb3323','#EC5428','#F19436','#F8D247','#eeee4f','#108ee9','#0c60aa'].reverse(),
        },
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        orient: 'vertical',
        y: 'bottom',
        x: 'right',
        data: ['location'],
        textStyle: {
          color: '#fff',
        },
      },
      geo: {
        zoom: 1.2,
        map: 'world',
        label: {
          emphasis: {
            show: true,
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#f5f3f0',
            borderColor: '#91a0ae',
          },
        },
      },
    };
    this.myChart2.setOption(option2);
    this.myChart2.on('mouseover', (params) => {
      if (params.componentType === 'series') {
        if (params.componentSubType === 'lines') {
          this.getHighLight(params);
        }
      }
    });
    this.myChart2.on('mouseout', (params) => {
      if (params.componentType === 'series') {
        if (params.componentSubType === 'lines') {
          this.getDownPlay(params);
        }
      }
    });
    this.myChart2.on('click', (params) => {
      // console.log('parames', params);
      if (params.componentType === 'series') {
        // if (params.seriesIndex < 2) {
        if (this.seriesNo === true) {
          // console.log('!null', params.seriesIndex);
          if (option2.series.length - 1 !== params.seriesIndex) {
            // console.log('ddqerqrq', option2.series);
            option2.series.pop();
            // console.log('ddqerqrq2', option2.series);
            this.seriesNo = true;
            if (params.componentSubType === 'scatter') {
              // console.log('yiyiyiyiyiyiyiyiyi', option2.series);
              // option2.series.pop();
              // console.log('yoyoyoyoyo', option2.series);
              // this.seriesNo = true;
              option2.series.push(
                {
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  zlevel: 2,
                  // rippleEffect: {
                  //   period: 4,
                  //   scale: 2,
                  //   brushType: 'stroke',
                  // },
                  animation: false,
                  label: {
                    normal: {
                      show: true,
                      formatter: this.getNum(params.value[2]),
                      position: 'inside',
                      color: '#fff',
                      textStyle: {
                        fontSize: 10,
                      },
                    },
                    emphasis: {
                      show: true,
                    },
                  },
                  tooltip: {
                    show: false,
                  },
                  itemStyle: {
                    normal: {
                      color: '#ff2c37',
                      borderColor: '#ff2f31',
                    },
                    emphasis: {
                      show: false,
                    },
                  },
                  data: [{
                    value: params.value,
                  }],
                  symbolSize(val) {
                    if (val[2] !== 1) {
                      return (10 + val[2] / 4);
                    } else {
                      return ((10 + val[2] / 4) / 2);
                    }
                  },
                },
              );
              this.type = 'scatter';
              if (params.seriesName === 'nextYear') {
                this.personList = author2[params.name];
              } else {
                this.personList = author[params.name];
              }
              this.myChart2.setOption(option2);
            } else if (params.componentSubType === 'lines') {
              // console.log('yoyoyoyoyo');
              option2.series.push({
                type: 'lines',
                // zlevel: 1,
                // effect: {
                //   show: true,
                //   period: 6,
                //   trailLength: 0,
                //   color: '#ff2f31',
                //   symbol: planePath,
                //   symbolSize: 4,
                //   animation: true,
                // },
                animation: false,
                symbol: planePath,
                symbolSize: 4,
                lineStyle: {
                  normal: {
                    color: '#ff2f31',
                    width: 2,
                    opacity: 1,
                    curveness: 0.2,
                  },
                },
                data: [{ coords: [params.data.coords[0], params.data.coords[1]] }],
              });
              this.type = 'lines';
              this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
              this.myChart2.setOption(option2, true);
              // this.getHighLight(params);
            }
          } else {
            option2.series.pop();
            this.seriesNo = false;
            this.myChart2.setOption(option2, true);
          }
        } else {
          this.seriesNo = true;
          if (params.componentSubType === 'scatter') {
            option2.series.push(
              {
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                animation: false,
                // rippleEffect: {
                //   period: 4,
                //   scale: 2,
                //   brushType: 'stroke',
                // },
                label: {
                  normal: {
                    show: true,
                    formatter: this.getNum(params.value[2]),
                    position: 'inside',
                    color: '#fff',
                    textStyle: {
                      fontSize: 10,
                    },
                  },
                  emphasis: {
                    show: true,
                  },
                },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: '#ff2f31',
                    borderColor: '#ff2f31',
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                  },
                },
                data: [{
                  value: params.value,
                }],
                symbolSize(val) {
                  if (val[2] !== 1) {
                    return (10 + val[2] / 4);
                  } else {
                    return ((10 + val[2] / 4) / 2);
                  }
                },
              },
            );
            this.type = 'scatter';
            if (params.seriesName === 'nextYear') {
              this.personList = author2[params.name];
            } else {
              this.personList = author[params.name];
            }
            this.myChart2.setOption(option2);
            // console.log('begin', option2.series);
          } else if (params.componentSubType === 'lines') {
            option2.series.push({
              type: 'lines',
              // zlevel: 2,
              // effect: {
              //   show: true,
              //   period: 6,
              //   trailLength: 0,
              //   color: '#ff2f31',
              //   symbol: planePath,
              //   symbolSize: 4,
              //   animation: true,
              // },
              animation: false,
              symbol: planePath,
              symbolSize: 4,
              lineStyle: {
                normal: {
                  color: '#ff2f31',
                  width: 2,
                  opacity: 1,
                  curveness: 0.2,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowBlur: 10,
                },
              },
              data: [{ coords: [params.data.coords[0], params.data.coords[1]] }],
            });
            this.type = 'lines';
            this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
            this.myChart2.setOption(option2);
            // this.getHighLight(params);
            // console.log('seriesNo', this.seriesNo);
          }
        }
        // } else if (params.seriesIndex === 3) {
        //   this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
        //   console.log("3332343242",_.intersection(author[params.name[0]], author2[params.name[1]]))
        //   console.log('param2222', params);
        // }
      }
    });

    this.myChart2.on('dblclick', (params) => {
      option2.geo.zoom += 0.1;
      this.myChart2.setOption(option2);
    });
  }


  doHeatGeoMap=() => { // 存储经纬度 geoCoordMap = {123:[116,40]}
    const geoCoordMap = {};

    for (let i = 1; i < location.length; i += 1) {
      geoCoordMap[i] = location[i];
    }
    // console.log('geo', geoCoordMap);
    return geoCoordMap;
  }


  getNum = (value) => {
    let temp;
    if (value > 1) {
      temp = Math.round(value);
    } else {
      temp = '';
    }
    return temp;
  }

  getHeatSeries = (geoCoordMap, data, j, choose, year, nextYearData) => { // j是一年中第几个插值
    // console.log('nextYearData', nextYearData);
    // console.log('data', data);
    // console.log('image2', authorImg);
    // console.log('jjjjj', j);

    const convertData2 = function (data) {
      const res = [];
      for (let i = 0; i < data.length; i += 1) {
        const geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push(geoCoord.concat(data[i].value));
        }
      }
      return res;
    };

    const convertData = function (datas, counter, ifSingle) { // 画出热力图上的圈并标出地名
      const res = [];
      for (let i = 0; i < datas.length; i += 1) {
        const geoCoord = geoCoordMap[datas[i].name];
        if (geoCoord) {
          if (choose !== false) {
            res.push({
              name: datas[i].name,
              value: geoCoord.concat(datas[i].value[0] - (datas[i].value[1] * counter)),
            });
          } else {
            if (ifSingle === true) {
              if (datas[i].value === 1) {
                res.push({
                  name: datas[i].name,
                  value: geoCoord.concat(datas[i].value),
                });
              }
            } else if (datas[i].value !== 1) {
              res.push({
                name: datas[i].name,
                value: geoCoord.concat(datas[i].value),
              });
            }

            // res.push(geoCoord.concat(data[i].value));
          }
        }
      }
      // console.log('res', res);
      return res;
    };

    function formtGCData() { // 画线
      const dup = {};
      const tGeoDt = [];
      const index = table.length;
      for (let j = 0; j < index; j += 1) {
        const add = table[j][year];
        const add2 = table[j][year + 1];
        if (add && add2) {
          const key = [add, add2].join('_');
          const v = dup[key];
          if (!v) {
            tGeoDt.push({
              name: [add, add2],
              coords: [geoCoordMap[add], geoCoordMap[add2]],
            });
            dup[key] = true;
          }
        }
      }
      return tGeoDt;
    }

    function getImage() {
      const temp = [];
      const index = authorImg.length;
      Object.keys(authorImg).map((key) => {
        for (let j = 0; j < key.length; j += 1) {
          temp.push({
            name: 'Author',
            coord: geoCoordMap[key[j]],
            symbol: `image://https://${authorImg[(key[0])]}`,
            symbolSize: [32, 40],
            symbolOffset: [0, '-70%'],
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 5,
              },
            },
          });
        }
      });

      return temp;
    }

    const series = [
      {
        name: 'TOP 5',
        // type: 'effectScatter',
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          period: 4,
          scale: 2,
          brushType: 'stroke',
        },
        label: {
          normal: {
            show: true,
            formatter: params => this.getNum(params.value[2]),
            position: 'inside',
            color: '#111',
            textStyle: {
              fontSize: 10,
            },
          },
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            color: '#f78e3d',
            // borderColor: '#f78e3d',
            opacity: 0.7,
          },
          emphasis: {
            color: '#ff2f31',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        tooltip: {
          confine: true,
          formatter: (params) => {
            return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">${
              params.seriesName
              }</div>${
              params.name}：${params.value[2]}<br>`;
          },
        },
        data: convertData(data.sort((a, b) => {
          return b.value - a.value;
        }).slice(0, 6), j, false),
        symbolSize(val) {
          return ((10 + val[2] / 4));
        },
      },
      { // 当年所有地点
        name: 'location',
        type: 'scatter',
        zlevel: 1,
        coordinateSystem: 'geo',
        data: convertData(data, j, false),
        symbolSize(val) {
          // if (val[2] !== 1) {
          //   return (10 + val[2] / 8);
          // } else {
          //   return ((10 + val[2] / 4) / 2);
          // }
          return ((10 + val[2] / 4));
        },
        label: {
          normal: {
            show: true,
            formatter: params => this.getNum(params.value[2]),
            position: 'inside',
            color: '#111',
            textStyle: {
              fontSize: 10,
            },
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: '#FFBA00',
            opacity: 1,
          },
          emphasis: {
            color: '#ff2f31',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        // markPoint: {
        //   z:5,
        //   symbol: 'rect',
        //   symbolSize: [40,60],
        //   color: '#fff',
        //   // symbolOffset:[0,'-70%'],
        //   label: {
        //     normal: {
        //       show: false,
        //     },
        //     emphasis: {
        //       show: false,
        //     },
        //   },
        //   itemStyle: {
        //     normal: {
        //       borderColor: '#fff',
        //       borderWidth: 10,
        //     },
        //   },
        //   data:getImage(),
        // },
        tooltip: {
          confine: true,
          formatter: (params) => {
            return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">${
              params.seriesName
              }</div>${
              params.name}：${params.value[2]}<br>`;
          },
        },
      },

      { // 当年所有单点
        name: 'location',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data, j, true),
        symbolSize: 4,
        label: {
          normal: {
            show: true,
            formatter: params => this.getNum(params.value[2]),
            position: 'inside',
            color: '#111',
            textStyle: {
              fontSize: 10,
            },
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: '#FFBA00',
            opacity: 1,
          },
          emphasis: {
            color: '#ff2f31',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        tooltip: {
          confine: true,
          formatter: (params) => {
            return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">${
              params.seriesName
              }</div>${
              params.name}：${params.value[2]}<br>`;
          },
        },
      },

      // { // 下一年所有地点
      //   name: 'nextYear',
      //   type: 'scatter',
      //   coordinateSystem: 'geo',
      //   data: convertData(nextYearData, j),
      //   symbolSize: 6.5,
      //   label: {
      //     normal: {
      //       // formatter: '{b}',
      //       // position: 'right',
      //       // show: true,
      //       show: false,
      //     },
      //   },
      //   itemStyle: {
      //     normal: {
      //       opacity: 1,
      //       color: '#ffee66',
      //       // borderColor:'#fe9b46',
      //     },
      //     emphasis: {
      //       color: '#ff2f31',
      //       shadowBlur: 10,
      //       shadowOffsetX: 0,
      //       shadowColor: 'rgba(0, 0, 0, 0.5)',
      //     },
      //   },
      // },
      {
        type: 'lines',
        animationDuration: 10,
        // zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0,
          // color: '#f78e3d',
          symbol: 'arrow',
          symbolSize: 3,
          animation: false,
        },
        // symbol: planePath,
        // symbol: 'arrow',
        // symbol: 'image://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
        symbolSize: 3,
        lineStyle: {
          normal: {
            color: '#f78e3d',
            width: 0.4,
            opacity: 0.7,
            curveness: 0.2,
          },
          emphasis: {
            color: '#ff2f31',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
          },
        },
        tooltip: {
          confine: true,
          formatter: (params) => {
            return `Number of people: ${(_.intersection(author[params.name[0]], author2[params.name[1]])).length}`;
          },
        },
        data: formtGCData(),
      },

      // {
      //   name: 'image',
      //   type: 'scatter',
      //   zlevel: 2,
      //   coordinateSystem: 'geo',
      //   markPoint: {
      //     z: 5,
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
      //   },
      // },

      {
        name: 'AQI',
        type: 'heatmap',
        coordinateSystem: 'geo',
        blurSize: 20,
        zlevel: 2,
        data: convertData(data, j),
      },

      // {
      //   name: 'image',
      //   // type: 'effectScatter',
      //   type: 'scatter',
      //   coordinateSystem: 'geo',
      //   label: {
      //     normal: {
      //       show: false,
      //     },
      //     emphasis: {
      //       show: false,
      //     },
      //   },
      //   animation: false,
      //   // animationDuration:1000,
      //   zlevel: 2,
      //   // z: 4,
      //   markPoint: {
      //     symbol: 'rect',
      //     symbolSize: [40,60],
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
      //         borderWidth: 5,
      //       },
      //     },
      //     data:getImage(),
      //   },
      //   itemStyle: {
      //     normal: {
      //       opacity:0,
      //     },
      //   },
      //   symbolSize:0,
      //   data: convertData(data, j),
      // },

    ];

    return series;
  }

  plusHeatZoom = () => {
    option2.geo.zoom += 0.1;
    this.myChart2.setOption(option2);
  }

  minusHeatZoom = () => {
    option2.geo.zoom -= 0.1;
    this.myChart2.setOption(option2);
  }

  onMapClick = () => {
    if (this.props.onPageClick) {
      this.props.onPageClick(this.personList, this.type);
    }
  }

  render() {
    const ifPlay = this.state.ifPlay;
    return (
      <div>
        {/*<div className={styles.heat} id="heatmap" style={{ height: '1630px', width: '3500px' }} onClick={this.onMapClick} />*/}
        <div className={styles.heat} id="heatmap" style={{ height: '670px', width: '1200px' }} onClick={this.onMapClick} />
        <div>
          <Button className={styles.plus} type="primary" ghost icon="plus" onClick={this.plusHeatZoom} />
        </div>
        <div>
          <Button className={styles.minus} type="primary" ghost icon="minus" onClick={this.minusHeatZoom} />
        </div>

        <div className={styles.two} id="showYear">
          <h1> {yearNow}</h1>
        </div>


        <Row>
          <Col span={22}>
            <Slider min={startYear} max={endYear} onChange={this.onChange} onAfterChange={this.onAfterChange}value={this.state.inputValue} />
            {/* <Slider min={startYear} max={endYear} range step={1} defaultValue={[1999, 1999]} onChange={this.onDbChange} /> */}
          </Col>
          <Col span={1}>
            <InputNumber
              min={startYear}
              max={endYear}
              style={{ marginLeft: 0 }}
              value={this.state.inputValue}
              onChange={this.onInputNum}
            />
          </Col>
        </Row>

        <div>
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
        </div>
      </div>
    );
  }
}

export default ExpertHeatmap;


