import React from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { sysconfig } from 'systems';
import { Slider, InputNumber, Row, Col, Button, Icon } from 'antd';
import { routerRedux, Link, withRouter } from 'dva/router';
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
@withRouter
@RequireRes('BMap')
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
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
      const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
      const checkType = typeof (this.props.checkType) === 'undefined' ? [] : this.props.checkType;
      showChart(myChart, 'bmap', themeKey, 'heatmap');
      this.loadHeat(nextProps.expertTrajectory.heatData, this.state.currentYear, checkType);
      return true;
    }
    if (nextProps.themeKey && this.props.themeKey !== nextProps.themeKey) {
      showChart(myChart, 'bmap', nextProps.themeKey, 'heatmap');
      const checkType = typeof (this.props.checkType) === 'undefined' ? [] : this.props.checkType;
      this.loadHeat(nextProps.expertTrajectory.heatData, this.state.currentYear, checkType);
      return true;
    }
    if (nextProps.checkType && this.props.checkType !== nextProps.checkType) {
      const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
      const checkType = typeof (nextProps.checkType) === 'undefined' ? [] : nextProps.checkType;
      showChart(myChart, 'bmap', themeKey, 'heatmap');
      this.loadHeat(
        nextProps.expertTrajectory.heatData,
        this.state.currentYear, checkType,
      );
      return true;
    }
    if (nextState && nextState !== this.state) {
      return true;
    }
    if (nextProps.loading && nextProps.loading !== this.props.loading) {
      return true;
    }
    return false;
  }

  onClick = () => {
    const icon = this.state.ifPlay === 'play-circle' ? 'pause' : 'play-circle';
    this.setState({
      ifPlay: icon,
    });
    if (icon === 'pause') {
      const { startEnd } = this.props.expertTrajectory.heatData;
      if (typeof (startEnd) === 'undefined') {
        return;
      }
      const [, end] = startEnd;
      let start = this.state.currentYear;
      if (start === end) { //已经到最后了就从头开始播放
        [start] = startEnd;
      }
      trajInterval = setInterval(() => {
        this.setState({ currentYear: start }, () => {
          const checkType = typeof (this.props.checkType) === 'undefined' ? [] : this.props.checkType;
          this.loadHeat(this.props.expertTrajectory.heatData, start, checkType);
          if (start < end) {
            start += 1;
          } else {
            this.setState({
              ifPlay: 'play-circle',
            });
            clearInterval(trajInterval);
          }
        });
      }, 3000);
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
      currentYear: value,
    });
    const checkType = typeof (this.props.checkType) === 'undefined' ? [] : this.props.checkType;
    this.loadHeat(this.props.expertTrajectory.heatData, value, checkType);
  };

  initChart = () => {
    ensure('BMap', () => {
      load((echarts) => {
        const divId = 'chart';
        if (!myChart) {
          myChart = echarts.init(document.getElementById(divId));
        }
        const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
        showChart(myChart, 'bmap', themeKey, 'heatmap');
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
        option.series[2].data = [];
      }
    }
    myChart.setOption(option);
    let field;
    const { location } = this.props;
    const { query, domain } = queryString.parse(location.search);
    if (typeof (query) !== 'undefined') {
      field = `${query}领域`;
    } else if (typeof (domain) !== 'undefined') {
      const lib = sysconfig.Map_HotDomains;
      lib.map((lb) => {
        if (lb.id === domain) {
          field = `${lb.name}智库`;
        }
        return true;
      });
    }
    if (typeof (field) === 'undefined') {
      field = '';
    }
    myChart.setOption({ title: { text: `${this.state.currentYear}年 ${field} 学者迁徙图` } });
  };

  handleErr = (e) => {
    e.target.src = '/images/blank_avatar.jpg';
  };

  render() {
    const { ifPlay } = this.state;
    const { personsInfo, startEnd } = this.props.expertTrajectory.heatData;
    let startYear = 0;
    let endYear = 2017;
    let marks = { 0: 0, 2017: 2017 };
    if (typeof (startEnd) !== 'undefined') {
      if (startEnd.length > 0) {
        marks = {};
        [startYear, endYear] = startEnd;
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
    // const loading = this.props.loading.global;
    //const { loading } = this.props.expertTrajectory;

    const bgcolor = ['#AAC2DD', '#044161', '#404a59', '#80cbc4', '#b28759', '#4e6c8d', '#d1d1d1'];
    const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
    const color = bgcolor[themeKey];
    const persons = [];
    for (const p in personsInfo) {
      if (p) {
        persons.push(personsInfo[p]);
      }
    }

    return (
      <div>
        {/*<Spinner loading={loading} />*/}
        <div className={styles.whole}>
          <div className={styles.heatmap} id="chart" />
          <div className={styles.info} style={{ backgroundColor: color }}>
            {persons && persons.slice(0, 20).map((person) => {
              return (
                <div key={person.id}>
                  <div className={styles.imgBox}>
                    <img src={person.avatar} alt="" onKeyDown={() => {
                    }} onError={this.handleErr} onClick={() => {
                    }} />
                  </div>
                  <div className={styles.nameBox}>
                    <div className={styles.name} style={{ color }}>
                      {person.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.paper}>
            <div className={styles.year}>2014:</div>
            Eric, Mihail, Manning, Christopher D. A Copy-Augmented Sequence-to-Sequence
            Architecture Gives Good Performance on Task-Oriented Dialogue[J]. 2017:468-473.
            <br />
            <a href={`https://www.aminer.cn/archive/58d82fd2d649053542fd76c7`}
               target="_blank"><Icon type="file" />查看文章</a>
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
