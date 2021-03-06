import React from 'react';
import { connect, Papge, router } from 'dva';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { Layout, Button, Icon, Menu, Dropdown, Modal, Tabs } from 'antd';
import { Layout as Page } from 'components/layout';
import { FormattedMessage as FM } from 'react-intl';
import * as bridge from 'utils/next-bridge';
import { applyTheme } from 'themes';
import queryString from 'query-string';
import styles from './career-trajectory.less';
import {
  showPersonStatistic,
  downloadData
} from 'components/career-trajectory/utils/trajectory-statistic';
import { PersonList } from 'components/person';
import { ExpertTrajectory } from 'components/career-trajectory';
import { getPerson } from 'services/person';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;
const tc = applyTheme(styles);
const themes = [
  { label: '常规', key: '0' },
  { label: '商务', key: '1' },
  { label: '黑暗', key: '2' },
  { label: '抹茶绿', key: '3' },
  { label: '牛皮纸', key: '4' },
  { label: '航海家', key: '5' },
  { label: '简约风', key: '6' },
];

@Page({ models: [require('models/expert-trajectory')] })
@connect(({ expertTrajectory, loading, app }) => ({ expertTrajectory, loading, app }))
export default class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '', //查询窗口中的默认值，需要设置为空
    cperson: '', //当前选择的人
    themeKey: '1',
    visible: false,
    play: false,
    embeded: false,
  };

  componentWillMount() {
    const { location } = this.props;
    const { id, flag } = queryString.parse(location.search);
    if (flag) { //undefined的非是true
      this.setState({
        embeded: true,
      }, () => {
        this.onIframeLoad(id);
      });
    } else {
      this.setState({
        embeded: false,
      });
    }
  }

  componentDidMount() {
    const { query } = this.state;
    if ((query === '' || query === '-')) {
      this.openNotification();
    } else { //后面需要去掉
      // const data = { query };
      // this.onSearch(data);
    }
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    if (nextProps.expertTrajectory.results &&
      nextProps.expertTrajectory.results !== this.props.expertTrajectory.results) {
      return true;
    }
    return true;
  }

  onSearch = (data) => {
    this.callSearchMap(data.query);
    if (data.query) {
      this.setState({ query: data.query });
      router.push({
        pathname: '/expert-trajectory',
        search: `query=${data.query}`,
      });
    }
  };

  onSkinClick = (value) => {
    this.setState({ themeKey: value.key });
  };

  onPersonClick = (start, end, person) => {
    //这里的参数的名字要和model里面的一致
    const personId = person.id;
    this.props.dispatch({
      type: 'expertTrajectory/findTrajById',
      payload: { personId, start, end }
    });
    this.setState({ cperson: person });
    router.push({
      pathname: '/expert-trajectory',
      search: `?id=${personId}`,
    });
  };

  onIframeLoad = (personId) => {
    const start = 0;
    const date = new Date();
    const end = date.getFullYear();
    this.props.dispatch({
      type: 'expertTrajectory/findTrajById',
      payload: { personId, start, end }
    });
    const resultPromise = getPerson(personId);
    resultPromise.then(
      (data1) => {
        const cperson = data1.data;
        this.setState({ cperson });
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
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

  showModal = () => {
    this.setState({
      visible: true,
    }, () => {
      const chartsinterval = setInterval(() => {
        const divId = document.getElementById('timeDistribution');
        const data = this.props.expertTrajectory.trajData;
        const type = 'timeDistribution';
        if ((typeof (divId) !== 'undefined' && divId !== 'undefined'
            && data !== '') || (this.state.visible === false)) {
          clearInterval(chartsinterval);
          showPersonStatistic(data, type);
          //防止在其他tab的时候信息没有被刷新
          if (document.getElementById('migrateHistory') !== null) {
            showPersonStatistic(data, 'migrateHistory');
          }
          if (document.getElementById('regionDistribute') !== null) {
            showPersonStatistic(data, 'regionDistribute');
          }
        }
      }, 100);
    });
  };

  changeStatistic = (key) => {
    const chartsinterval = setInterval(() => {
      let divId;
      let type;
      if (key === '0') {
        divId = document.getElementById('timeDistribution');
        type = 'timeDistribution';
      } else if (key === '1') {
        divId = document.getElementById('migrateHistory');
        type = 'migrateHistory';
      } else if (key === '2') {
        divId = document.getElementById('regionDistribute');
        type = 'regionDistribute';
      }
      const data = this.props.expertTrajectory.trajData;
      if (typeof (divId) !== 'undefined' && divId !== 'undefined') {
        clearInterval(chartsinterval);
        showPersonStatistic(data, type);
      }
      if (!this.state.visible) {
        clearInterval(chartsinterval);
      }
    }, 100);
  };

  handleDownload = () => {
    const data = this.props.expertTrajectory.trajData;
    if (typeof (data.staData) !== 'undefined' && data.staData !== 'undefined') {
      let str = downloadData(data);
      const bom = '\uFEFF';
      str = encodeURI(str);
      const { name } = this.state.cperson;
      const link = window.document.createElement('a');
      link.setAttribute('href', `data:text/csv;charset=utf-8,${bom}${str}`);
      link.setAttribute('download', `statistics-${name}.csv`);
      link.click();
    } else {
      //给个提示？
    }
  };

  openNotification = () => {
    let [message, description] = ['', ''];
    if (sysconfig.Locale === 'en') {
      [message, description] = ['Attention Please!', 'You have an invalid keyword!Please select a domain keyword or type a keyword to see what you want!'];
    } else {
      [message, description] = ['请注意！', '您当前的搜索词为空，请您输入选择一个搜索词或者领域进行搜索！'];
    }
    console.log(message);
    console.log(description);
    console.log(typeof (message));
    // notification.open({
    //   message,
    //   description,
    //   duration: 8,
    //   icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    // });
  };

  callSearchMap = (query) => {
    const offset = 0;
    const size = 20;
    this.props.dispatch({
      type: 'expertTrajectory/searchPerson',
      payload: { query, offset, size }
    });
  };

  play = () => {
    const cPlay = this.state.play;
    this.setState({ play: !cPlay });
  };

  render() {
    const persons = this.props.expertTrajectory.results;
    const results = bridge.toNextPersons(persons);
    const { query, themeKey } = this.state;
    const currentTheme = themes.filter(theme => theme.key === themeKey);

    const divHeight = document.body.clientHeight;
    let divWidth = document.body.clientWidth;
    const menu = (
      <Menu onClick={this.onSkinClick}>
        {themes && themes.map((theme) => {
          return (
            <Menu.Item key={theme.key}>{themeKey === theme.key && <Icon type="check" />}
              <FM defaultMessage={theme.label}
                  id={`com.expertTrajectory.theme.label.${theme.key}`} />
            </Menu.Item>
          );
        })}
      </Menu>
    );
    const start = 0;
    const date = new Date();
    const end = date.getFullYear();
    const PersonListBottomZone = [
      param => (
        <div key={param.person.id} className={styles.clickTraj}>
          <div className={styles.innerClickTraj}>
            <Button type="dashed" className={styles.but}
                    onClick={this.onPersonClick.bind(this, start, end, param.person)}>
              <Icon type="global" style={{ color: '#bbe920' }} />
              <FM defaultMessage="Show Trajectory" id="com.expertMap.headerLine.label.showTraj" />
            </Button>
          </div>
        </div>),
    ];
    const personShowIndices = ['h_index', 'citations', 'activity']; //指数只取这几个
    const staJsx = (
      <div className={styles.charts}>
        <div id="timeDistribution" className={styles.chart1} />
      </div>
    );

    const staJsx1 = (
      <div className={styles.charts}>
        <div id="migrateHistory" className={styles.chart1} />
      </div>
    );

    const staJsx2 = (
      <div className={styles.charts}>
        <div id="regionDistribute" className={styles.chart1} />
      </div>
    );

    const showFlag = !this.state.embeded; //是去嵌入的时候不显示Layout
    const showLeft = showFlag ? '' : 'none';
    divWidth = showFlag ? divWidth : (divWidth + 450); //地图的大小要跟着改变

    const content = (
      <div>
        <Spinner loading={this.props.expertTrajectory.loading} />
        <div className={styles.page}>
          <div className={styles.leftPart} style={{ display: `${showLeft}` }}>
            <div className={styles.title}>
              <div className={styles.innerTitle}>
                <Icon type="exception" style={{ color: '#108ee9' }} />
                <FM defaultMessage="Query Result" id="com.expertTrajectory.trajectory.title" />
              </div>
            </div>
            <hr className={styles.hrStyle} />
            <Layout className={styles.experts}>
              <Sider className={styles.left} style={{ height: divHeight }}>
                <PersonList
                  className={styles.personList}
                  persons={results}
                  user={this.props.app.user}
                  rightZoneFuncs={[]}
                  bottomZoneFuncs={PersonListBottomZone}
                  type="tiny"
                  showIndices={personShowIndices}
                />
              </Sider>
            </Layout>
          </div>
          <div className={styles.rightPart} style={{ width: divWidth - 450, height: divHeight }}>
            <div className={styles.header}>
              <div className={styles.yourSkin}>
                <Dropdown overlay={menu} className={styles.skin}>
                  <a className="ant-dropdown-link" href="#theme">
                    <Icon type="skin" />
                    {currentTheme && currentTheme.length > 0 &&
                    <FM defaultMessage={currentTheme[0].label}
                        id={`com.expertTrajectory.theme.label.${currentTheme[0].key}`} />
                    }
                  </a>
                </Dropdown>
              </div>
              <div className={styles.statics}>
                <Button onClick={this.showModal}>
                  <Icon type="line-chart" />
                  <FM defaultMessage="Trajectory Statistic"
                      id="com.expertMap.headerLine.label.statistic" />
                </Button>
                <Modal
                  title="Statistics & Analyses"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back" size="large" onClick={this.handleDownload.bind(this)}>
                      <Icon type="download" />
                      <FM defaultMessage="Baidu Map"
                          id="com.expertMap.headerLine.label.download" />
                    </Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                      <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
                    </Button>,
                  ]}
                  width="700px"
                >
                  <Tabs defaultActiveKey="0" onChange={this.changeStatistic}>
                    <TabPane tab="Time Distribution" key="0">{staJsx && staJsx}</TabPane>
                    <TabPane tab="Migrate History" key="1">{staJsx1 && staJsx1}</TabPane>
                    <TabPane tab="Areas Distribution" key="2">{staJsx2 && staJsx2}</TabPane>
                  </Tabs>
                </Modal>
              </div>
              <div className={styles.play}>
                <Button onClick={this.play}>
                  <Icon type="desktop" />
                  <FM defaultMessage="Play" id="com.expertMap.headerLine.label.play" />
                </Button>
              </div>
            </div>
            <div className={styles.trajShow}>
              <Layout className={styles.right} style={{ width: divWidth - 450 }}>
                <Content className={styles.content}>
                  <ExpertTrajectory person={this.state.cperson} themeKey={themeKey}
                                    play={this.state.play} />
                </Content>
              </Layout>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {showFlag &&
        <Page contentClass={tc(['ExpertTrajectoryPage'])} onSearch={this.onSearch}
              query={query}>
          {content && content}
        </Page>
        }
        {!showFlag &&
        <div>
          {content && content}
        </div>
        }
      </div>
    );
  }
}


