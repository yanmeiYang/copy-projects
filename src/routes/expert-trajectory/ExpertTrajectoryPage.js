import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { routerRedux } from 'dva/router';
import { Layout, Button, Icon, Menu, Dropdown, Modal, notification } from 'antd';
import { Layout as Page } from 'routes';
import { FormattedMessage as FM } from 'react-intl';
import bridge from 'utils/next-bridge';
import styles from './ExpertTrajectoryPage.less';
import { PersonList } from '../../components/person';
import { theme, applyTheme } from 'themes';
import ExpertTrajectory from './ExpertTrajectory';

const { Content, Sider } = Layout;
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


@connect(({ expertTrajectory, loading, app }) => ({ expertTrajectory, loading, app }))
class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '', //查询窗口中的默认值
    cperson: '', //当前选择的人
    themeKey: '0',
    visible: false,
  };

  componentWillMount() {
    const { query } = this.state;
    const q = query || ''; //设置一个默认值
    this.setState({
      query: q,
    });
  }

  componentDidMount() {
    const { query } = this.state;
    if ((query === '' || query === '-')) {
      this.openNotification();
    }
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    if (nextProps.expertTrajectory.results && nextProps.expertTrajectory.results !== this.props.expertTrajectory.results) {
      return true;
    }
    return true;
  }

  onSearch = (data) => {
    this.callSearchMap(data.query);
    if (data.query) {
      this.setState({ query: data.query });
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-trajectory',
        query: { query: data.query },
      }));
    }
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
        const divId = document.getElementById('statistic');
        const data = this.state.cperson;
        console.log(data);
        if ((typeof (divId) !== 'undefined' && divId !== 'undefined'
          && data !== '') || (this.state.visible === false)) {
          clearInterval(chartsinterval);
          console.log('######################################');
          //showSta(echarts, divId, data, 'country');
        }
      }, 100);
    });
  };

  handleDownload = () => {
    const downloadinterval = setInterval(() => {
      const data = this.props.expertTrajectory.results;
      if (typeof (data.results) !== 'undefined' && data.results !== 'undefined') {
        clearInterval(downloadinterval);
        this.downloadSta(data);
      }
    }, 100);
  };

  onPersonClick = (start, end, person) => {
    //这里的参数的名字要和model里面的一致
    const personId = person.id;
    this.props.dispatch({ type: 'expertTrajectory/findTrajById', payload: { personId, start, end } });
    this.setState({ cperson: person });
  };

  openNotification = () => {
    let [message, description] = ['', ''];
    sysconfig.Locale === 'en' ? [message, description] = ['Attention Please!', 'You have an invalid keyword!Please select a domain keyword or type a keyword to see what you want!'] : [message, description] = ['请注意！', '您当前的搜索词为空，请您输入选择一个搜索词或者领域进行搜索！'];
    console.log(message);
    console.log(description);
    // notification.open({
    //   message: message,
    //   description: description,
    //   duration: 8,
    //   icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    // });
  };

  onSkinClick = (value) => {
    this.setState({ themeKey: value.key });
  };

  callSearchMap = (query) => {
    const offset = 0;
    const size = 20;
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query, offset, size } });
  };

  render() {
    const persons = this.props.expertTrajectory.results;
    const results = bridge.toNextPersons(persons);
    const { query, themeKey } = this.state;
    const currentTheme = themes.filter(theme => theme.key === themeKey);

    const divHeight = document.body.clientHeight - 210;
    const divWidth = document.body.clientWidth;
    const menu = (
      <Menu onClick={this.onSkinClick}>
        {themes && themes.map((theme) => {
        return (
          <Menu.Item key={theme.key}>{themeKey === theme.key && <Icon type="check" />}
            <FM defaultMessage={theme.label} id={`com.expertTrajectory.theme.label.${theme.key}`} />
          </Menu.Item>
        );
        })}
      </Menu>
    );
    const PersonList_BottomZone = [
      param => (
        <div key={param.person.id} className={styles.clickTraj}>
          <div className={styles.innerClickTraj}>
            <Button type="dashed" className={styles.but} onClick={this.onPersonClick.bind(this,1900,2017, param.person)}>
              <Icon type="global" style={{ color: '#bbe920' }} />
              <FM defaultMessage="Show Trajectory" id="com.expertMap.headerLine.label.showTraj" />
            </Button>
          </div>
        </div>),
    ];
    const personShowIndices = ['h_index', 'citations', 'activity'];
    return (
      <Page contentClass={tc(['ExpertTrajectoryPage'])} onSearch={this.onSearch}
            query={query}>
        <div className={styles.page}>
          <div className={styles.leftPart}>
            <div className={styles.title}>
              <div className={styles.innerTitle}>
                <FM defaultMessage="Query Result" id="com.expertTrajectory.trajectory.title" />
              </div>
            </div>
            <hr className={styles.hrStyle}/>
              <Layout className={styles.experts}>
                <Sider className={styles.left} style={{ height: divHeight }}>
                  <PersonList
                    className={styles.personList}
                    persons={results}
                    user={this.props.app.user}
                    rightZoneFuncs={[]}
                    bottomZoneFuncs={PersonList_BottomZone}
                    type="tiny"
                    showIndices={personShowIndices}
                  />
                </Sider>
              </Layout>
          </div>
          <div className={styles.rightPart} style={{width: divWidth - 450}}>
            <div className={styles.header}>
              <div className={styles.yourSkin}>
                <Dropdown overlay={menu} className={styles.skin}>
                  <a className="ant-dropdown-link" href="#theme">
                    <Icon type="skin" />
                    {currentTheme && currentTheme.length > 0 &&
                    <FM defaultMessage={currentTheme[0].label} id={`com.expertTrajectory.theme.label.${currentTheme[0].key}`} />
                    }
                  </a>
                </Dropdown>
              </div>
              <div className={styles.statics}>
                <Button onClick={this.showModal}>
                  <Icon type="line-chart" />
                  <FM defaultMessage="Trajectory Statistic" id="com.expertMap.headerLine.label.statistic" />
                </Button>
                <Modal
                  title="Statistics & Analyses"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="back" size="large" onClick={this.handleDownload.bind(this)}>
                      <Icon type="download" />
                      <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.download" />
                    </Button>,
                    <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                      <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
                    </Button>,
                  ]}
                  width="700px"
                >
                  <div id="statistic">dddddddddddddd</div>
                </Modal>
              </div>
              <div className={styles.play}>
                <Button>
                  <Icon type="desktop" />
                  <FM defaultMessage="Play" id="com.expertMap.headerLine.label.play" />
                </Button>
              </div>
            </div>
            <div className={styles.trajShow}>
              <Layout className={styles.right} style={{width: divWidth - 450}}>
                <Content className={styles.content}>
                  <ExpertTrajectory person={this.state.cperson} themeKey={themeKey} />
                </Content>
              </Layout>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);

