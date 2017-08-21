/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './ExpertHeatmapPage.less';
import echarts from 'echarts';
import world from 'echarts/map/js/world';
import mapData from '../../../external-docs/expert-trajectory/testData.json';
import heatData from '../../../external-docs/expert-trajectory/heatData.json';
import { Slider, Switch, InputNumber, Row, Col, Icon, Button, message } from 'antd';

const startYear = heatData.startYear;
const endYear = heatData.endYear;
let option2 = {};
const location = heatData.locations;
const table = heatData.table;
// const myChart2 = echarts.init(document.getElementById('world'));
message.config({
  top: 110,
  duration: 2,
});
let play = false;
let yearNow;
class ExpertHeatmapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'google', // [baidu|google]
    inputValue: startYear,
    ifPlay:'play-circle'
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
    this.playon = startYear;
    this.myChart2 = echarts.init(document.getElementById('heatmap'));
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

  info=(temp) => {
    message.success(temp, 2);
  }

  onAfterChange = (value) => {
    if (value === startYear) {
      this.onChange(value);
    }
  }

  onChange = (value) => { // 点击滑动条或数字框
    this.setState({
      inputValue: value,
    });
    this.playon = value;
    console.log("value",value,this.playon);
    yearNow = this.playon;
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
      const onenode = { name: key, value: merge[key] * 40 }; // 实际数据中乘20应删去！
      data.push(onenode);
    }
    option2.series = this.getHeatSeries(geoCoordMap, data, 0, false);
    this.myChart2.setOption(option2);
  }

  /* getZoom=()=>{
    console.log("zoom1",option2.geo.zoom)
    option2.geo.zoom -= 0.1;
    console.log("zoom5",option2.geo.zoom)

    option2.geo.zoom += 0.1;
    console.log("zoom2",option2.geo.zoom)
    this.myChart2.setOption(option2);
    return option2.geo.zoom;
  } */

  onClick=() => { // 点击热力图按钮
    if (!play) {
      play = true;
      this.setState({ ifPlay: 'pause' });
    } else {
      play = false;
      this.setState({ ifPlay: 'play-circle' });
    }
    yearNow = this.playon;
    console.log('playon', this.playon, yearNow);
    this.onChange(this.playon);
    this.onButtoon(this.playon);
    const mapinterval = setInterval(() => {
      if (play && this.playon < endYear) {
        console.log("play")
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

        //ifPlay = 'play-circle';
        clearInterval(mapinterval);
      }
    }, 4000);

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

    console.log("merge2",merge2)

    const piece = 19; // 每隔一年插入20个变化人数时间段
    for (const key in merge) {
      let middle;
      if (key in merge2) {
        // middle = (merge2[key] - merge[key]) / (piece + 1); // 插入渐变值
        middle = (merge[key] - merge2[key]) / (piece + 1); // 插入渐变值
      } else {
        middle = (merge[key] - 0) / (piece + 1);
      }
      const onenode = { name: key, value: [merge[key] * 40, middle * 40] }; // 实际数据中乘20应删去
      console.log("middle",onenode.value);
      data.push(onenode);
    }

    for (const key in merge2) { // 去年有今年没有的
      let middle;
      if (!(key in merge)) {
        middle = (0 - merge2[key]) / (piece + 1);
        // middle = (merge2[key]-0) / (piece + 1);
        const onenode = { name: key, value: [0, middle * 40] };
        data.push(onenode);
      }
    }
    // console.log("onenode",data);

    for (const j of _.range(piece+2)) {
      setTimeout(() => { // 每隔0.2秒刷新一次，每隔4秒换一年
        option2.series = this.getHeatSeries(geoCoordMap, data, (piece+1-j), true);
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
  }

  doHeatGeoMap=() => { // 存储经纬度 geoCoordMap = {123:[116,40]}
    const geoCoordMap = {};
    // console.log('&&&&&&&', geoCoordMap);
    /*for (const key in location) { // 地点经纬度
      const onewhere = [];
      if (key !== '0') {
        onewhere.push(location[key].lat);
        onewhere.push(location[key].lng);
        geoCoordMap[key] = onewhere;
      }
    }*/

    for (const i of _.range(1,location.length)){
      geoCoordMap[i] = location[i];
    }
    console.log("geo",geoCoordMap);
    return geoCoordMap;
  }

  getHeatSeries = (geoCoordMap, data, j, choose) => { // j是一年中第几个插值
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
      return res;
    };

    const series = [
      {
        name: 'TOP 5',
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
            color: '#fff753',
            borderColor: 'gold',
          },
        },
        data: convertData(data.sort((a, b) => {
        return b.value - a.value;
      }).slice(0, 6), j),
        symbolSize(val) {
          return (val[2] / 10) * option2.geo.zoom;
        },
      },
      { // 当年所有地点
        name: 'location',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data, j),
        symbolSize(val) {
          return (val[2] / 10) * option2.geo.zoom;
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
          },
        },
      },

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

  render() {
    const ifPlay = this.state.ifPlay;
    return (
      <div className={classnames('content-inner', styles.page)}>
        <div className={styles.heat} id="heatmap" style={{ height: '600px', width:'1200px'}} />
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
          <Col span={12}>
            <Slider min={startYear} max={endYear} onChange={this.onChange} onAfterChange={this.onAfterChange}value={this.state.inputValue} />
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
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
        </div>


      </div>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertHeatmapPage);
