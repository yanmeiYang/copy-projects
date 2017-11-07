/*
 * created by Xinyi Xu on 2017-8-16.
 */
import React from 'react';
import loadScript from 'load-script';
import { Button } from 'antd';
import styles from './ExpertTrajectory.less';
// import '../../public/lib/echarts';
import '../../public/lib/bmap.js';
import mapData from '../../../external-docs/expert-trajectory/testData.json';

const address2 = mapData.addresses;
const trajectory = mapData.trajectory;
let option = {};
let ifDraw = 0;

let echarts; // used for loadScript

class ExpertTrajectory extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google', // [baidu|google]
    view: {},
  };

  componentDidMount() {
    loadScript('/lib/echarts.js', () => {
      echarts = window.echarts; // eslint-disable-line prefer-destructuring
      loadScript('/lib/echarts-map/world.js', () => {
        this.myChart = echarts.init(document.getElementById('world'));
        this.showTrajectory();
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    return true;
  }

  onPersonClick = (personId) => {
    alert(personId);
  };

  getTrajRecord = () => { // 整理接口给的数据
    const record = [];
    let lastYear;
    let lastArea;
    let beginYear;
    let counter1 = 0;
    for (const temp of trajectory) { // 得到每个地点的ID，起始年份和终止年份
      let theYear = [];
      let theArea = [];
      if (counter1 === 0) {
        beginYear = temp[0];
        lastYear = temp[0];
        lastArea = temp[1];
        if (counter1 === trajectory.length - 1) {
          theYear.push(beginYear);
          theYear.push(lastYear);
          theArea.push(lastArea);
          theArea.push(theYear);
          record.push(theArea);
        }
      } else if (lastArea === temp[1]) {
        lastYear = temp[0];
        if (counter1 === trajectory.length - 1) {
          theYear = [];
          theArea = [];
          theYear.push(beginYear);
          theYear.push(lastYear);
          theArea.push(lastArea);
          theArea.push(theYear);
          record.push(theArea);
        }
      } else {
        theYear.push(beginYear);
        theYear.push(lastYear);
        theArea.push(lastArea);
        theArea.push(theYear);
        beginYear = temp[0];
        lastYear = temp[0];
        lastArea = temp[1];
        record.push(theArea);
        if (counter1 === trajectory.length - 1) {
          theYear = [];
          theArea = [];
          theYear.push(beginYear);
          theYear.push(lastYear);
          theArea.push(lastArea);
          theArea.push(theYear);
          record.push(theArea);
        }
      }
      counter1 += 1;
    }
    return record;
  };

  getTrajSeries = (geoCoordMap, data, record, i) => { // 设置点和线的参数
    function formtGCData(geoData, data1, count) { // 画线
      const tGeoDt = [];
      let index;
      if (data1[count + 1] === undefined) {
        index = count;
      } else {
        index = count + 1;
      }
      for (let j = 0; j < index; j += 1) {
        tGeoDt.push({
          coords: [geoData[data1[j].name], geoData[data1[j + 1].name]],
        });
      }
      return tGeoDt;
    }

    function formtVData(geoData, data1, srcNam, count) { // 画点
      const tGeoDt = [];
      let index;
      if (data1[count + 1] === undefined) {
        index = count + 1;
      } else {
        index = count + 2;
      }
      for (let j = 0; j < index; j += 1) {
        const tNam = data1[j].name;
        if (srcNam !== tNam) {
          tGeoDt.push({
            name: tNam.concat(` ${record[j][1][0].toString()}`),
            value: geoData[tNam].concat(`${record[j][1][0].toString()} - ${record[j][1][1].toString()}`),
            symbolSize: data[j].value,
            itemStyle: {
              normal: {
                color: '#f56a00',
                borderColor: '#d75000',
              },
            },
          });
        }
      }
      return tGeoDt;
    }

    const planePath = 'arrow';
    const series = [ // 设置地图参数
      {
        // type: 'effectScatter',
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 5,
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
            color: '#fff',
            borderColor: 'gold',
          },
        },
        data: formtVData(geoCoordMap, data, data, i),
      },
      {
        type: 'lines',
        coordinateSystem: 'bmap',
        zlevel: 2,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          color: '#f78e3d',
          symbol: planePath,
          symbolSize: 5,
          animation: true,
        },
        lineStyle: {
          normal: {
            color: '#f78e3d',
            width: 1.5,
            opacity: 0.4,
            curveness: 0.2,
          },
        },
        data: formtGCData(geoCoordMap, data, i),
      }];
    return series;
  };

  getTrajData = (record) => { // 在各个地点的时间，存于data
    const data = []; // data = [{name: tsinghua university, value : 6(years)}]
    for (const onerecord of record) {
      const years = (onerecord[1][1] - onerecord[1][0]) + 1;
      const onewhere = { name: address2[onerecord[0]].addr, value: years * 3 }; // 正式使用时3应删掉
      data.push(onewhere);
    }
    return data;
  };

  doTrajGeoMap = (record) => { // 得到经纬度数据
    const geoCoordMap = {}; // geoCoordMap = {tsinghua unversity : [120,40] }
    for (const onerecord of record) {
      const onenode = [address2[onerecord[0]].lat, address2[onerecord[0]].lng];
      geoCoordMap[address2[onerecord[0]].addr] = onenode;
    }
    return geoCoordMap;
  };

  quickLine = () => { // 停止动画立刻画出路线
    ifDraw = 1;
    const record = this.getTrajRecord();
    const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
    const data = this.getTrajData(record); // data = [{name: tsinghua university, value : 6(years)}]
    option = this.drawTrajMap();
    option.series = this.getTrajSeries(geoCoordMap, data, record, (data.length - 2));
    this.myChart.setOption(option);
  };

  drawTrajMap = () => { // 画地图
    option = { // 设置地图参数
      backgroundColor: '#abc1db',
      title: {
        text: '学者迁移图',
        subtext: 'data from aminer',
        left: 'center',
        textStyle: {
          color: '#404040',
        },
        subtextStyle: {
          color: '#5a5a5a',
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

      // geo: {
      //   zoom: 1,
      //   name: 'trajectory',
      //   type: 'map',
      //   map: 'world',
      //   roam: true,
      //   label: {
      //     emphasis: {
      //       show: false,
      //     },
      //   },
      //   itemStyle: {
      //     normal: {
      //       areaColor: '#f5f3f0',
      //       borderColor: '#91a0ae',
      //     },
      //     emphasis: {
      //       areaColor: '#bcbab8',
      //     },
      //   },
      // },
      bmap: {
        center: [104.114129, 37.550339],
        zoom: 5,
        roam: true,
        mapStyle: {
          styleJson: [
            {
              featureType: 'water',
              elementType: 'all',
              stylers: {
                color: '#044161',
              },
            },
            {
              featureType: 'land',
              elementType: 'all',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'geometry',
              stylers: {
                color: '#064f85',
              },
            },
            {
              featureType: 'railway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'highway',
              elementType: 'geometry',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'highway',
              elementType: 'geometry.fill',
              stylers: {
                color: '#005b96',
                lightness: 1,
              },
            },
            {
              featureType: 'highway',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry.fill',
              stylers: {
                color: '#00508b',
              },
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'green',
              elementType: 'all',
              stylers: {
                color: '#056197',
                visibility: 'off',
              },
            },
            {
              featureType: 'subway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'manmade',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'local',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'geometry.fill',
              stylers: {
                color: '#029fd4',
              },
            },
            {
              featureType: 'building',
              elementType: 'all',
              stylers: {
                color: '#1a5787',
              },
            },
            {
              featureType: 'label',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
          ],
        },
      },
      series: [],
    };
    return option;
  };

  showTrajectory = () => { // 功能起始函数
    const record = this.getTrajRecord();
    const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
    const data = this.getTrajData(record); // data = [{name: tsinghua university, value : 6(years)}]
    option = this.drawTrajMap();
    console.log("hahahah")
    this.myChart.setOption(option);
    option.series.pop();
    console.log("yoyoyo")
    for (const i of _.range(data.length)) { // 每隔0.2秒画一条线
      setTimeout(() => {
        if (ifDraw === 0) {
          option.series = this.getTrajSeries(geoCoordMap, data, record, i);
          console.log("series",option.series)
          this.myChart.setOption(option);
        } else {
          clearTimeout();
        }
      }, i * 200);
    }
  };

  plusTrajZoom = () => {
    option.geo.zoom += 0.1;
    this.myChart.setOption(option);
  };

  minusTrajZoom = () => {
    if (option.geo.zoom > 0.8) {
      option.geo.zoom -= 0.1;
      this.myChart.setOption(option);
    }
  };

  render() {
    return (
      <div>
        <div className={styles.wor} id="world" />
        <div>
          <Button className={styles.path} type="primary" ghost onClick={this.quickLine}>Show Path</Button>
        </div>
        <div>
          <Button className={styles.plus} type="primary" ghost icon="plus" onClick={this.plusTrajZoom} />
        </div>
        <div>
          <Button className={styles.minus} type="primary" ghost icon="minus" onClick={this.minusTrajZoom} />
        </div>
      </div>
    );
  }
}

export default ExpertTrajectory;
