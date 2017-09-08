/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './ExpertHeatmap.less';
import { wget } from '../../utils/request';
import '../../../external-docs/echarts/map/js/world';
// import echarts from '../../../external-docs/echarts';
// import echarts from '../../../external-docs/echarts/lib/echarts';
// import heatmap from '../../../external-docs/echarts/lib/chart/heatmap';
// import '../../../external-docs/echarts/lib/chart/lines';
// // import '../../../external-docs/echarts/lib/coord/geo/Geo';
// import '../../../external-docs/echarts/lib/coord/geo/GeoModel';
// import scatter from '../../../external-docs/echarts/lib/chart/scatter';
// import VisualMap from '../../../external-docs/echarts/lib/component/visualMap';
import { queryURL } from '../../utils';
// import world from 'echarts/map/js/world';
import echarts from 'echarts/lib/echarts';
import { Slider, Layout, InputNumber, Row, Col, Icon, Button, message } from 'antd';
// import expert

const dims = {
  time: 0,
  windSpeed: 1,
  R: 2,
  waveHeight: 3,
  weatherIcon: 2,
  minTemp: 3,
  maxTemp: 4,
};

const { Content, Sider } = Layout;
let startYear;
let endYear;
let option2 = {};
let author = {};
let author2 = {};
let authorImg = {};
let authorImage = [];
let mapinterval;
let location = [];
let table = [];
let authors;
const imageData = {};
const themes = {
  dark: {
    textColor: '#deded7',
    subtextColor: '#eeeeee',
    backgroundColor: '#404a59',
    areaColor: '#323c48',
    borderColor: '#565656',
    lineColor: '#5c95f7',
    visualColor: ['#d2eafb', '#7ec2f3', '#49a9ee', '#108ee9', '#0c60aa', '#0c60aa'].reverse(),
    labelColor: '#fff',
    pointBlendMode: 'lighter',
    lineBlendMode: 'screen',
    symbolColor: '#5c95f7',
  },
  light: {
    textColor: '#404040',
    subtextColor: '#5a5a5a',
    backgroundColor: '#abc1db',
    areaColor: '#f5f3f0',
    borderColor: '#91a0ae',
    lineColor: '#f78e3d',
    // visualColor: ['#fff','#FDFFB5','#fff72f','#ffce3d','#F19436','#EC5428'].reverse(),
    visualColor: ['#eb3323', '#F19436', '#F8D247', '#eeee4f', '#cbfa50', '#00a854'].reverse(),
    labelColor: '#111',
    pointBlendMode: '',
    lineBlendMode: '',
    symbolColor: '#f3f49f',
  },
};

const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
const jietang = 'am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90';
// const myChart2 = echarts.init(document.getElementById('world'));
let play = false;
let yearNow;

@connect()
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    inputValue: startYear,
    ifPlay: 'play-circle',
    startYear: 1978,
    endYear: 2016,
    theme: 'light',
  };

  componentWillMount() {
    const theme = (queryURL('theme'));
    if (theme) {
      this.setState({ theme });
    }
  }

  componentDidMount() {
    // console.log('iamge', authorImg);
    this.seriesNo = false;
    this.type = '';
    this.personList = '';
    this.ifLarge = false;
    this.ifButton = false;
    this.myChart2 = echarts.init(document.getElementById('heatmap'));
    this.getHeatmapData(); // 热力图
  }

  getHeatmapData = () => {
    // let startYear;
    let heatData;
    if (!heatData) {
      const pms = wget('/lab/heatData.json');
      pms.then((data) => {
        heatData = data;
        this.setState({ startYear: heatData.startYear, endYear: heatData.endYear });
        // startYear = heatData.startYear;
        // endYear = heatData.endYear;
        location = heatData.locations;
        table = heatData.table;
        authors = heatData.authors;
        authorImage = heatData.authorImage;

        this.playon = this.state.startYear;
        this.setHeatmap(); // 热力图
        this.getMouseEvent();
        // this.authorImage = heatData.authorImage;

        // return interestsData;
      }).catch((error) => {
        localStorage.removeItem(LSKEY_INTERESTS);
        return undefined;
      });
    }
  }

  onThemeChangeDark = () => {
    this.setState({ theme: 'dark' }, () => {
      window.location.href = 'expert-heatmap?theme=dark';
    });
  }

  onThemeChangeLight = () => {
    this.setState({ theme: 'light' }, () => {
      window.location.href = 'expert-heatmap?theme=light';
    });
  }

  getMouseEvent = () => { // 高亮和取消高亮
    if (!this.ifLarge) {
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
    } else {
      this.myChart2.off('mouseover');
      this.myChart2.off('mouseout');
    }
  }

  onAfterChange = (value) => {
    // if (value === startYear) {
    //   this.onChange(value);
    // }
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
    const index = value - this.state.startYear;
    // console.log('index', index);
    const data = [];
    const nextYearData = [];
    const geoCoordMap = this.doHeatGeoMap();

    const merge = {};
    const nextYear = {};
    author = {};
    author2 = {};
    authorImg = {};
    // console.log("authorImage",authorImage)
    const starttime = new Date().getTime();
    console.log("onChange start time", starttime)
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

        if (authorImage[aid]) {
          // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&")
          if (table[aid][index] in authorImg) { // 取今年各地点的作者id
            authorImg[table[aid][index]].push(authorImage[aid]);
          } else {
            authorImg[table[aid][index]] = [];
            authorImg[table[aid][index]].push(authorImage[aid]);
          }
        }
      }


      // 第二年数据
      if (index < (this.state.endYear - this.state.startYear)) {
        const addressID2 = table[aid][index + 1];
        if (addressID2 && !merge[addressID2]) {
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
    // console.log('image2234343', authorImg);

    for (const key in merge) {
      // console.log('key', key);
      const onenode = { name: key, value: merge[key] }; // 实际数据中乘20应删去！
      data.push(onenode);
    }

    if (index < (this.state.endYear - this.state.startYear)) {
      for (const key in nextYear) {
        // console.log('key', key);
        const onenode = { name: key, value: nextYear[key] }; // 实际数据中乘20应删去！
        nextYearData.push(onenode);
      }
    }

    // console.log("data",data)
    data.sort(this.sortValue);
    nextYearData.sort(this.sortValue)
    let data1 = [];
    let p;
    // console.log('datasp', datas[0]);
    // console.log(datas[0].value);
    if(data.length > 10){
      for (p = 0; data[p].value > 1 && p < 100; p += 1) {
        data1.push(data[p]);
      }
    } else {
      data1 = data;
    }
    const data2 = data.slice(p);
    // console.log('nextYear Data', nextYearData);
    // this.myChart2.on('georoam', function (params) {
    //   console.log("jijijdf",params);
    //   option2.geo.zoom = (params.originX)/352;
    //   // option2.geo.zoom = params.zoom;
    // });
    option2.series = this.getHeatSeries(geoCoordMap, data, 0, false, index, nextYearData,data1,data2);
    // console.log(JSON.stringify(option2, null, 4));
    this.myChart2.setOption(option2, true);
    console.log("end time", (new Date().getTime() - starttime)+"ms");
  }


  onClick=() => { // 点击热力图按钮
    if (!play) {
      play = true;
      this.ifLarge = true;
      this.ifButton = true;
      this.getMouseEvent();
      this.setState({ ifPlay: 'pause' });
    } else {
      play = false;
      this.ifLarge = false;
      this.ifButton = false;
      this.getMouseEvent();
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
        if (play && this.playon < this.state.endYear) {
          this.playon += 1;
          yearNow = this.playon;
          this.onChange(this.playon);
          // this.setState({
          //   inputValue: this.playon,
          // });
          // this.onButtoon(this.playon);
        } else {
          if (this.playon >= this.state.endYear) {
            // console.log('daole');
            this.playon = this.state.startYear;
            play = false;
            this.setState({ ifPlay: 'play-circle' });
          }
          clearInterval(mapinterval);
        }
      }, 6600);
    } else {
      clearInterval(mapinterval);
    }
  }


  onButtoon = (value) => { // 按下热力图的播放按钮
    // console.log('value', value);
    const index = value - this.state.startYear;
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
      if (index < (this.state.endYear - this.state.startYear)) {
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

    if (index < (this.state.endYear - this.state.startYear)) {
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
    // console.log('hh-------------------------');
    option2 = {
      // backgroundColor: '#abc1db',
      backgroundColor: themes[this.state.theme].backgroundColor,
      title: {
        text: '历年学者热力图',
        subtext: 'Data From Aminer',
        left: 'center',
        textStyle: {
          color: themes[this.state.theme].textColor,
        },
        subtextStyle: {
          color: themes[this.state.theme].subtextColor,
        },
      },
      visualMap: {
        min: 0,
        max: 200,
        // splitNumber: 5,
        type: 'continuous',
        // seriesIndex: 0,
        inRange: {
          // color: ['#eb3323', '#EC5428', '#F19436', '#F8D247', '#eeee4f', '#cbfa50', '#00a854'].reverse(),
          color: themes[this.state.theme].visualColor,
        },
        textStyle: {
          color: '#fff',
        },
      },
      // animation: true,
      // animationThreshold:1000000,
      progressive: 1000,
      // hoverLayerThreshold: 2000,
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
            // areaColor: '#f5f3f0',
            borderColor: themes[this.state.theme].borderColor,
            areaColor: themes[this.state.theme].areaColor,
          },
        },
      },
    };

    this.myChart2.setOption(option2);

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
              if (params.seriesName === 'nextYear') {
                this.personList = author2[params.name];
              } else {
                this.personList = author[params.name];
              }
              // console.log('yiyiyiyiyiyiyiyiyi', option2.series);
              // option2.series.pop();
              // console.log('yoyoyoyoyo', option2.series);
              // this.seriesNo = true;
              option2.series.push(
                {
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  zlevel: 3,
                  z: 6,
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
                      color: themes[this.state.theme].labelColor,
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
                  },
                  data: [{
                    value: params.value,
                  }],
                  symbolSize(val) {
                    const size = 10 + val[2] / 4;
                    if (val[2] !== 1) {
                      if (size > 25) {
                        return (26);
                      } else {
                        return (size);
                      }
                    } else {
                      return ((10 + val[2] / 4) / 2);
                    }
                  },
                },
              );
              this.type = 'scatter';
              this.myChart2.setOption(option2, true);
            } else if (params.componentSubType === 'lines') {
              this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
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
              this.myChart2.setOption(option2, true);
              // const a = {
              //   type: 'lines',
              //   // zlevel: 2,
              //   // effect: {
              //   //   show: true,
              //   //   period: 6,
              //   //   trailLength: 0,
              //   //   color: '#ff2f31',
              //   //   symbol: planePath,
              //   //   symbolSize: 4,
              //   //   animation: true,
              //   // },
              //   animation: false,
              //   symbol: planePath,
              //   symbolSize: 4,
              //   lineStyle: {
              //     normal: {
              //       color: '#ff2f31',
              //       width: 2,
              //       opacity: 1,
              //       curveness: 0.2,
              //       shadowColor: 'rgba(0, 0, 0, 0.5)',
              //       shadowBlur: 10,
              //     },
              //   },
              //   data: [{ coords: [params.data.coords[0], params.data.coords[1]] }],
              // };
              // this.type = 'lines';
              // // this.myChart2.setOption(option2, true);
              // this.myChart2.setOption({series: a});
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
            if (params.seriesName === 'nextYear') {
              this.personList = author2[params.name];
            } else {
              this.personList = author[params.name];
            }
            option2.series.push(
              {
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                z: 6,
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
                    color: themes[this.state.theme].labelColor,
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
                  const size = 10 + val[2] / 4;
                  if (val[2] !== 1) {
                    if (size > 25) {
                      return (26);
                    } else {
                      return (size);
                    }
                  } else {
                    return ((10 + val[2] / 4) / 2);
                  }
                },
              },
            );
            this.type = 'scatter';
            this.myChart2.setOption(option2, true);
            // console.log('begin', option2.series);
          } else if (params.componentSubType === 'lines') {
            this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
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
            // const a = {
            //   type: 'lines',
            //   // zlevel: 2,
            //   // effect: {
            //   //   show: true,
            //   //   period: 6,
            //   //   trailLength: 0,
            //   //   color: '#ff2f31',
            //   //   symbol: planePath,
            //   //   symbolSize: 4,
            //   //   animation: true,
            //   // },
            //   animation: false,
            //   symbol: planePath,
            //   symbolSize: 4,
            //   lineStyle: {
            //     normal: {
            //       color: '#ff2f31',
            //       width: 2,
            //       opacity: 1,
            //       curveness: 0.2,
            //       shadowColor: 'rgba(0, 0, 0, 0.5)',
            //       shadowBlur: 10,
            //     },
            //   },
            //   data: [{ coords: [params.data.coords[0], params.data.coords[1]] }],
            // };
            this.type = 'lines';
            this.myChart2.setOption(option2, true);
            // this.myChart2.setOption({series: a});
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

  sortValue = (a, b) => {
    return b.value - a.value;
  };

  getHeatSeries = (geoCoordMap, data, j, choose, year, nextYearData, data1, data2) => { // j是一年中第几个插值 ifButton是否为播放模式
    console.log('nextYearData', nextYearData);
    // console.log('data', data);
    // console.log('image2', authorImg);
    // console.log('jjjjj', j);
    const arrowSize = 18;

    const convertData2 = function (datas) {
      const res = [];
      for (let i = 0; i < datas.length; i += 1) {
        const geoCoord = geoCoordMap[datas[i].name];
        if (geoCoord) {
          res.push({
            value: geoCoord.concat(datas[i].value)
          });
        }
      }
      return res;
    };

    const convertData = function (datas) { // 画出热力图上的圈并标出地名
      const res = [];
      for (let i = 0; i < datas.length; i += 1) {
        const geoCoord = geoCoordMap[datas[i].name];
        if (geoCoord) {
          res.push({
            name: datas[i].name,
            value: geoCoord.concat(datas[i].value),
          });
        }
      }
      return res;
    };

    function formtGCData() { // 画线
      const dup = {};
      let tGeoDt = [];
      const tempArray = [];
      const index = table.length;
      // for (let j = 0; j < index; j += 1) {
      //   const add = table[j][year];
      //   const add2 = table[j][year + 1];
      //   if (add && add2 && (add !== add2)) {
      //     const key = [add, add2].join('_');
      //     const v = dup[key];
      //     if (!v) {
      //       tGeoDt.push({
      //         name: [add, add2],
      //         coords: [geoCoordMap[add], geoCoordMap[add2]],
      //         // coords:[[123,41],[123,41]],
      //       });
      //       dup[key] = true;
      //     }
      //   }
      // }
      for (let j = 0; j < index; j += 1) {
        const add = table[j][year];
        const add2 = table[j][year + 1];
        const start = geoCoordMap[add];
        const end = geoCoordMap[add2];
        if (add && add2 && (add !== add2)) {
          if ((Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])) > 50) {
            const key = [add, add2].join('_');
            const v = dup[key];
            if (!v) {
              dup[key] = {};
              dup[key].name = [add, add2];
              dup[key].coords = [start, end];
              dup[key].count = 0;
            }
          }
        }
      }

      Object.keys(dup).map((key) => {
        tempArray.push(dup[key]);
      });
      tempArray.sort(sortCount);
      tGeoDt = tempArray.slice(0, 100);
      return tGeoDt;
    }

    const sortCount = (a, b) => {
      return b.count - a.count;
    };

    const getImage = () => {
      console.log('==============================');
      const temp = [];
      if (this.ifButton) {
        const timeNow = new Date().getTime();
        // const index = authorImg.length;
        Object.keys(authorImg).map((key) => { // key是地名
          // console.log("key1111",key)
          imageData[key] = [];
          imageData[key][0] = authorImg[key];
          imageData[key][1] = timeNow;
          // console.log("imageData1 ",imageData);
          // console.log("timeNow",timeNow)
          // console.log("---------",timeNow - imageData[key][1]);
        });

        Object.keys(imageData).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
          if (timeNow - imageData[key][1] >= 5000) {
            // console.log("delete", key)
            delete imageData[key];
            // console.log("imageData2 ",imageData);
          } else {
            temp.push({
              name: 'Author',
              coord: geoCoordMap[key],
              symbol: `image://https://${imageData[key][0]}`,
              // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
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
      } else {
        Object.keys(authorImg).map((key) => { // Object.keys(authorImg)是key 用authorImage.key取值
          temp.push({
            name: 'Author',
            coord: geoCoordMap[key],
            symbol: `image://https://${authorImg[key]}`,
            // symbol: 'image://https://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
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
        });
      }


      return temp;
    };

    function getArrow() {
      const curveness = 1;
      const res = [];
      const firstYearX = parseFloat(geoCoordMap[14][0]);
      const firstYearY = parseFloat(geoCoordMap[14][1]);
      const secondYearX = parseFloat(geoCoordMap[30000][0]);
      const secondYearY = parseFloat(geoCoordMap[30000][1]);
      // console.log("h-------------------================",geoCoordMap[14][0]);
      // console.log(geoCoordMap[41710][0]);
      // console.log()
      res.push(
        {
          // value: [ (firstYearX+secondYearX)/2 - (firstYearY - secondYearY)* curveness,
          //   (firstYearY + secondYearY)/2 - (firstYearX - secondYearX)* curveness,
          // ],
          value: [(firstYearX + secondYearX) / 2 + (firstYearY - secondYearY) * curveness,
            (firstYearY + secondYearY) / 2 - (secondYearY - firstYearY) * curveness,
          ],
          // value:[280.837, 179.626],
        },
      );
      // console.log("res",res)
      return res;

      // const dup = {};
      // const tGeoDt = [];
      // const index = table.length;
      // for (let j = 0; j < index; j += 1) {
      //   const add = table[j][year];
      //   // console.log("add",add,add2)
      //   const add2 = table[j][year + 1];
      //   // console.log("---------------------------",geoCoordMap[add])
      //   if (add && add2 && (add !== add2)) {
      //     const firstYearX = parseFloat(geoCoordMap[add][0]);
      //     const firstYearY = parseFloat(geoCoordMap[add][1]);
      //     const secondYearX = parseFloat(geoCoordMap[add2][0]);
      //     const secondYearY = parseFloat(geoCoordMap[add2][1])
      //     const key = [add, add2].join('_');
      //     const v = dup[key];
      //     if (!v) {
      //       tGeoDt.push({
      //         value: [ (firstYearX+secondYearX)/2- (firstYearY - secondYearY)* curveness,
      //           (firstYearY + secondYearY)/2 - (secondYearX - firstYearX)* curveness,
      //         ],
      //       });
      //       dup[key] = true;
      //     }
      //   }
      // }
      // return tGeoDt;
    }


    const series = [
      {
        name: 'TOP 6',
        // type: 'effectScatter',
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 3,
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
            color: themes[this.state.theme].labelColor,
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
            opacity: 0.8,
            shadowColor: 'rgba(198, 198, 198, 0.3)',
            shadowBlur: 10,
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
        data: convertData(data1.sort((a, b) => {
          return b.value - a.value;
        }).slice(0, 6)),
        symbolSize(val) {
          const size = 10 + val[2] / 4;
          if (size > 25) {
            return (26);
          } else {
            return (size);
          }
        },
        // blendMode: 'screen',
      },
      { // 当年所有地点
        name: 'location',
        type: 'scatter',
        zlevel: 2,
        coordinateSystem: 'geo',
        data: convertData(data1),
        symbolSize(val) {
          const size = 10 + val[2] / 4;
          if (size > 25) {
            return (26);
          } else {
            return (size);
          }
          // return ((10 + val[2] / 4));
        },
        label: {
          normal: {
            show: true,
            formatter: params => this.getNum(params.value[2]),
            position: 'inside',
            color: themes[this.state.theme].labelColor,
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
            shadowColor: 'rgba(198, 198, 198, 0.3)',
            shadowBlur: 10,
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
        blendMode: themes[this.state.theme].pointBlendMode,
      },

      { // 当年所有单点
        name: 'single location',
        type: 'scatter',
        large: true,
        largeThreshold: 1000,
        zlevel: 1,
        z: 6,
        coordinateSystem: 'geo',
        data: convertData(data2),
        // symbolSize: 4,
        symbolSize(val) {
          const size = 3 + val[2];
          return size;
        },
        label: {
          normal: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            color: '#00A854',
            opacity: 1,
            shadowColor: 'rgba(198, 198, 198, 0.3)',
            shadowBlur: 10,
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
        blendMode: themes[this.state.theme].pointBlendMode,
      },

      { // 下一年所有地点
        name: 'nextYear',
        type: 'scatter',
        large: true,
        largeThreshold: 1000,
        coordinateSystem: 'geo',
        data: convertData(nextYearData),
        // data: convertData2(nextYearData),
        symbolSize: 3,
        label: {
          normal: {
            // formatter: '{b}',
            // position: 'right',
            // show: true,
            show: false,
          },
        },
        itemStyle: {
          normal: {
            opacity: 1,
            color: '#ffee66',
            // borderColor:'#fe9b46',
          },
          emphasis: {
            color: '#ff2f31',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
      {
        type: 'lines',
        large: this.ifLarge,
        largeThreshold: 400,
        // animation: true,
        // animationDuration: 0,
        // zlevel: 1,
        effect: {
          show: true,
          period: 3,
          trailLength: 0,
          color: themes[this.state.theme].symbolColor,
          symbol: 'arrow',
          symbolSize: 5,
          animation: false,
          // animationThreshold:10000,
        },
        symbol: ['', planePath],
        // symbol: 'arrow',
        // symbol: 'image://am-cdn-s0.b0.upaiyun.com/picture/01823/Jie_Tang_1348889820664.jpg!90',
        symbolSize: 3,
        lineStyle: {
          normal: {
            color: themes[this.state.theme].lineColor,
            // width: 10,
            width: 1.6,
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
        // data: [
        //   {
        //     name: [1234, 41710],
        //     coords: [ geoCoordMap[14],geoCoordMap[30000]],
        //     // coords:[[123,41],[123,41]],
        //     value:10,
        //   },
        // ],
        animationThreshold: 1000000,
        blendMode: themes[this.state.theme].lineBlendMode, // screen
      },

      // {
      //   name: 'image',
      //   type: 'scatter',
      //   zlevel: 4,
      //   z: 6,
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
        z: 7,
        data: convertData(data),
        blendMode: 'hard-light', // multiple, color-dodge
      },

      // {
      //   type: 'custom',
      //   zlevel: 6,
      //   // data:[123,41],
      //   coordinateSystem: 'geo',
      //   renderItem(params, api) {
      //     // console.log('jajaja', api.value(), api.value(), api.value(0), api.value(1));
      //     // console.log('eeeeeee', params, api);
      //     const point = api.coord([api.value(0), api.value(1)]);
      //     // const point = [api.value(0), api.value(1)];
      //     // console.log('point', point);
      //
      //     const categoryIndex = api.value(0);
      //     const start = api.coord([api.value(1), categoryIndex]);
      //     const end = api.coord([api.value(2), categoryIndex]);
      //     const height = api.size([0, 1])[1] * 0.6;
      //
      //     return {
      //       type: 'path',
      //       shape: {
      //         pathData: planePath,
      //         x: -arrowSize / 2,
      //         y: -arrowSize / 2,
      //         width: arrowSize,
      //         height: arrowSize,
      //       },
      //       rotation: 0.2,
      //        position: point,
      //       style: api.style({
      //         // stroke: '#555',
      //         // lineWidth: 1
      //       }),
      //     };
      //   },
      //   itemStyle: {
      //     normal: {
      //       color: '#ff2c37',
      //     },
      //   },
      //   // encode: {
      //   //   x: dims.time,
      //   //   y: dims.windSpeed
      //   // },
      //   // data: data,
      //   // data: [{
      //   //   value: [120,30,200],
      //   // },{
      //   //   value: [100,30,200],
      //   // }],
      //   data: getArrow(),
      //   z: 10,
      // },

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
        <div className={styles.heat} id="heatmap" style={{ height: '670px', width: '1150px' }} onClick={this.onMapClick} />
        <div>
          <Button className={styles.plus} type="primary" ghost icon="plus" onClick={this.plusHeatZoom} />
        </div>
        <div>
          <Button className={styles.minus} type="primary" ghost icon="minus" onClick={this.minusHeatZoom} />
        </div>
        <div>
          <Button className={styles.light} type="primary" ghost onClick={this.onThemeChangeDark}>dark</Button>
        </div>
        <div>
          <Button className={styles.dark} type="primary" ghost onClick={this.onThemeChangeLight}>light</Button>
        </div>

        <div className={styles.two} style={{ color: '#f5f3f0', fontSize: '200px', fontWeight: '600' }} id="showYear">
          <h1> {yearNow}</h1>
        </div>


        <Row>
          <Col span={22}>
            <Slider min={this.state.startYear} max={this.state.endYear} onChange={this.onChange} onAfterChange={this.onAfterChange}value={this.state.inputValue} />
            {/* <Slider min={startYear} max={endYear} range step={1} defaultValue={[1999, 1999]} onChange={this.onDbChange} /> */}
          </Col>
          <Col span={1}>
            <InputNumber
              min={this.state.startYear}
              max={this.state.endYear}
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



