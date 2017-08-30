/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './ExpertHeatmap.less';
import echarts from 'echarts';
import world from 'echarts/map/js/world';
import mapData from '../../../external-docs/expert-trajectory/testData.json';
import heatData from '../../../external-docs/expert-trajectory/heatData.json';
import { Slider, Layout, InputNumber, Row, Col, Icon, Button, message } from 'antd';
// import expert

const { Content, Sider } = Layout;
const startYear = heatData.startYear;
const endYear = heatData.endYear;
let option2 = {};
let author = {};
let author2 = {};
const location = heatData.locations;
const table = heatData.table;
const authors = heatData.authors;
const ecConfig = echarts.config;
// const myChart2 = echarts.init(document.getElementById('world'));
message.config({
  top: 110,
  duration: 2,
});
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
  };


  componentDidMount() {
    this.seriesNo = false;
    this.type = '';
    this.personList = '';
    this.playon = startYear;
    this.myChart2 = echarts.init(document.getElementById('heatmap'));
    this.setHeatmap(); // 热力图
  }

  onAfterChange = (value) => {
    // if (value === startYear) {
    //   this.onChange(value);
    // }
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
    let geoCoordMap = {};

    geoCoordMap = this.doHeatGeoMap();

    const merge = {};
    const nextYear = {};
    author = {};
    author2 = {};
    for (const aid in _.range(table.length)) {
      if (table[aid][index] !== 0) {
        if (table[aid][index] in merge) {
          merge[table[aid][index]] += 1;
        } else {
          merge[table[aid][index]] = 1;
        }

        if (table[aid][index] in author) {
          author[table[aid][index]].push(authors[aid]);
        } else {
          author[table[aid][index]] = [];
          author[table[aid][index]].push(authors[aid]);
        }
        // console.log('author', author);
      }

      if (index < (endYear - startYear)) {
        if (table[aid][index + 1] !== 0) {
          if (!(table[aid][index + 1] in nextYear)) {
            nextYear[table[aid][index + 1]] = 1;
          }
        }

        if (table[aid][index + 1] in author2) {
          author2[table[aid][index + 1]].push(authors[aid]);
        } else {
          author2[table[aid][index + 1]] = [];
          author2[table[aid][index + 1]].push(authors[aid]);
        }
        // console.log('author2', author2);
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
    this.myChart2.setOption(option2);
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
    this.onButtoon(this.playon);
    const mapinterval = setInterval(() => {
      if (play && this.playon < endYear) {
        // console.log('play');
        this.playon += 1;
        yearNow = this.playon;
        // this.setState({
        //   inputValue: this.playon,
        // });
        this.onChange(this.playon);
        this.onButtoon(this.playon);
        // yearNow = this.playon;
      } else {
        if (this.playon >= endYear) {
          this.playon = startYear;
          play = false;
        }

        // ifPlay = 'play-circle';
        clearInterval(mapinterval);
      }
    }, 4000);
  }


  onButtoon = (value) => { // 按下热力图的播放按钮
    // console.log('value', value);
    const index = value - startYear;
    const data = [];
    let geoCoordMap = {};

    geoCoordMap = this.doHeatGeoMap();

    const merge = {};
    const merge2 = {};
    for (const temp of table) { // 计算当年该地点学者数
      if (temp[index] !== 0) {
        if (temp[index] in merge) {
          merge[temp[index]] += 1;
        } else {
          merge[temp[index]] = 1;
        }
      }
      /* if ((index + 1) <= temp.length && temp[index + 1] !== 0) { // 计算明年有今年没的地点人数
        if (temp[index + 1] in merge2) {
          merge2[temp[index + 1]] += 1;
        } else {
          merge2[temp[index + 1]] = 1;
        }
      } */

      // console.log("index",index)

      if ((index - 1) >= 0 && temp[index - 1] !== 0) { // 计算去年各地点人数
        // console.log("*******")
        if (temp[index - 1] in merge2) {
          merge2[temp[index - 1]] += 1;
        } else {
          merge2[temp[index - 1]] = 1;
        }
      }
    }

    // console.log('merge2', merge2);

    const piece = 19; // 每隔一年插入20个变化人数时间段
    for (const key in merge) {
      let middle;
      if (key in merge2) {
        // middle = (merge2[key] - merge[key]) / (piece + 1); // 插入渐变值
        middle = (merge[key] - merge2[key]) / (piece + 1); // 插入渐变值
      } else {
        middle = (merge[key] - 0) / (piece + 1);
      }
      const onenode = { name: key, value: [merge[key], middle] }; // 实际数据中乘20应删去
      // console.log('middle', onenode.value);
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
    // console.log("onenode",data);

    for (const j of _.range(piece + 2)) {
      setTimeout(() => { // 每隔0.2秒刷新一次，每隔4秒换一年
        option2.series = this.getHeatSeries(geoCoordMap, data, (piece + 1 - j), true);
        // option2.series = this.getHeatSeries(geoCoordMap, data, j, true);
        // console.log("piece=j",piece+1-j)
        this.myChart2.setOption(option2);
      }, j * 200);
    }
  }

  onInputNum = (value) => { // 数字框输入年份
    this.setState({
      inputValue: value,
    });
    this.onChange(value);
  }


  setHeatmap = () => { // 设置热力图参数
    option2 = {
      backgroundColor: '#dadada',
      title: {
        text: '历年学者热力图',
        subtext: 'data from aminer',
        left: 'center',
        textStyle: {
          color: '#5a5a5a',
        },
        subtextStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
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
        zoom: 1,
        map: 'world',
        label: {
          emphasis: {
            show: true,
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#6699CC',
            borderColor: '#91a0ae',
          },
          emphasis: {
            areaColor: '#666666',
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
                // console.log('yiyiyiyiyiyiyiyiyi', option2.series);
                // option2.series.pop();
                // console.log('yoyoyoyoyo', option2.series);
                // this.seriesNo = true;
                option2.series.push(
                  {
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
                        position: 'right',
                        formatter: '{b}',
                      },
                      emphasis: {
                        show: true,
                      },
                    },
                    symbolSize: 5,
                    itemStyle: {
                      normal: {
                        color: '#ff7636',
                        borderColor: 'gold',
                      },
                    },
                    data: [{
                      value: params.value,
                    }],
                    symbolSize(val) {
                      return (val[2] / 10);
                    },
                  },
                );
                this.type = 'scatter';
                this.personList = author[params.name];
                this.myChart2.setOption(option2);
              } else if (params.componentSubType === 'lines') {
                // console.log('yoyoyoyoyo');
                option2.series.push({
                  type: 'lines',
                  zlevel: 1,
                  effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.1,
                    color: '#ff2f31',
                    symbol: 'arrow',
                    symbolSize: 4,
                    animation: true,
                  },
                  lineStyle: {
                    normal: {
                      color: '#ff2f31',
                      width: 1,
                      opacity: 0.3,
                      curveness: 0.2,
                    },
                  },
                  data: [{ coords: [params.data.coords[0], params.data.coords[1]] }],
                });
                this.type = 'lines';
                this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
                this.myChart2.setOption(option2, true);
              }
            } else {
              // console.log('aiyowei');
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
                  rippleEffect: {
                    period: 4,
                    scale: 2,
                    brushType: 'stroke',
                  },
                  label: {
                    normal: {
                      show: true,
                      position: 'right',
                      formatter: '{b}',
                    },
                    emphasis: {
                      show: true,
                    },
                  },
                  symbolSize: 5,
                  itemStyle: {
                    normal: {
                      color: '#ff7636',
                      borderColor: 'gold',
                    },
                  },
                  data: [{
                    value: params.value,
                  }],
                  symbolSize(val) {
                    return (val[2] / 10);
                  },
                },
              );
              this.type = 'scatter';
              this.personList = author[params.name];
              this.myChart2.setOption(option2);
              // console.log('begin', option2.series);
            } else if (params.componentSubType === 'lines') {
              // console.log('hahahhahahahhahahah', params.data.coords);
              option2.series.push({
                type: 'lines',
                zlevel: 2,
                effect: {
                  show: true,
                  period: 6,
                  trailLength: 0.1,
                  color: '#ff2f31',
                  symbol: 'arrow',
                  symbolSize: 4,
                  animation: true,
                },
                lineStyle: {
                  normal: {
                    color: '#ff2f31',
                    width: 1,
                    opacity: 0.3,
                    curveness: 0.2,
                  },
                },
                data: [{ coords: [params.data.coords[0], params.data.coords[1]] }],
              });
              this.type = 'lines';
              this.personList = _.intersection(author[params.name[0]], author2[params.name[1]]);
              this.myChart2.setOption(option2);
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

    for (const i of _.range(1, location.length)) {
      geoCoordMap[i] = location[i];
    }
    console.log('geo', geoCoordMap);
    return geoCoordMap;
  }

  deleteRepeat = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
      const old = arr[i];
      for (let j = i + 1; j < arr.length; j++) {
        if (old.name === arr[j].name && old.age === arr[j].age) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    // console.log(arr);
    return arr;
  }

  getHeatSeries = (geoCoordMap, data, j, choose, year, nextYearData) => { // j是一年中第几个插值
    // console.log('geoCoordMap', geoCoordMap);
    // console.log('data', data);
    // console.log('jjjjj', j);
    const convertData = function (datas, counter) { // 画出热力图上的圈并标出地名
      const res = [];
      for (const i of _.range(datas.length)) {
        const geoCoord = geoCoordMap[datas[i].name];
        if (geoCoord) {
          if (choose !== false) {
            // console.log("bbbb",datas[i].value[0])
            // console.log("aaaa",datas[i].value[1] * counter)
            res.push({
              name: datas[i].name,
              value: geoCoord.concat(datas[i].value[0] - (datas[i].value[1] * counter)),
              // value: geoCoord.concat(datas[i].value[0] + (datas[i].value[1] * counter)),
            });
          } else {
            // console.log('dddddd', geoCoord.concat(datas[i].value));
            res.push({
              name: datas[i].name,
              value: geoCoord.concat(datas[i].value),
              // value:[2,3],
            });
          }
        }
      }
      // console.log('res', res);
      return res;
    };

    function formtGCData() { // 画线
      const tGeoDt = [];
      let arr = [];
      const index = table.length;
      for (const j of _.range(index)) {
        let back = 1;
        if (table[j][year] === 0 && table[j][year + 1] !== undefined) { // 当前年份地址为0 且不是最后一年
          if (year !== 0 && geoCoordMap[table[j][year + 1]] !== undefined) { // 不是第一年且下一年不是0
            while (year - back >= 0 && table[j][year] === 0) {
              table[j][year] = table[j][year - back];
              back += 1;
            }
            tGeoDt.push({
              name: [table[j][year], table[j][year + 1]],
              coords: [geoCoordMap[table[j][year]], geoCoordMap[table[j][year + 1]]],
            });
          }
        } else if (table[j][year + 1] !== 0 && table[j][year + 1] !== undefined) {
          tGeoDt.push({
            name: [table[j][year], table[j][year + 1]],
            coords: [geoCoordMap[table[j][year]], geoCoordMap[table[j][year + 1]]],
          });
        }
      }

      const tGeoDt2 = [];
      const tem = tGeoDt;
      // console.log('tem', tem);
      const len = tem.length;
      arr = [];
      for (const i of _.range(len)) {
        // console.log('arr', arr);
        const t = tem[i];
        // console.log("t['name']", t.name);
        let flag = 0;
        for (const distance of arr) {
          // console.log("distawnce",distance)
          if ( _.difference(distance, t.name).length === 0 && _.difference(t.name, distance).length === 0) {
            // console.log("ddhahaaahidfosjifjdiojij")
            flag = 1;
          }
        }
        if (flag === 0) {
          arr.push(t.name);
          tGeoDt2.push(t);
        }
      }

     // tGeoDt = this.unique(tGeoDt);
      // console.log('tgeodt', tGeoDt2);
      return tGeoDt2;
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
            position: 'right',
            formatter: '{b}',
          },
          emphasis: {
            show: true,
          },
        },
        symbolSize: 5,
        itemStyle: {
          normal: {
            color: '#fff753',
            borderColor: 'gold',
            opacity: 1,
          },
        },
        data: convertData(data.sort((a, b) => {
          return b.value - a.value;
        }).slice(0, 6), j),
        symbolSize(val) {
          return (val[2] / 10);
        },
      },
      { // 当年所有地点
        name: 'location',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data, j),
        symbolSize(val) {
          return (val[2] / 10);
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true,
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: '#FFBA00',
            opacity: 0.4,
          },
        },
      },

      { // 下一年所有地点
        name: 'location',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(nextYearData, j),
        symbolSize: 7,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true,
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            opacity: 0.7,
            color: '#ff2f31',
          },
        },
      },

      {
        type: 'lines',
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          color: '#f78e3d',
          symbol: 'arrow',
          symbolSize: 4,
          animation: true,
        },
        lineStyle: {
          normal: {
            color: '#f78e3d',
            width: 1,
            opacity: 0.3,
            curveness: 0.2,
          },
        },
        data: formtGCData(),
      },

    ];

    console.log('series', series);
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
        <div className={styles.heat} id="heatmap" style={{ height: '600px', width: '1140px' }} onClick={this.onMapClick} />
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
