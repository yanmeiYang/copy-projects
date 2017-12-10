import React from 'react';
import { connect } from 'dva';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import { Spinner } from 'components';
import { request, queryURL } from 'utils';
import { Auth, RequireRes } from 'hoc';
import { detectSavedMapType, compare, ensure } from 'utils';
import styles from './ExpertHeatmap.less';
import {
  showChart,
  load,
} from './utils/echarts-utils';

let myChart;
let trajInterval;


@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
@RequireRes('BMap')
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    inputValue: 0,
    ifPlay: 'play-circle',
    currentYear: 2000,
  };

  componentWillMount() {
    this.initChart();
  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.expertTrajectory.heatData &&
      nextProps.expertTrajectory.heatData !== this.props.expertTrajectory.heatData) {
      showChart(myChart, 'bmap', this.props.themeKey);
      this.loadHeat(nextProps.expertTrajectory.heatData, this.state.currentYear);
      return true;
    }
    if (nextProps.themeKey && this.props.themeKey !== nextProps.themeKey) {
      showChart(myChart, 'bmap', nextProps.themeKey);
      this.loadHeat(nextProps.expertTrajectory.heatData, this.state.currentYear);
      return true;
    }
    if (nextProps.checkType && this.props.checkType !== nextProps.checkType) {
      showChart(myChart, 'bmap', this.props.themeKey);
      this.loadHeat(
        nextProps.expertTrajectory.heatData,
        this.state.currentYear, nextProps.checkType,
      );
      return true;
    }
    if (nextState && nextState !== this.state) {
      return true;
    }
    return false;
  }

  onClick = () => {
    const icon = this.state.ifPlay === 'play-circle' ? 'pause' : 'play-circle';
    this.setState({
      ifPlay: icon,
    });
    console.log(icon);
    if (icon === 'pause') {
      const [, end] = this.props.expertTrajectory.heatData.startEnd;
      let start = this.state.inputValue;
      if (start === end) { //已经到最后了就从头开始播放
        [start] = this.props.expertTrajectory.heatData.startEnd;
      }
      trajInterval = setInterval(() => {
        this.setState({ inputValue: start }, () => {
          this.loadHeat(this.props.expertTrajectory.heatData, start);
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
    if (typeof (trajInterval) !== 'undefined') {
      clearInterval(trajInterval);
      this.setState({
        ifPlay: 'play-circle',
      });
    }
    this.setState({
      inputValue: value,
    });
    this.loadHeat(this.props.expertTrajectory.heatData, value);
  };

  initChart = () => {
    ensure('BMap', () => {
      load((echarts) => {
        const divId = 'chart';
        if (!myChart) {
          myChart = echarts.init(document.getElementById(divId));
        }
        const skinType = 0;
        showChart(myChart, 'bmap', skinType);
      });
    });
  };

  loadHeat = (data, year, checkType) => {
    const option = myChart.getOption();
    const heatData = data.yearHeatData;
    const pointsData = data.yearPointData;
    const trajData = data.yearLineData;
    if (typeof (heatData) !== 'undefined' && typeof (pointsData) !== 'undefined' && typeof (trajData) !== 'undefined') {
      if (heatData.length === 0 || pointsData.length === 0 || trajData.length === 0) {
        return;
      }
    } else {
      return;
    }

    option.series[0].data = heatData[year];
    option.series[1].data = pointsData[year];
    option.series[2].data = trajData[year];

    if (typeof (checkType) !== 'undefined') { //!undefined的值为true
      if (!checkType.includes('Heat')) {
        option.series[0].data = [];
      }
      if (!checkType.includes('Location')) {
        option.series[1].data = [];
      }
      if (!checkType.includes('Trajectory')) {
        console.log('##############################');
        option.series[2].data = [];
      }
    }
    myChart.setOption(option);
  };

  render() {
    const { ifPlay } = this.state;
    let startYear = 0;
    let endYear = 2017;
    let marks = { 0: 0, 2017: 2017 };
    if (typeof (this.props.expertTrajectory.heatData.startEnd) !== 'undefined') {
      if (this.props.expertTrajectory.heatData.startEnd.length > 0) {
        marks = {};
        [startYear, endYear] = this.props.expertTrajectory.heatData.startEnd;
        const step = parseInt(((endYear - startYear) / 20), 10);
        for (let i = startYear; i <= endYear; i += 1) {
          if (i % step !== 0) {
            marks[i] = '';
          } else {
            marks[i] = i;
          }
        }
      }
    }
    //const loading = this.props.loading.models.expertTrajectory;用这个？
    const { loading } = this.props.expertTrajectory;

    return (
      <div>
        <Spinner loading={loading} />
        <div className={styles.whole}>
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
                      marks={marks} value={this.state.currentYear} />
            </Col>
            <Col span={1}>
              <InputNumber
                min={startYear}
                max={endYear}
                style={{ marginLeft: 0 }}
                value={this.state.currentYear}
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
