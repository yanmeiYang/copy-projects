import React from 'react';
import { connect } from 'dva';
import queryString from 'query-string';
import { sysconfig } from 'systems';
import { Slider, InputNumber, Row, Col, Button, Tooltip, Icon, Modal, Select } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { Spinner } from 'components';
import { routerRedux, Link, withRouter } from 'dva/router';
import * as bridge from 'utils/next-bridge';
import styles from './ExpertHeatmap.less';
import { showChart } from './utils/echarts-utils';
import { loadEchartsWithBMap, cacheInfo, paperCache, infoCache, copyImage, } from './utils/func-utils';
import { PersonList } from '../../components/person';

let myChart;
let trajInterval;
const Option = Select.Option;

@connect(({ expertTrajectory, loading, app }) => ({ expertTrajectory, loading, app }))
@withRouter
class ExpertHeatmap extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    ifPlay: 'play-circle',
    currentYear: 2000,
    isCaching: false,
    visible: false,
    cperson: '',
    displayPaper: '',
    displayImg: '',
    showSetting: false,
    circleTime: 3,
  };

  componentWillMount() {
    this.initChart();
  }

  componentDidMount() {
    cacheInfo(this.props.domainId, () => {
      this.setState({ isCaching: false });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.expertTrajectory.heatData &&
      nextProps.expertTrajectory.heatData !== this.props.expertTrajectory.heatData) {
      this.setState({ isCaching: true }, () => {
        cacheInfo(this.props.domainId, () => {
          const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
          const checkType = typeof (this.props.checkType) === 'undefined' ? [] : this.props.checkType;
          showChart(myChart, 'bmap', themeKey, 'heatmap');
          this.loadHeat(nextProps.expertTrajectory.heatData, this.state.currentYear, checkType);
          this.setState({ isCaching: false });
        });
      });

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

  componentDidUpdate(prevProps, prevState) {
    this.showImage();
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
      }, this.state.circleTime * 1000);
    } else if (trajInterval) {
      clearInterval(trajInterval);
    }
  };

  onChange = (value) => {
    let v = parseInt(value, 10);
    const { startEnd } = this.props.expertTrajectory.heatData;
    const [startYear, endYear] = startEnd;
    v = v > endYear ? endYear : v;
    v = v < startYear ? startYear : v;
    if (typeof (trajInterval) !== 'undefined') {
      clearInterval(trajInterval);
      this.setState({
        ifPlay: 'play-circle',
      });
    }
    this.setState({
      currentYear: v,
    });
    const checkType = typeof (this.props.checkType) === 'undefined' ? [] : this.props.checkType;
    this.loadHeat(this.props.expertTrajectory.heatData, v, checkType);
  };

  setPlayback = () => {

  };

  initChart = () => {
    loadEchartsWithBMap((echarts) => {
      const divId = 'chart';
      if (!myChart) {
        myChart = echarts.init(document.getElementById(divId));
      }
      const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
      showChart(myChart, 'bmap', themeKey, 'heatmap');
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
    if (typeof (query) !== 'undefined') { //输入的是某个领域
      field = `${query}领域`;
      this.setState({ displayPaper: 'none', displayImg: 'none' });
    } else if (typeof (domain) !== 'undefined') { //选择的是某个智库
      this.setState({ displayPaper: '', displayImg: '' });
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

  rearrangeData = (data, startEnd, cy) => {
    if (!startEnd) {
      return [];
    }
    const [startYear, endYear] = startEnd;
    let authors = [];
    for (let y = startYear; y <= endYear; y += 1) {
      if (y in data) {
        authors.push(data[y]);
      } else {
        authors.push({ aid: '', pid: '', year: y, name: '' });
      }
    }
    authors = [].concat(authors.slice(cy - startYear), authors.slice(0, cy - startYear));
    return authors;
  };

  showImage = () => {
    for (const info in infoCache) {
      if (info) {
        const id = `year${infoCache[info].year}${infoCache[info].aid}`;
        copyImage(infoCache[info].aid, id, 90);
      }
    }
  };

  showPersonelInfo = (id) => {
    const person = this.props.expertTrajectory.heatData.personsInfo[id];
    this.setState({
      visible: true,
      cperson: person,
    }, () => {

    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showSettingPlay = () => {
    this.setState({
      showSetting: true,
    });
  };

  handleOk1 = () => {
    this.setState({
      showSetting: false,
    });
  };

  handleCancel1 = () => {
    this.setState({
      showSetting: false,
    });
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
    const loading = this.props.loading.global;
    //const { loading } = this.props.expertTrajectory;
    let loading2 = false;
    if (!loading) { //数据取回来了，正在caching的时候
      if (this.state.isCaching) {
        loading2 = true;
      }
    }

    const bgcolor = ['#AAC2DD', '#044161', '#404a59', '#80cbc4', '#b28759', '#4e6c8d', '#d1d1d1'];
    const themeKey = typeof (this.props.themeKey) === 'undefined' ? 0 : this.props.themeKey;
    const color = bgcolor[themeKey];
    const persons = [];
    for (const p in personsInfo) {
      if (p) {
        persons.push(personsInfo[p]);
      }
    }

    let info = '';
    let paperId = '';
    let paper = '';
    let authors = [];
    if (this.state.currentYear in infoCache) {
      info = infoCache[this.state.currentYear];
      paperId = info.pid;
      paper = paperCache[paperId];
    }
    authors = this.rearrangeData(infoCache, startEnd, this.state.currentYear);
    const personInfo = bridge.toNextPersons([this.state.cperson]);
    const authorJsx = (
      <div className={styles.charts}>
        <PersonList
          className={styles.personList}
          persons={personInfo}
          user={this.props.app.user}
          rightZoneFuncs={[]}
        />
      </div>
    );

    const settingJsx = (
      <div>
        <div>
          <Row>
            <Col span={5}>Playback speed:</Col>
            <Col span={19}>
              <InputNumber
                formatter={value => parseInt(value, 10)}
                min={1}
                max={10}
                value={3}
              />
            </Col>
          </Row>
          <Row>
            <Col span={5}>Play Animation:</Col>
            <Col span={19}>
              <Select defaultValue="true" style={{ width: 120 }}>
                <Option value="true">True</Option>
                <Option value="false">False</Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={5}>With Map:</Col>
            <Col span={19}>
              <Select defaultValue="true" style={{ width: 120 }}>
                <Option value="true">True</Option>
                <Option value="false">False</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </div>
    );

    return (
      <div>
        <Spinner loading={loading2} />
        <div className={styles.whole}>
          <div className={styles.heatmap} id="chart" />
          <div className={styles.info}
               style={{ backgroundColor: color, display: this.state.displayImg }}>
            {authors && authors.map((a) => {
              const id = `year${a.year}${a.aid}`;
              const border = (this.state.currentYear === parseInt(a.year, 10)) ? '2px solid yellow' : '2px solid white';
              const tooltip = `Year ${a.year}`;
              return (
                <div key={id} className={styles.allBox}>
                  <Tooltip title={tooltip}>
                    <div className={styles.imgBox} id={id} style={{ border }} />
                  </Tooltip>
                  <div className={styles.nameBox}>
                    <div className={styles.name} style={{ color, border }} role="presentation"
                         onKeyDown={() => {}} onClick={this.showPersonelInfo.bind(this, a.aid)}>
                      {a.name}
                    </div>
                  </div>
                </div>
              );
            })}
            {!personsInfo &&
              <div className={styles.noinfo}>Please Select a Domian or Input a Query!</div>
            }
          </div>
          <div className={styles.paper} style={{ display: this.state.displayPaper }}>
            <div className={styles.year}>
              {paper && `Year ${this.state.currentYear}:`}
            </div>
            {paper && paper}
            {paper &&
            <div>
              <br />
              <a href={`https://www.aminer.cn/archive/${paperId}`} target="_blank">
                <Icon type="file" />See Paper in Detail
              </a>
            </div>
            }
            {!paper &&
            <div>No Paper Published!</div>
            }
            {!personsInfo &&
            <div>Please Select a Domian or Input a Query!</div>
            }
          </div>
        </div>
        <div className={styles.dinner}>
          <Button className={styles.play} icon={ifPlay} onClick={this.onClick} />
          <Row className={styles.slide}>
            <Col span={22} className={styles.timeLine}>
              <Slider min={startYear} max={endYear} onChange={this.onChange}
                      marks={marks} value={this.state.currentYear} />
            </Col>
            <Col span={1} className={styles.input}>
              <InputNumber
                formatter={value => parseInt(value, 10)}
                min={startYear}
                max={endYear}
                value={this.state.currentYear}
                onChange={this.onChange}
                className={styles.inputNumber}
              />
            </Col>
            <Col span={1}>
              <div className={styles.settingBut}>
                <Button shape="circle" icon="setting" onClick={this.showSettingPlay} />
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.showInfo}>
          <Modal
            title="Information"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
              </Button>,
            ]}
            width="600px"
          >
            <div className={styles.authorInfo}>{authorJsx && authorJsx}</div>
          </Modal>
        </div>
        <div className={styles.settingPlay}>
          <Modal
            title="Playback Settings"
            visible={this.state.showSetting}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
            footer={[
              <Button key="back" size="large" type="primary" onClick={this.setPlayback}>
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.save" />
              </Button>,
              <Button key="submit" size="large" onClick={this.handleOk1}>
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.close" />
              </Button>,
            ]}
            width="600px"
          >
            <div className={styles.authorInfo}>{settingJsx && settingJsx}</div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmap);
