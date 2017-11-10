import React from 'react';
import { connect } from 'dva';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import { request, queryURL } from 'utils';
import styles from './ExpertHeatmap.less';
import {
  showChart,
  load,
} from './utils/echarts-utils';

let myChart;
const heatData = []; //热力信息[[lng,lat,num],..,]
let years = []; //年份
const trajData = []; //{coords:[[lng,lat],[lng,lat]],...,coords:[[lng,lat],[lng,lat]]}每年的迁徙

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {

  };

  componentWillMount() {
    this.initChart();
  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.expertTrajectory.heatData &&
      nextProps.expertTrajectory.heatData !== this.props.expertTrajectory.heatData) {
      this.processData(nextProps.expertTrajectory.heatData);
      this.loadHeat(2000);
    }
    return true;
  }

  initChart = () => {
    const divId = 'chart';
    load((echarts) => {
      myChart = echarts.init(document.getElementById(divId));
      showChart(myChart, 'bmap');
      if (typeof (this.props.data.data) === 'undefined') {
        console.log('Try to click one person!');
      } else { //为以后将ExpertTrajectory做组件使用
        this.processData(this.props.data);
        this.loadHeat(2000);
      }
    });
  };

  processData = (data) => {
    const address = []; //地理信息字典
    const yearTrj = []; //每年的迁徙
    const personPlace = []; //每人，每年的地理位置二维数组
    const peopleTrj = []; //每个人的迁徙
    const yearPlace = []; //每年，各个位置出现次数二维数组
    const trj = data.data.trajectories;
    const add = data.data.addresses;
    for (const key in add) { //遍历出所有的地址，并生成字典
      if (key) {
        address[key] = add[key];
      }
    }
    let start = 10000;
    let end = 0;
    for (const key in trj) { //找到开始的年份和结束的年份
      if (key) {
        personPlace[key] = []; //初始化每人，每年的地理位置二维数组
        for (const t of trj[key]) {
          if (parseInt(t[0], 10) < start) {
            start = parseInt(t[0], 10);
          }
          if (parseInt(t[0], 10) > end) {
            end = parseInt(t[0], 10);
          }
        }
      }
    }
    years = [start, end];
    for (let i = start; i <= end; i += 1) { //每年每个人所在地点信息
      heatData[i] = []; //按年份初始化热力图数据
      yearTrj[i] = []; //按年份初始化迁徙地址
      trajData[i] = []; //按年份初始化迁徙经纬度
      yearPlace[i] = []; //每年，各个位置出现次数二维数组初始化
    }
    for (const key in trj) { //生成迁徙图和作者当年所在位置信息
      if (key) {
        peopleTrj[key] = [];
        let startPlace = ''; //一次迁徙中开始的位置
        let currentPlace = ''; //当前位置
        let currentYear; //当前年份
        for (const t of trj[key]) {
          //第一部分，生成作者当年所在位置信息
          if (currentPlace !== '') { //第一年
            for (let y = currentYear + 1; y < parseInt(t[0], 10); y += 1) {
              personPlace[key][y] = currentPlace;
            }
          }
          [, currentPlace] = t;
          currentYear = parseInt(t[0], 10);
          personPlace[key][currentYear] = currentPlace;
          //第二部分，生成迁徙图
          for (let i = start; i <= end; i += 1) {
            if (i === parseInt(t[0], 10) && startPlace !== t[1]) {
              if (startPlace === '') {
                [, startPlace] = t;
              } else {
                const p = [startPlace, t[1]]; //一次迁徙
                yearTrj[i].push(p);
                peopleTrj[key].push([startPlace, t[1], i]);
                trajData[i].push([[address[startPlace].geo.lng, address[startPlace].geo.lat],
                  [address[t[1]].geo.lng, address[t[1]].geo.lat]]); //迁徙的经纬度
                [, startPlace] = t; //重新赋值
              }
            }
          }
        }
        //属于第一部分
        for (let y = currentYear + 1; y < end; y += 1) { //补足到最后一个年份的数据
          personPlace[key][y] = currentPlace;
        }
      }
    }
    //通过每人，每年的地理位置二维数组，得到每年，各个位置出现次数二维数组
    for (const key in personPlace) {
      if (key) {
        for (const y in personPlace[key]) {
          if (y) {
            const currentPlace = personPlace[key][y];
            if (typeof (yearPlace[y][currentPlace]) === 'undefined') { //还没有出现过
              yearPlace[y][currentPlace] = 1; //初始化为出现一次
            } else {
              yearPlace[y][currentPlace] += 1; //次数增加
            }
          }
        }
      }
    }
    for (const year in yearPlace) { //遍历得到热力图数据
      if (year) {
        for (const place in yearPlace[year]) {
          if (place) {
            const num = yearPlace[year][place];
            heatData[year].push([address[place].geo.lng, address[place].geo.lat, num]);
          }
        }
      }
    }
  };

  loadHeat = (year) => {
    const option = myChart.getOption();
    option.series[0].data = heatData[year];
    option.series[2].data = trajData[year];
    myChart.setOption(option);
  };

  render() {
    const ifPlay = 'play-circle';
    let startYear = 0;
    let endYear = 2017;
    if (years.length > 0) {
      [startYear, endYear] = years;
    }
    return (
      <div>
        <div className={styles.heatmap} id="chart" />
        <div className={styles.dinner}>
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
          <Row className={styles.slide}>
            <Col span={22}>
              <Slider min={startYear} max={endYear} onChange={this.onChange}
                      onAfterChange={this.onAfterChange} value={this.state.inputValue} />
            </Col>
            <Col span={1}>
              <InputNumber
                min={startYear}
                max={endYear}
                style={{ marginLeft: 0 }}
                value="2017"
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
