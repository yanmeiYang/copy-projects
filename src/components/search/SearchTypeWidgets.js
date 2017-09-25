import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { compare } from 'utils/compare';
import { sysconfig } from 'systems';
import styles from './SearchTypeWidgets.less';

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
    url: '/trend-prediction',
    data: 'query',
    pageSignature: 'trend-prediction',
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
    url: '/eb/59a8e5879ed5db1fc4b762ad',
    // data: 'query',
    pageSignature: 'eb/',
  },
};

const defaultNavis = ['ExpertSearch', 'ExpertMap', 'Relation', 'KnowledgeGraph', 'TrendPrediction'];
// Function in development.
if (process.env.NODE_ENV !== 'production') {
  defaultNavis.push('ExpertTrajectory');
}

const defaultQuery = 'data mining';

@connect()
export default class SearchTypeWidgets extends React.PureComponent {

  componentWillMount() {
    this.navis = this.props.navis || defaultNavis;
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
      dispatch(routerRedux.push({ pathname: conf.url, query }));
    } else {
      dispatch(routerRedux.push({ pathname: conf.url.replace(':query', theQuery) }));
    }
  };

  render() {
    return (
      <div className="naviLine" style={{ paddingLeft: sysconfig.Header_LogoWidth }}>
        {this.navis.map((naviKey) => {
          const c = NaviConfig[naviKey];
          const path = window.location.pathname;
          const currentClass = path.indexOf(c.pageSignature) >= 0 ? 'current' : '';
          return (
            <div key={c.label} className={`navi ${currentClass}`}>
              <a onClick={this.onClick(c)}>
                <FM id={`com.searchTypeWidget.label.${c.key}`}
                    defaultMessage={c.label} />
              </a>
            </div>);
        })}
      </div>
    );
  }
}
