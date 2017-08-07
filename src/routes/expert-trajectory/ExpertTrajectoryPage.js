/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './ExpertTrajectoryPage.less';
import echarts from 'echarts';
import world from 'echarts/map/js/world';
import china from 'echarts/map/js/china';

import mapData from '../../../external-docs/expert-trajectory/testData.json';
import heatData from '../../../external-docs/expert-trajectory/heatData.json';
import { Slider, Switch, InputNumber, Row, Col, Icon, Button } from 'antd';

const startYear = heatData.startYear;
const endYear = heatData.endYear;
let option2 = {};
// const myChart2 = echarts.init(document.getElementById('world'));
class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'google', // [baidu|google]
    inputValue: 1,
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
    this.showTrajectory();
    this.setHeatmap();
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // TODO change this, 不能用
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-map',
        query: { query: data.query },
      }));
    }
  };

  setHeatmap = () => { // draw the background and map
    option2 = {
      backgroundColor: '#404a59',
       title: {
        text: '历年学者热力图',
        subtext: 'data from aminer',
        // sublink: 'http://www.pm25.in',
        left: 'center',
        textStyle: {
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
        map: 'world',
        label: {
          emphasis: {
            show: true,
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#111',
          },
          emphasis: {
            areaColor: '#2a333d',
          },
        },
      },
     };
    const myChart2 = echarts.init(document.getElementById('heatmap'));
    myChart2.setOption(option2);
  }

  showTrajectory = () => {
    const address2 = mapData.addresses;
    const trajectory = mapData.trajectory;
    console.log('address', address2);
    console.log('trajectory', trajectory);
    console.log('hhh', trajectory.length);
    const record = [];


    for (let i = 0; i < trajectory.length;) {
      // console.log(i);
      const theyear = [];
      const theArea = [];
      theArea.push(trajectory[i][1]);
      theyear.push(trajectory[i][0]);
      let j = i + 1;
      let a = 0;
      for (; j < trajectory.length; j += 1) {
        console.log(i, j);
        if (trajectory[i][1] !== trajectory[j][1]) {
          theyear.push(trajectory[j - 1][0]);
          i = j;
          a = 1;
          break;
        }
        if ((trajectory[i][1] === trajectory[j][1]) && (j + 1 === trajectory.length)) {
          theyear.push(trajectory[j][0]);
          i = j;
          break;
        }
      }
      theArea.push(theyear);
      record.push(theArea);
      if (j + 1 === trajectory.length) {
        if (a !== 0) {
          const ayear = [];
          const aArea = [];
          aArea.push(trajectory[i][1]);
          ayear.push(trajectory[i][0]);
          ayear.push(trajectory[i][0]);
          aArea.push(ayear);
          record.push(aArea);
        }
        i = j + 1;
      }
    }
    const geoCoordMap = {}; // geoCoordMap = {tsinghua unversity : [120,40] }
    for (const onerecord of record) {
      const onenode = [address2[onerecord[0]].lat, address2[onerecord[0]].lng];
      geoCoordMap[address2[onerecord[0]].addr] = onenode;
    }
    console.log('geoCoordMap222', geoCoordMap);

    const data = []; // data = [{name: tsinghua university, value : 6(years)}]
    for (const onerecord of record) {
      const years = onerecord[1][1] - onerecord[1][0] + 1;
      const onewhere = { name: address2[onerecord[0]].addr, value: years * 3 };
      data.push(onewhere);
    }
  console.log('data222', data);

    function formtGCData(geoData, data) {
      const tGeoDt = [];
      for (let i = 0, len = data.length - 1; i < len; i++) {
        console.log('dataaaaaa[0]', data[i].name);
        console.log('geooooo', geoData[data[i].name]);
        tGeoDt.push({
          coords: [geoData[data[i].name], geoData[data[i + 1].name]],
        });
      }
      console.log('&&&&&&&&');
      return tGeoDt;
    }

    function formtVData(geoData, data, srcNam) {
      const tGeoDt = [];
      let i = 0;
      for (const dataset of data) {
        const tNam = dataset.name;
        if (srcNam !== tNam) {
          tGeoDt.push({
            name: `${tNam} ${record[i][1][0]}-${record[i][1][1]}`, // ?
            value: geoData[tNam],
            symbolSize: dataset.value,
            itemStyle: {

              normal: {
                color: '#FFD24D',
                borderColor: 'gold',
              },
            },
          });
        }
        i += 1;
      }
      tGeoDt.push({
        name: srcNam,
        value: geoData[srcNam],
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: '#4DFFFF',
            borderColor: '#fff',
          },
        },
      });
      return tGeoDt;
    }


    // var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
    const planePath = 'arrow';

    const option = {
      backgroundColor: '#013769',
      geo: {

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
            /* shadowBlur: 30,
             shadowColor: 'rgba(0, 0, 0,0.8)', */
            areaColor: '#022548',
            borderColor: '#0DABEA',
          },
          emphasis: {
            areaColor: '#011B34',
          },
        },
      },
      series: [/* {

        type: 'lines',
        zlevel: 2,

        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          color: '#FFB973',
          symbol: planePath,
          symbolSize: 5,
        },
        lineStyle: {
          normal: {
            color: '#FFB973',
            width: 0,
            opacity: 0.2,
            curveness: 0,
          },
        },
        data: formtGCData(geoCoordMap, data, 'tsinghua university', true),
      }, */
        {

          type: 'lines',
          zlevel: 2,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.1,
            color: '#9CE6FE',
            symbol: planePath,
            symbolSize: 5,
          },
          lineStyle: {
            normal: {
              color: '#65A2C2',
              width: 0.2,
              opacity: 0.4,
              curveness: 0,
            },
          },
          data: formtGCData(geoCoordMap, data),
        },
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
          },
          symbolSize: 5,
          itemStyle: {
            normal: {
              color: '#fff',
              borderColor: 'gold',
            },
          },
          data: formtVData(geoCoordMap, data, data),
        }],
    };
    const myChart = echarts.init(document.getElementById('world'));
    myChart.setOption(option);
  }

  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
  }

  onClick=() => { // click the button
    for (let temp = startYear, i = 0; temp <= endYear; temp += 1, i++) {
      setTimeout(() => {
        this.onChange(temp);
        this.onAfterChange(temp);
        // this.haha(temp);
      }, i * 2000);
    }

    /* for (const temp of (startYear, endYear)) {
      console.log(temp);
      setTimeout(() => {
        this.onChange(temp);
        this.onAfterChange(temp);
        // this.haha(temp);
      }, (temp - startYear) * 2000);
    } */
  }

  onAfterChange = (value) => {
    const location = heatData.locations;
    console.log('location', location);
    const table = heatData.table;
    console.log('table', table[0]);
    const index = value - startYear;
    console.log('index', index);
    const data = [];
    const geoCoordMap = {};

    for (const key in location) { // 地点经纬度???
      const onewhere = [];
      if (key !== '0') {
        onewhere.push(location[key].lat);
        onewhere.push(location[key].lng);
        geoCoordMap[key] = onewhere;
      }
    }
    console.log('geo', geoCoordMap);

    const merge = {};
    for (let i = 0; i < table.length; i += 1) { // 计算当年该地点学者数
      if (table[i][index] !== 0) {
        // console.log(merge);
        // console.log("table[0]",table[i][index]);
        if (table[i][index] in merge) {
          merge[table[i][index]] += 1;
        } else {
          merge[table[i][index]] = 1;
        }
      }
    }

    for (const key in merge) {
      console.log('key', key);
      const onenode = { name: key, value: merge[key] * 20 };
      data.push(onenode);
    }
    console.log('data', data);

    /* const data = [
      { name: '123', value: 6 },
      { name: '456', value: 1 },
    ];
    const geoCoordMap = {
      123: [121.15, 31.89],
      456: [109.781327, 39.608266],
    }; */

    const convertData = function (data) {
      const res = [];
      for (let i = 0; i < data.length; i++) {
        const geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    };

    option2.series = [
      /* {
        name: 'location',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data),
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
      }, */
      {
        name: 'location',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(data),
        symbolSize(val) {
          return val[2] / 10;
        },
        showEffectOn: 'render',
        /* rippleEffect: {
          brushType: 'stroke',
        }, */
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
        zlevel: 3,
      },
    ];
    const myChart2 = echarts.init(document.getElementById('heatmap'));
    myChart2.setOption(option2);
  }

  render() {
    return (
      <div className={classnames('content-inner', styles.page)}>
        <div id="world" style={{ height: '500px' }} />
        <div id="heatmap" style={{ height: '500px' }} />

        <Row>
          <Col span={12}>
            <Slider min={startYear} max={endYear} onChange={this.onChange} onAfterChange={this.onAfterChange} value={this.state.inputValue} />
          </Col>
          <Col span={4}>
            <InputNumber
              min={startYear}
              max={endYear}
              style={{ marginLeft: 16 }}
              value={this.state.inputValue}
              onChange={this.onChange}
            />
          </Col>
        </Row>

        <div>
          <Button icon="play-circle" style={{ fontSize: 16, color: '#08c' }} onClick={this.onClick} />
        </div>

      </div>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);
