/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import { Slider, Switch, InputNumber, Row, Col, Icon, Button } from 'antd';

import echarts from 'echarts/lib/echarts'; // 必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/map'; // 引入地图
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/effectScatter';
import 'echarts/map/js/china'; // 引入中国地图//
import 'echarts/map/js/world';

import styles from './ExpertTrajectoryPage.less';
import mapData from '../../../external-docs/expert-trajectory/testData.json';
import heatData from '../../../external-docs/expert-trajectory/heatData.json';

const startYear = heatData.startYear;
const endYear = heatData.endYear;
let option2 = {};
let option = {};
const location = heatData.locations;
const table = heatData.table;
const address2 = mapData.addresses;
const trajectory = mapData.trajectory;
let aaa = 0;

// const myChart2 = echarts.init(document.getElementById('world'));
class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'google', // [baidu|google]
    inputValue: startYear,
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query) || 'data mining';
    const { type } = this.props.location.query;
    if (query) {
      this.setState({ query });
    }
    if (type) {
      this.setState({ mapType: type || 'google' });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
  }

  componentDidMount() {
    this.showTrajectory(); // 迁移图
    this.setHeatmap(); // 热力图
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // TODO change this, 不能用
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-trajectory',
        query: { query: data.query },
      }));
    }
  };

  onChange = (value) => { // 点击滑动条或数字框
    this.setState({
      inputValue: value,
    });
  }

  onClick = () => { // 点击热力图按钮
    for (const temp of _.range(startYear, (endYear + 1))) {
      setTimeout(() => {
        this.onChange(temp);
        this.onButtoon(temp);
      }, (temp - startYear) * 5000);
    }
  }

  onButtoon = (value) => { // 按下热力图的播放按钮
    console.log('value', value);
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
      if ((index + 1) <= temp.length && temp[index + 1] !== 0) { // 计算明年有今年没的地点人数
        if (temp[index + 1] in merge2) {
          merge2[temp[index + 1]] += 1;
        } else {
          merge2[temp[index + 1]] = 1;
        }
      }
    }

    const piece = 24; // 每隔一年插入20个变化人数时间段
    for (const key in merge) {
      let middle;
      if (key in merge2) {
        middle = (merge2[key] - merge[key]) / (piece + 1); // 插入渐变值
      } else {
        middle = (0 - merge[key]) / (piece + 1);
      }
      const onenode = { name: key, value: [merge[key] * 20, middle * 20] }; // 实际数据中乘20应删去
      data.push(onenode);
    }

    for (const key in merge2) { // 今年没有明年有的
      let middle;
      if (!(key in merge)) {
        middle = (merge2[key] - 0) / (piece + 1);
        const onenode = { name: key, value: [0, middle * 20] };
        data.push(onenode);
      }
    }
    for (const j of _.range(piece)) {
      setTimeout(() => { // 每隔0.2秒刷新一次，每隔4秒换一年
        option2.series = this.getHeatSeries(geoCoordMap, data, j, true);
        console.log('EEEEE');
        const myChart2 = echarts.init(document.getElementById('heatmap'));
        myChart2.setOption(option2);
      }, j * 200);
    }
  }

  onInputNum = (value) => { // 数字框输入年份
    this.setState({
      inputValue: value,
    });
    this.onAfterChange(value);
  }

  onAfterChange = (value) => { // 数字框或滑动条数字改变，热力图改变（年份变了）
    const index = value - startYear;
    // console.log('index', index);
    const data = [];
    let geoCoordMap = {};

    geoCoordMap = this.doHeatGeoMap();

    const merge = {};

    for (const temp of table) { // 计算当年该地点专家数
      if (temp[index] !== 0) {
        if (temp[index] in merge) {
          merge[temp[index]] += 1;
        } else {
          merge[temp[index]] = 1;
        }
      }
    }
    for (const key in merge) {
      // console.log('key', key);
      const onenode = { name: key, value: merge[key] * 20 }; // 实际数据中乘20应删去！
      data.push(onenode);
    }
    option2.series = this.getHeatSeries(geoCoordMap, data, 0, false);
    const myChart2 = echarts.init(document.getElementById('heatmap'));
    myChart2.setOption(option2);
  }

  setHeatmap = () => { // 设置热力图参数
    option2 = {
      backgroundColor: '#ebe9e7',
      title: {
        text: '历年学者热力图',
        subtext: 'data from aminer',
        left: 'center',
        textStyle: {
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
            areaColor: '#c1bfbd',
            borderColor: '#91a0ae',
          },
          emphasis: {
            areaColor: '#8a98a5',
          },
        },
      },
    };
    const myChart2 = echarts.init(document.getElementById('heatmap'));
    myChart2.setOption(option2);
  }

  doHeatGeoMap = () => { // 存储经纬度 geoCoordMap = {123:[116,40]}
    const geoCoordMap = {};
    console.log('&&&&&&&', geoCoordMap);
    for (const key in location) { // 地点经纬度
      const onewhere = [];
      if (key !== '0') {
        onewhere.push(location[key].lat);
        onewhere.push(location[key].lng);
        geoCoordMap[key] = onewhere;
      }
    }
    // console.log("geo",geoCoordMap);
    return geoCoordMap;
  }

  getHeatSeries = (geoCoordMap, data, j, choose) => { // j是一年中第几个插值
    console.log('jjjjj', j);
    const convertData = function (datas, counter) { // 画出热力图上的圈并标出地名
      const res = [];
      for (const i of _.range(datas.length)) {
        const geoCoord = geoCoordMap[datas[i].name];
        if (geoCoord) {
          if (choose !== false) {
            res.push({
              name: datas[i].name,
              value: geoCoord.concat(datas[i].value[0] + (datas[i].value[1] * counter)),
            });
          } else {
            console.log('dddddd', geoCoord.concat(datas[i].value));
            res.push({
              name: datas[i].name,
              value: geoCoord.concat(datas[i].value),
              // value:[2,3],
            });
          }
        }
      }
      return res;
    };

    const series = [
      { // 人数最多的5个地点
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(data.sort((a, b) => {
          return b.value - a.value;
        }).slice(0, 5), j),
        symbolSize(val) {
          return val[2] / 10;
        },
        showEffectOn: 'render',
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true,
          },
        },
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333',
          },
        },
        zlevel: 1,
      },
      { // 当年所有地点
        name: 'location',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data, j),
        symbolSize(val) {
          return val[2] / 10;
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
            color: '#ddb926',
          },
        },
      },

    ];

    return series;
  }

  getTrajSeries = (geoCoordMap, data, record, i) => { // 画出迁移图的路线
    function formtGCData(geoData, data, count) { // 画线
      const tGeoDt = [];
      for (const j of _.range(count + 1)) {
        tGeoDt.push({
          coords: [geoData[data[j].name], geoData[data[j + 1].name]],
        });
      }
      return tGeoDt;
    }

    function formtVData(geoData, data, srcNam, count) { // 显示迁移图地点和年份
      const tGeoDt = [];
      for (const j of _.range(count + 2)) {
        const tNam = data[j].name;
        if (srcNam !== tNam) {
          tGeoDt.push({
            name: `${tNam}`,
            value: geoData[tNam].concat(`${record[j][1][0].toString()} - ${record[j][1][1].toString()}`),
            symbolSize: data[j].value,
            itemStyle: {
              normal: {
                color: '#f04134',
                borderColor: '#d73435',
              },
            },
          });
        }
      }
      return tGeoDt;
    }

    const planePath = 'arrow';
    const series = [ // 配置迁移图线和点的属性
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
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
        zlevel: 2,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          color: '#f46e65',
          symbol: planePath,
          symbolSize: 5,
          animation: true,
        },
        lineStyle: {
          normal: {
            color: '#f46e65',
            width: 1.5,
            opacity: 0.4,
            curveness: 0.2,
          },
        },
        data: formtGCData(geoCoordMap, data, i),
      }];

    return series;
  }

  quickLine = () => { // 点击迁移图画出完整路线
    aaa = 1;
    const record = this.getTrajRecord();
    const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
    const data = this.getTrajData(record); // data = [{name: tsinghua university, value : 6(years)}]
    const option = this.drawTrajMap();
    option.series = this.getTrajSeries(geoCoordMap, data, record, (data.length - 2));
    const myChart = echarts.init(document.getElementById('world'));
    myChart.setOption(option);
  }

  doTrajGeoMap = (record) => { // 计算迁移图经纬度数据
    const geoCoordMap = {}; // geoCoordMap = {tsinghua unversity : [120,40] }
    for (const onerecord of record) {
      const onenode = [address2[onerecord[0]].lat, address2[onerecord[0]].lng];
      geoCoordMap[address2[onerecord[0]].addr] = onenode;
    }
    return geoCoordMap;
  }

  getTrajRecord = () => { // 得到迁移图合并数据
    const record = [];
    let lastYear;
    let lastArea;
    let beginYear;
    let counter1 = 0;
    for (const temp of trajectory) { // 合并地址相同的连续年份
      const theYear = [];
      const theArea = [];
      if (counter1 === 0) {
        beginYear = temp[0];
        lastYear = temp[0];
        lastArea = temp[1];
      } else if (lastArea === temp[1]) {
        lastYear = temp[0];
      } else {
        theYear.push(beginYear);
        theYear.push(lastYear);
        theArea.push(lastArea);
        theArea.push(theYear);
        beginYear = temp[0];
        lastYear = temp[0];
        lastArea = temp[1];
        record.push(theArea);
      }
      counter1 = 1;
    }

    console.log('record111', record);
    return record;
  }

  getTrajData = (record) => { // 得到迁移图的data
    const data = []; // data = [{name: tsinghua university, value : 6(years)}]
    for (const onerecord of record) {
      const years = onerecord[1][1] - onerecord[1][0] + 1;
      const onewhere = { name: address2[onerecord[0]].addr, value: years * 3 }; // 实际数据中乘3应删去
      data.push(onewhere);
    }
    return data;
  }

  drawTrajMap = () => { // 画出迁移图背景
    option = { // 地图属性
      backgroundColor: '#abc1db',
      title: {
        text: '专家迁移图',
        subtext: 'data from aminer',
        left: 'center',
        textStyle: {
          color: '#404040',
        },
        subtextStyle: {
          color: '#5a5a5a',
        }
      },
      tooltip: {
        trigger: 'item',
      },
      geo: {
        zoom: 1,
        name: 'trajectory',
        type: 'map',
        map: 'world',
        roam: true,
        label: {
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            areaColor: '#f5f3f0',
            borderColor: '#91a0ae',
          },
          emphasis: {
            areaColor: '#bcbab8',
          },
        },
      },
    };
    return option;
  }

  showTrajectory = () => { // 展示迁移图
    const record = this.getTrajRecord();
    const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
    const data = this.getTrajData(record); // data = [{name: tsinghua university, value : 6(years)}]
    const option = this.drawTrajMap();
    for (const i of _.range(data.length - 1)) { // 每隔4秒画一条线
      setTimeout(() => {
        if (aaa === 0) {
          option.series = this.getTrajSeries(geoCoordMap, data, record, i);
          const myChart = echarts.init(document.getElementById('world'));
          myChart.setOption(option);
        } else {
          clearTimeout();
        }
      }, i * 4000);
    }
  }

  plusTrajZoom = () => {
    option.geo.zoom += 0.1;
    if (option.geo.zoom - 0.1 < 0.7) {
      const record = this.getTrajRecord();
      const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
      const data = this.getTrajData(record);
      option.series = this.getTrajSeries(geoCoordMap, data, record, (data.length - 2));
    }
    const myChart = echarts.init(document.getElementById('world'));
    myChart.setOption(option);
  }

  minusTrajZoom = () => {
    option.geo.zoom -= 0.1;
    if (option.geo.zoom < 0.7) {
      aaa = 1;
      console.log('FFFF', option.series);
      option.series = [{
        type: 'lines',
        zlevel: 0,
        lineStyle: {
          normal: {
            color: '#65A2C2',
            width: 0,
            opacity: 0,
            curveness: 0.2,
          },
        },
      }];
    }
    const myChart = echarts.init(document.getElementById('world'));
    myChart.setOption(option);
  }

  plusHeatZoom = () => {
    option2.geo.zoom += 0.1;
    const myChart2 = echarts.init(document.getElementById('heatmap'));
    myChart2.setOption(option2);
  }

  minusHeatZoom = () => {
    option2.geo.zoom -= 0.1;
    const myChart2 = echarts.init(document.getElementById('heatmap'));
    myChart2.setOption(option2);
  }

// <canvas width="1560" height="1000" data-zr-dom-id="zr_0" style="position: absolute; left: 0px; top: 0px; width: 780px; height: 500px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
  render() {
    return (
      <div className={classnames('content-inner', styles.page)}>
        <div id="world" style={{ height: '500px' }} onClick={this.quickLine} />
        <div>
          <Button type="primary" ghost icon="plus" style={{
            fontSize: 16,
            color: '#08c',
            position: 'absolute',
            left: '35px',
            top: '150px'
          }} onClick={this.plusTrajZoom} />
        </div>
        <div>
          <Button type="primary" ghost icon="minus" style={{
            fontSize: 16,
            color: '#08c',
            position: 'absolute',
            left: '35px',
            top: '330px'
          }} onClick={this.minusTrajZoom} />
        </div>
        <div id="heatmap" style={{ height: '500px' }} />
        <div>
          <Button ghost icon="plus"
                  style={{ fontSize: 16, position: 'absolute', left: '35px', top: '650px' }}
                  onClick={this.plusHeatZoom} />
        </div>
        <div>
          <Button ghost icon="minus"
                  style={{ fontSize: 16, position: 'absolute', left: '35px', top: '830px' }}
                  onClick={this.minusHeatZoom} />
        </div>

        <Row>
          <Col span={12}>
            <Slider min={startYear} max={endYear} onChange={this.onChange}
                    onAfterChange={this.onAfterChange} value={this.state.inputValue} />
          </Col>
          <Col span={4}>
            <InputNumber
              min={startYear}
              max={endYear}
              style={{ marginLeft: 100 }}
              value={this.state.inputValue}
              onChange={this.onInputNum}
            />
          </Col>
        </Row>

        <div>
          <Button icon="play-circle" style={{ fontSize: 16, color: '#08c' }}
                  onClick={this.onClick} />
        </div>

      </div>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);
