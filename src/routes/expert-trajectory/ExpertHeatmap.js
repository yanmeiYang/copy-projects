import React from 'react';
import { connect } from 'dva';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import { Spinner } from 'components';
import { request, queryURL } from 'utils';
import styles from './ExpertHeatmap.less';
import {
  showChart,
  load,
} from './utils/echarts-utils';

let myChart;

function getMyChart(echarts) {
  const divId = 'chart';
  if (!myChart) {
    myChart = echarts.init(document.getElementById(divId));
  }
  return myChart;
}

const heatData = []; //热力信息[[lng,lat,num],..,]
let years = []; //年份
const pointsData = [];
const trajData = []; //{coords:[[lng,lat],[lng,lat]],...,coords:[[lng,lat],[lng,lat]]}每年的迁徙
let trajInterval;

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    inputValue: 0,
    ifPlay: 'play-circle',
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
      load((echarts) => {
        getMyChart(echarts);
        this.loadHeat(2000);
      });
    }
    if (this.props.themeKey !== nextProps.themeKey) {
      showChart(myChart, 'bmap', nextProps.themeKey);
      this.loadHeat(2000);
    }
    return true;
  }

  onClick = () => {
    const icon = this.state.ifPlay === 'play-circle' ? 'pause' : 'play-circle';
    this.setState({
      ifPlay: icon,
    });
    if (icon === 'pause') {
      const [, end] = years;
      let start = this.state.inputValue;
      if (start === end) { //已经到最后了就从头开始播放
        [start] = years;
      }
      trajInterval = setInterval(() => {
        this.setState({ inputValue: start }, () => {
          this.loadHeat(start);
          console.log(trajInterval);
          if (start < end) {
            start += 1;
          } else {
            this.setState({
              ifPlay: 'play-circle',
            });
            clearInterval(trajInterval);
          }
        });
      }, 1000);
    } else if (trajInterval) {
      clearInterval(trajInterval);
    }
  };

  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
    this.loadHeat(value);
  };

  initChart = () => {
    load((echarts) => {
      const chart = getMyChart(echarts);
      const skinType = 0;
      showChart(chart, 'bmap', skinType);
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
      pointsData[i] = []; //每年，各个地址信息
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
            pointsData[year].push({
              //name: address[key].name + addValue[key][0], //可加入城市信息
              value: [address[place].geo.lng, address[place].geo.lat],
              symbolSize: (num / 2) + 3,
            });
          }
        }
      }
    }
  };

  loadHeat = (year) => {
    const option = myChart.getOption();
    if (heatData.length === 0 || pointsData.length === 0 || trajData.length === 0) {
      return;
    }
    option.series[0].data = heatData[year];
    option.series[1].data = pointsData[year];
    option.series[2].data = trajData[year];
    myChart.setOption(option);
  };

  render() {
    const { ifPlay } = this.state;
    let startYear = 0;
    let endYear = 2017;
    let marks = { 0: 0, 2017: 2017 };
    if (years.length > 0) {
      marks = {};
      [startYear, endYear] = years;
      for (let i = startYear; i <= endYear; i += 1) {
        if (i % 2 === 0) {
          marks[i] = '';
        } else {
          marks[i] = i;
        }
      }
    }
    return (
      <div>
        <div className={styles.whole}>
          <Spinner loading={this.props.loading.models.expertTrajectory} />
          <div className={styles.heatmap} id="chart" />
          <div className={styles.info}>
            ddd
          </div>
        </div>
        <div className={styles.dinner}>
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
          <Row className={styles.slide}>
            <Col span={22}>
              <Slider min={startYear} max={endYear} onChange={this.onChange}
                      marks={marks} value={this.state.inputValue} />
            </Col>
            <Col span={1}>
              <InputNumber
                min={startYear}
                max={endYear}
                style={{ marginLeft: 0 }}
                value={this.state.inputValue}
                onChange={this.onChange}
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
