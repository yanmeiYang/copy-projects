/*
 * created by Xinyi Xu on 2017-8-16.
 */
import React from 'react';
import { connect } from 'dva';
// import { Slider, Switch, InputNumber, Row, Col, Icon, Button } from 'antd';
import echarts from 'echarts/lib/echarts'; // 必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/map'; // 引入地图
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/effectScatter';
import 'echarts/map/js/china'; // 引入中国地图//
import 'echarts/map/js/world';
import styles from './ExpertTrajectory.less';
import { Button, Layout } from 'antd';
import { wget } from '../../utils/request';
import mapData from '../../../external-docs/expert-trajectory/testData.json';
// import world from 'echarts/map/js/world';
const address2 = mapData.addresses;
const trajectory = mapData.trajectory;
const { Content, Sider } = Layout;
let option = {};
// let address2;
// let trajectory;
let ifDraw = 0;

class ExpertTrajectory extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google', // [baidu|google]
    view: {},
    // results: [],
  };

  //  componentWillMount(nextProps) {
  //   const query = (this.props.location && this.props.location.query
  //     && this.props.location.query.query) || 'data mining';
  //   const { type } = this.props.location.query;
  //   if (query) {
  //     this.setState({ query });
  //   }
  //   if (type) {
  //     this.setState({ mapType: type || 'google' });
  //   }
  //   this.dispatch({
  //     type: 'app/layout',
  //     payload: {
  //       headerSearchBox: { query, onSearch: this.onSearch },
  //       showFooter: false,
  //     },
  //   });
  // }

  componentDidMount() {
    // this.callSearchMap(this.state.query);
    this.myChart = echarts.init(document.getElementById('world'));
    this.showTrajectory();
    // this.getTrajectoryData(); // 获取数据

  }

  // componentWillReceiveProps(nextProps) { //用于当传进来一个1，让name = 1，在update前执行
  //   console.log('compare: ', nextProps.location.query, ' == ', this.props.location.query)
  //   if (nextProps.location.query && nextProps.location.query !== this.props.location.query) {
  //     this.callSearchMap(nextProps.location.query);
  //   }
  //   this.state.results = this.props.expertTrajectory.results;
  //   console.log("11111",this.state.results)
  //   console.log("yiyiyi",this.props.expertTrajectory.results)
  //   return true;
  // }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    return true;
  }

  // getTrajectoryData = () => {
  //   // let startYear;
  //   let mapData;
  //   if (!mapData) {
  //     const pms = wget('/lab/mapData.json');
  //     pms.then((data) => {
  //       mapData = data;
  //       address2 = mapData.addresses;
  //       trajectory = mapData.trajectory;
  //       this.showTrajectory(); // 画图
  //     }).catch((error) => {
  //       localStorage.removeItem(LSKEY_INTERESTS);
  //       return undefined;
  //     });
  //   }
  // }

  getTrajSeries = (geoCoordMap, data, record, i) => { // 设置点和线的参数
    function formtGCData(geoData, data, count) { // 画线
      // console.log("geoData",geoData)
      // console.log("data",data)
      const tGeoDt = [];
      let index;
      if (data[count + 1] === undefined) {
        index = count;
      } else {
        index = count + 1;
      }
      for (const j of _.range(index)) {
        tGeoDt.push({
          coords: [geoData[data[j].name], geoData[data[j + 1].name]],
        });
      }
      return tGeoDt;
    }

    function formtVData(geoData, data, srcNam, count) { // 画点
      const tGeoDt = [];
      let index;
      if (data[count + 1] === undefined) {
        index = count + 1;
      } else {
        index = count + 2;
      }
      for (const j of _.range(index)) {
        // console.log("index",index,j)
        // console.log("data",data);
        const tNam = data[j].name;
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
  }

  quickLine =() => { // 停止动画立刻画出路线
    // const temp = option.geo.zoom;
    ifDraw = 1;
    // console.log("temp1",temp);
    const record = this.getTrajRecord();
    const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
    const data = this.getTrajData(record); // data = [{name: tsinghua university, value : 6(years)}]
    option = this.drawTrajMap();
    option.series = this.getTrajSeries(geoCoordMap, data, record, (data.length - 2));
    // console.log("temp2",temp);
    // option.geo.zoom = temp;
    this.myChart.setOption(option);
  }

  doTrajGeoMap =(record) => { // 得到经纬度数据
    const geoCoordMap = {}; // geoCoordMap = {tsinghua unversity : [120,40] }
    for (const onerecord of record) {
      const onenode = [address2[onerecord[0]].lat, address2[onerecord[0]].lng];
      geoCoordMap[address2[onerecord[0]].addr] = onenode;
    }
    return geoCoordMap;
  }

  getTrajRecord =() => { // 整理接口给的数据
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

    // console.log('record111', record);
    return record;
  }

  getTrajData =(record) => { // 在各个地点的时间，存于data
    const data = []; // data = [{name: tsinghua university, value : 6(years)}]
    for (const onerecord of record) {
      const years = onerecord[1][1] - onerecord[1][0] + 1;
      const onewhere = { name: address2[onerecord[0]].addr, value: years * 3 }; // 正式使用时3应删掉
      data.push(onewhere);
    }
    return data;
  }

  drawTrajMap =() => { // 画地图
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

  showTrajectory = () => { // 功能起始函数
    const record = this.getTrajRecord();
    const geoCoordMap = this.doTrajGeoMap(record); // geoCoordMap = {tsinghua unversity : [120,40] }
    const data = this.getTrajData(record); // data = [{name: tsinghua university, value : 6(years)}]
    option = this.drawTrajMap();
    this.myChart.setOption(option);
    for (const i of _.range(data.length)) { // 每隔0.2秒画一条线
      setTimeout(() => {
        if (ifDraw === 0) {
          option.series = this.getTrajSeries(geoCoordMap, data, record, i);
          this.myChart.setOption(option);
        } else {
          clearTimeout();
        }
      }, i * 200);
    }
  }

  plusTrajZoom = () => {
    option.geo.zoom += 0.1;
    this.myChart.setOption(option);
  }

  minusTrajZoom = () => {
    if (option.geo.zoom > 0.8) {
      option.geo.zoom -= 0.1;
      this.myChart.setOption(option);
    }
  }

  onPersonClick = (personId) => {
    alert(personId);
  }

  render() {
    // // const model = this.props && this.props.expertTrajectory;

    return (
      <div>
        <div className={styles.wor} id="world" style={{ height: '600px', width: '1200px', padding:'0px'}} />
        <div>
          <Button className={styles.path} type="primary" ghost onClick={this.quickLine} >Show Path</Button>
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


