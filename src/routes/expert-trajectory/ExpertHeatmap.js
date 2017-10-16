/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts/lib/echarts';
import world from 'echarts/map/js/world';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import styles from './ExpertHeatmap.less';
import { wget } from '../../utils/request';
import { queryURL } from '../../utils';

let startYear;
let locationName;
let mapOption = {};
let author = {};
let author2 = {};
let mapinterval; // 播放的interval
let location;
let table = [];
let authors;
const centerBegin = [0,12];
let centerPixeBegin;
let roamNow;
let centerNow;
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
    line2Color: '#eeeeee',
    pointBlendMode: 'lighter',
    lineBlendMode: 'screen',
    lin2BlendMode: 'lighter',
    symbolColor: '#5c95f7',
  },
  light: {
    textColor: '#404040',
    subtextColor: '#5a5a5a',
    backgroundColor: '#abc1db',
    areaColor: '#f5f3f0',
    borderColor: '#91a0ae',
    lineColor: '#f78e3d',
    line2Color: '#5081d7',
    // visualColor: ['#fff','#FDFFB5','#fff72f','#ffce3d','#F19436','#EC5428'].reverse(),
    visualColor: ['#eb3323', '#F19436', '#F8D247', '#eeee4f', '#cbfa50', '#00a854'].reverse(),
    labelColor: '#111',
    planColor: '#2469fb',
    pointBlendMode: '',
    lineBlendMode: '',
    line2BlendMode: '',
    symbolColor: '#f3f49f',
  },
};

const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
let play = false;
let yearNow;

class ExpertHeatmap extends React.PureComponent { ///
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    inputValue: startYear,
    ifPlay: 'play-circle',
    startYear: 1978, // 1978,
    endYear: 2016, // 2016,
    theme: 'light',
    displayURL: [],
  };

  componentWillMount() {
    const theme = (queryURL('theme'));
    if (theme) {
      this.setState({ theme });
    }
  }

  componentDidMount() {
    this.seriesNo = false;
    this.type = '';
    this.personList = '';
    this.from = '';
    this.to = '';
    this.ifLarge = false;
    this.ifButton = false;
    this.myChart2 = echarts.init(document.getElementById('heatmap'));
    this.world = world;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.qquery !== this.props.qquery) {
      this.myChart2.clear();
      return true;
    }
    if (nextState.inputValue !== this.state.inputValue) {
      return true;
    }
    if (nextState.displayURL !== this.state.displayURL) {
      return true;
    }
    if (nextProps.expertTrajectory.location !== this.props.expertTrajectory.location) {
      this.setState({ startYear: nextProps.expertTrajectory.startYear,
        endYear: nextProps.expertTrajectory.endYear });
      authors = nextProps.expertTrajectory.authors;
      location = nextProps.expertTrajectory.location;
      table = nextProps.expertTrajectory.table;
      locationName = nextProps.expertTrajectory.locationName;
      this.playon = this.state.startYear;
      this.setHeatmap(); // 热力图
      this.getMouseEvent();
      return true;
    }
    if (nextState.ifPlay !== this.state.ifPlay) {
      return true;
    }
    return false;
  }

  onThemeChangeDark = () => { // 切换成dark模式
    this.setState({ theme: 'dark' }, () => {
      window.location.href = 'expert-heatmap?theme=dark';
    });
  }

  onThemeChangeLight = () => { // 切换成light模式
    this.setState({ theme: 'light' }, () => {
      window.location.href = 'expert-heatmap?theme=light';
    });
  }

  onChange = (value) => { // 点击滑动条或数字框，处理当年数据
    // const e = document.getElementById("pic");
    // e.innerHTML = '';
    if (this.props.yearChange) {
      this.props.yearChange(value);
    }
    this.setState({
      inputValue: value,
    });
    const geoBegin = this.myChart2.getOption();
    /////centerBegin = geoBegin[0].center;
    console.log('centerBegin22222', geoBegin);
    this.seriesNo = false;
    this.playon = value;
    yearNow = this.playon;
    this.props.dispatch({ type: 'expertTrajectory/getYearData', payload: { year: yearNow } }).then(() => {
      const thisYearEvent = this.props.expertTrajectory.yearMessage[this.props.expertTrajectory.yearMessage.length - 1];
      const display = [];
      thisYearEvent.events.map((oneEvent) => {
        if (oneEvent.type === 'expert') {
          // const authorIndex = authors.indexOf(oneEvent.authorID); // 正确
          const authorIndex = authors.indexOf(oneEvent.author); // 暂时
          const yearIndex = yearNow - this.state.startYear;
          const thisYearID = table[authorIndex][yearIndex];
          const latLng = location[thisYearID];
          const pixel = this.myChart2.convertToPixel('geo', latLng);
          const oneExpert = {};
          oneExpert.authorIndex = authorIndex;
          oneExpert.url = oneEvent.url;
          oneExpert.geo = latLng;
          oneExpert.pixel = pixel;
          display.push(oneExpert);
        }
      });
      this.setState({ displayURL: display });
      const thisYearData = this.props.expertTrajectory.eachYearHeat[yearNow];
      author = thisYearData.author;
      author2 = thisYearData.author2;
      mapOption.series = this.getHeatSeries(thisYearData.geoCoordMap, thisYearData.data,
        0, false, thisYearData.yearIndex, thisYearData.nextYearData, thisYearData.data1,
        thisYearData.data2, thisYearData.authorImgWest,
        thisYearData.authorImgMid, thisYearData.authorImgEast);
      this.calculateLocation();
      console.log("this.geo.center", this.myChart2.getModel().option.geo[0].center);
      this.myChart2.setOption(mapOption, true);
    });
  }

  onClick=() => { // 点击热力图按钮
    if (!play) {
      play = true;
      this.ifLarge = true; // 开启大规模优化
      this.ifButton = true; // 按钮是否按下
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
    this.onChange(this.playon);

    if (play) {
      mapinterval = setInterval(() => {
        if (play && this.playon < this.state.endYear) {
          this.playon += 1;
          yearNow = this.playon;
          this.onChange(this.playon);
        } else {
          if (this.playon >= this.state.endYear) {
            this.playon = this.state.startYear;
            play = false;
            this.setState({ ifPlay: 'play-circle' });
          }
          clearInterval(mapinterval);
        }
      }, 6800);
    } else {
      clearInterval(mapinterval);
    }
  }

  onInputNum = (value) => { // 数字框输入年份
    this.setState({
      inputValue: value,
    });
    this.onChange(value);
  }

  onMapClick = () => { // 地图点击事件 将信息传给Page
    if (this.props.onPageClick) {
      if (this.from !== '') {
        this.props.onPageClick(this.personList, locationName[this.from - 1].toLowerCase(),
          locationName[this.to - 1].toLowerCase(), this.type);
      } else {
        this.props.onPageClick(this.personList, '', '', this.type);
      }
    }
  }

  getHeatSeries = (geoCoordMap, data, j, choose, year,
                   nextYearData, data1, data2) => {
    // j是一年中第几个插值 ifButton是否为播放模式 choose是否插值 year当前年份 data1前100数据 西部 中部 东部头像数据
    const dup = {};
    const tempLineArray = [];
    const lineIndex = table.length;
    for (let k = 0; k < lineIndex; k += 1) {
      const addLine = table[k][year];
      const addLine2 = table[k][year + 1];
      const startLine = geoCoordMap[addLine];
      const endLine = geoCoordMap[addLine2];
      if (addLine && addLine2 && (addLine !== addLine2)) {
        if ((Math.abs(startLine[0] - endLine[0]) + Math.abs(startLine[1] - endLine[1])) > 50) {
          const key = [addLine, addLine2].join('_');
          const v = dup[key];
          if (!v) {
            dup[key] = {};
            dup[key].name = [addLine, addLine2];
            dup[key].coords = [startLine, endLine];
            dup[key].count = 0;
          }
        }
      }
    }

    Object.keys(dup).forEach((key) => {
      tempLineArray.push(dup[key]);
    });
    tempLineArray.sort(sortCount);

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

    function formtGCData(ifTop10) { // 画线
      const tGeoDt = tempLineArray.slice(10, 100);
      const tGeoDt2 = tempLineArray.slice(0, 10);
      if (ifTop10) {
        return tGeoDt2;
      } else {
        return tGeoDt;
      }
    }

    const sortCount = (a, b) => {
      return b.count - a.count;
    };

    const series = [
      {
        name: 'TOP 6', // 今年人数最多的前6个地方
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
            return `<div font-size: 11px;padding-bottom: 7px;margin-bottom: 7px">${
              locationName[parseInt(params.name, 10) - 1].toLowerCase()}<br>`;
          },
        },
        data: convertData(data1.sort((a, b) => {
          return b.value - a.value;
        }).slice(0, 6)),
        symbolSize(val) {
          const size = 10 + (val[2] / 4);
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
          const size = 10 + (val[2] / 4);
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
        tooltip: {
          confine: true,
          formatter: (params) => {
            return `<div font-size: 11px;padding-bottom: 7px;margin-bottom: 7px">${
              locationName[parseInt(params.name, 10) - 1].toLowerCase()}<br>`;
          },
        },
        blendMode: themes[this.state.theme].pointBlendMode,
      },

      { // 当年所有单点
        name: 'single location',
        type: 'scatter',
        // large: true,
        // largeThreshold: 1000,
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
            return `<div font-size: 11px;padding-bottom: 7px;margin-bottom: 7px">${
              locationName[parseInt(params.name, 10) - 1].toLowerCase()}<br>`;
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
      { // 所有迁移线
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
          symbolSize: 5, // 8,
          animation: false,
          // animationThreshold:10000,
        },
        symbol: ['', planePath],
        symbolSize: 3,
        lineStyle: {
          normal: {
            color: themes[this.state.theme].lineColor,
            width: 1.6, // 1.6,
            opacity: 1,
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
            return `<div style="font-size: 11px;padding-bottom: 7px;margin-bottom: 7px">Number of People: ${
              (_.intersection(author[params.name[0]], author2[params.name[1]])).length}<br/>From: ${
              locationName[params.name[0] - 1].toLowerCase()}<br/>To: ${locationName[params.name[1] - 1].toLowerCase()}<br>`;
          },
        },
        data: formtGCData(false),
        animation: false,
        blendMode: themes[this.state.theme].lineBlendMode, // screen
      },

      { // 人数最多的10条线
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
          color: themes[this.state.theme].planColor,
          symbol: planePath,
          symbolSize: 20, // 30,
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
            width: 1.6, // 1.6,
            opacity: 1,
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
            return `<div style="font-size: 11px;padding-bottom: 7px;margin-bottom: 7px">Number of People: ${
              (_.intersection(author[params.name[0]], author2[params.name[1]])).length}<br/>From: ${
              locationName[params.name[0] - 1].toLowerCase()}<br/>To: ${locationName[params.name[1] - 1].toLowerCase()}<br>`;
          },
        },
        data: formtGCData(true),
        animation: false,
        blendMode: themes[this.state.theme].lineBlendMode, // screen
      },

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
    ];
    return series;
  }

  getNum = (value) => { // 得到圈上的数字
    let temp;
    if (value > 1) {
      temp = Math.round(value);
    } else {
      temp = '';
    }
    return temp;
  }

  setHeatmap = () => { // 设置热力图参数
    mapOption = { // 地图基本参数
      backgroundColor: themes[this.state.theme].backgroundColor,
      title: {
        // text: '全球顶尖10000学者迁徙图',
        // subtext: 'Global Top 10000 experts career trajecory',
        left: 'center',
        textStyle: {
          color: themes[this.state.theme].textColor,
          // fontSize:40,
        },
        subtextStyle: {
          color: themes[this.state.theme].subtextColor,
          // fontSize:20,
        },
      },
      visualMap: {
        min: 0,
        max: 200,
        type: 'continuous',
        inRange: {
          color: themes[this.state.theme].visualColor,
        },
        textStyle: {
          color: '#fff',
        },
      },
      progressive: 1000,
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      text: ['200', '0'],
      geo: {
        center: centerBegin,
        zoom: 1.2,
        map: 'world',
        label: {
          emphasis: {
            opacity: 0,
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            borderColor: themes[this.state.theme].borderColor,
            areaColor: themes[this.state.theme].areaColor,
          },
        },
      },
    };
    this.myChart2.setOption(mapOption);
    // console.log("centerBegin1", centerBegin)
    centerPixeBegin = this.myChart2.convertToPixel('geo', centerBegin);

    this.myChart2.on('georoam', (params) => {
      this.calculateLocation();
    });

    this.myChart2.on('click', (params) => { // 点击点或线出现红色高亮
      roamNow = this.myChart2.getOption().geo[0].zoom;
      centerNow = this.myChart2.getOption().geo[0].center;
      console.log("roamNOw",roamNow)
      if (params.componentType === 'series') {
        mapOption.geo.zoom = roamNow;
        mapOption.geo.center = centerNow;
        if (this.seriesNo === true) { // 原本已有高亮
          if (mapOption.series.length - 1 !== params.seriesIndex) { // 点击的不是原来高亮的
            mapOption.series.pop();
            this.seriesNo = true;
            if (params.componentSubType === 'scatter') {
              if (params.seriesName === 'nextYear') {
                this.personList = author2[params.name];
              } else {
                this.personList = author[params.name];
              }
              mapOption.series.push(
                {
                  type: 'scatter',
                  coordinateSystem: 'geo',
                  zlevel: 3,
                  z: 6,
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
                    const size = 10 + (val[2] / 4);
                    if (val[2] !== 1) {
                      if (size > 25) {
                        return (26);
                      } else {
                        return (size);
                      }
                    } else {
                      return ((10 + (val[2] / 4)) / 2);
                    }
                  },
                },
              );
              this.type = 'scatter';
              this.myChart2.setOption(mapOption, true);
            } else if (params.componentSubType === 'lines') {
              const a = new Set(author[params.name[0]]);
              const b = new Set(author2[params.name[1]]);
              this.personList = new Set([...a].filter(x => b.has(x)));
              this.from = params.name[0];
              this.to = params.name[1];
              mapOption.series.push({
                type: 'lines',
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
              this.myChart2.setOption(mapOption, true);
            }
          } else { // 原本有高亮且点击取消
            mapOption.series.pop();
            this.seriesNo = false;
            this.myChart2.setOption(mapOption, true);
          }
        } else { // 原来没有高亮
          this.seriesNo = true;
          if (params.componentSubType === 'scatter') {
            if (params.seriesName === 'nextYear') {
              this.personList = author2[params.name];
            } else {
              this.personList = author[params.name];
            }
            mapOption.series.push(
              {
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                z: 6,
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
                  const size = 10 + (val[2] / 4);
                  if (val[2] !== 1) {
                    if (size > 25) {
                      return (26);
                    } else {
                      return (size);
                    }
                  } else {
                    return ((10 + (val[2] / 4)) / 2);
                  }
                },
              },
            );
            this.type = 'scatter';
            this.myChart2.setOption(mapOption, true);
          } else if (params.componentSubType === 'lines') {
            const a = new Set(author[params.name[0]]);
            const b = new Set(author2[params.name[1]]);
            this.personList = new Set([...a].filter(x => b.has(x)));
            this.from = params.name[0];
            this.to = params.name[1];
            mapOption.series.push({
              type: 'lines',
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
            this.myChart2.setOption(mapOption, true);
          }
        }
      }
    });
    this.myChart2.on('dblclick', () => { // 双击放大
      mapOption.geo.zoom += 0.1;
      this.myChart2.setOption(mapOption);
    });
  }

  getDownPlay = (params) => { // 鼠标移开取消高亮
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

  getHighLight = (params) => { // 鼠标移上高亮
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

  getHeatmapData = () => { // 获取json数据
    let heatData;
    if (!heatData) {
      const pms = wget('/lab/heatData.json');
      pms.then((data) => {
        heatData = data;
        this.setState({ startYear: heatData.startYear, endYear: heatData.endYear });
        location = heatData.locations;
        table = heatData.table;
        locationName = heatData.locationName;
        this.playon = this.state.startYear;
        this.setHeatmap(); // 热力图
        this.getMouseEvent();
      }).catch((error) => {
        return undefined;
      });
    }
  }

  sortValue = (a, b) => {
    return b.value - a.value;
  };

  doHeatGeoMap=() => { // 存储经纬度 geoCoordMap = {123:[116,40]}
    const geoCoordMap = {};
    for (let i = 1; i < location.length; i += 1) {
      geoCoordMap[i] = location[i];
    }
    return geoCoordMap;
  }

  plusHeatZoom = () => { // 放大地图
    mapOption.geo.zoom += 0.1;
    this.calculateLocation();
    this.myChart2.setOption(mapOption);
  }

  minusHeatZoom = () => { // 缩小地图
    mapOption.geo.zoom -= 0.1;
    this.calculateLocation();
    this.myChart2.setOption(mapOption);
  }

  calculateLocation = () => {
    const display = this.state.displayURL;
    display.map((oneGeo) => {
      oneGeo.pixel = this.myChart2.convertToPixel('geo', oneGeo.geo);
      const centerAfter = this.myChart2.getModel().option.geo[0].center;
      const centerPixelAfrer = this.myChart2.convertToPixel('geo', centerAfter);
      const top = ((centerPixelAfrer[1] - centerPixeBegin[1]) + oneGeo.pixel[1]) - 46;
      const left = ((centerPixelAfrer[0] - centerPixeBegin[0]) + oneGeo.pixel[0]) - 20;
      const e = document.getElementById(oneGeo.authorIndex);
      e.style.top = `${top}px`;
      e.style.left = `${left}px`;
    });
  }

  render() {
    const ifPlay = this.state.ifPlay;
    const display = this.state.displayURL;
    console.log('display', this.state.displayURL);
    return (
      <div>
        <div className={styles.picture} id="pic">
          {display && display.map((oneExpert, index) => {
            const key = index;
            return (
              <div className={styles.onePic} key={key} id={oneExpert.authorIndex} style={{ left: oneExpert.pixel[0] - 20, top: oneExpert.pixel[1] - 46 }}>
                <img src={oneExpert.url} className={styles.url} alt="" />
              </div>
            );
          })
          }
        </div>
        <div className={styles.button}>
          <Button className={styles.dark} type="primary" ghost onClick={this.onThemeChangeDark}>dark</Button>
          <Button className={styles.light} type="primary" ghost onClick={this.onThemeChangeLight}>light</Button>
          <Button className={styles.plus} type="primary" ghost icon="plus" onClick={this.plusHeatZoom} />
          <Button className={styles.minus} type="primary" ghost icon="minus" onClick={this.minusHeatZoom} />
        </div>
        <div role="presentation" className={styles.heat} id="heatmap" style={{ height: '670px', width: '1150px' }} onClick={this.onMapClick} />
        <div className={styles.two} style={{ color: '#f5f3f0', fontSize: '20px', fontWeight: '50' }} id="showYear">
          <h1> {yearNow}</h1>
        </div>

        <div className={styles.dinner}>
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
          <Row className={styles.slide}>
            <Col span={22}>
              <Slider min={this.state.startYear} max={this.state.endYear} onChange={this.onChange}
                      onAfterChange={this.onAfterChange}value={this.state.inputValue} />
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
        </div>


      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmap);
