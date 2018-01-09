/**
 * Created by BoGao on 2017/9/14.
 */
import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { connect } from 'dva';
import { router } from 'engine';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';

import { Layout } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { compare } from 'utils/compare';

import styles from './Navigator.less';

const tc = applyTheme(styles);

const NaviConfig = {
  ExpertSearch: {
    key: 'ExpertSearch',
    label: '专家',
    url: `/uniSearch/:query/0/${sysconfig.MainListSize}`,
    pageSignature: 'uniSearch',
  },
  ExpertMap: {
    key: 'ExpertMap',
    label: '地图',
    url: '/expert-map',
    data: 'query',
    pageSignature: 'expert-map',
  },
  Relation: {
    key: 'Relation',
    label: '关系',
    url: '/relation-graph-page',
    data: 'query',
    pageSignature: 'relation-graph-page',
  },
  KnowledgeGraph: {
    key: 'KnowledgeGraph',
    label: '知识图谱',
    url: '/knowledge-graph',
    data: 'query',
    pageSignature: 'knowledge-graph',
  },
  TrendPrediction: {
    key: 'TrendPrediction',
    label: '技术趋势',
    url: '/trend',
    data: 'query',
    pageSignature: 'trend',
  },
  ExpertTrajectory: {
    key: 'ExpertTrajectory',
    label: 'DEV:专家迁移',
    url: '/expert-trajectory',
    data: 'query',
    pageSignature: 'expert-trajectory',
  },
  ExpertBase: { // bole 专有
    key: 'ExpertBase',
    label: '我的专家库',
    url: `/eb/${sysconfig.ExpertBase}/:query/0/20`,
    // data: 'query',
    pageSignature: 'eb/',
  },

  ACMFellowExpertBase: { // acmfellow 专有
    key: 'ACMFellowExpertBase',
    label: 'ACM Fellow',
    url: `/eb/${sysconfig.ExpertBase}/:query/0/20`,
    pageSignature: 'eb/',
  },
  ACM_ExpertSearch: {
    key: 'ACM_ExpertSearch',
    label: '全球专家',
    url: `/uniSearch/:query/0/${sysconfig.MainListSize}`,
    pageSignature: 'uniSearch',
  },
};

const defaultNavis = ['ExpertSearch', 'ExpertMap', 'Relation', 'KnowledgeGraph', 'TrendPrediction'];
// Function in development.
if (process.env.NODE_ENV !== 'production') {
  defaultNavis.push('ExpertTrajectory');
}

const defaultQuery = '-';

const menu = (
  <Menu style={{ height: '280px', overflow: 'scroll' }}>
    {sysconfig.MyExpert_List &&
    sysconfig.MyExpert_List.map((expertBase) => {
      return (
        <Menu.Item key={expertBase.id}>
          <a rel="noopener noreferrer"
             href={`/eb/${expertBase.id}/${defaultQuery}/0/20`}>
            {expertBase.title}
          </a>
        </Menu.Item>
      );
    })}
  </Menu>
);

@connect()
export default class Navigator extends Component {
  static displayName = 'Navigator';

  static propTypes = {
    // logoZone: PropTypes.array,
    // searchZone: PropTypes.array,
    // infoZone: PropTypes.array,
  };

  static defaultProps = {
    // logoZone: theme.logoZone,
    // searchZone: theme.searchZone,
    // infoZone: theme.rightZone,
  };

  componentWillMount() {
    this.navis = this.props.navis || defaultNavis;
    // console.log('this.props.navis', this.props.navis);
    // console.log('defaultNavis', defaultNavis);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return compare(this.props, nextProps, 'navis', 'query');
  }

  onClick = conf => (e) => {
    const { dispatch } = this.props;
    const theQuery = this.props.query || defaultQuery;
    // this.setState({ current: conf.label });
    if (conf && conf.data) {
      const query = {};
      query[conf.data] = theQuery;
      // TODO umi router. Link
      router.push(conf.url)
      // dispatch(routerRedux.push({ pathname: conf.url, search: `?query=${theQuery}` }));
    } else {
      router.push(conf.url)
      // dispatch(routerRedux.push({ pathname: conf.url.replace(':query', theQuery) }));
    }
  };

  render() {
    // const { logoZone, searchZone, infoZone } = this.props;
    const path = window.location.pathname;

    return (
      <Layout.Header className={tc(['navigator'])}>
        {sysconfig.HeaderSearch_DropDown &&
        <Dropdown overlay={menu} className={styles.myExpert}>
          <a
            className={tc(['ant-dropdown-link', 'navi'], [path.indexOf('eb/') >= 0 ? 'current' : ''])}
            href="#" style={{ color: 'white', fontSize: '16px' }}>
            我的专家库 <Icon type="down" />
          </a>
        </Dropdown>}

        {this.navis.map((naviKey) => {
          const c = NaviConfig[naviKey];
          // const path = window.location.pathname;
          let currentClass = path.indexOf(c.pageSignature) >= 0 ? 'current' : '';
          if (path.indexOf('expert-googlemap') >= 0 && naviKey === 'ExpertMap') {
            currentClass = 'current';
          }
          return (
            <div key={c.label} className={tc(['navi'], [currentClass])}>
              <a onClick={this.onClick(c)}>
                <FM id={`com.searchTypeWidget.label.${c.key}`}
                    defaultMessage={c.label} />
              </a>
            </div>);
        })}
      </Layout.Header>
    );
  }
}