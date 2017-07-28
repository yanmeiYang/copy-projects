import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './SearchTypeWidgets.less';
import { sysconfig } from '../../systems';

const config = [
  { label: '专家', url: '/uniSearch/:query/0/30', pageSignature: 'uniSearch' },
  { label: '地图', url: '/expert-map', data: 'query', pageSignature: 'expert-map' },
  {
    label: '关系',
    url: '/relation-graph-page',
    data: 'query',
    pageSignature: 'relation-graph-page',
  },
  { label: '知识图谱', url: '/knowledge-graph', data: 'query', pageSignature: 'knowledge-graph' },
  { label: '技术趋势', url: '/trend-prediction', data: 'query', pageSignature: 'trend-prediction' },
];

class SearchTypeWidgets extends React.PureComponent {
  state = {
    current: '',
  };

  componentWillMount() {
    this.config = this.props.config || config;

    // match current label based on url.
    const path = window.location.pathname;
    if (this.config) {
      this.config.map((conf) => {
        if (path.indexOf(conf.pageSignature) >= 0) {
          this.setState({ current: conf.label });
        }
        return null;
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  onClick = conf => (e) => {
    this.setState({ current: conf.label });
    if (conf && conf.data) {
      const query = {};
      query[conf.data] = this.props.query;
      this.props.dispatch(routerRedux.push({
        pathname: conf.url, query,
      }));
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: conf.url.replace(':query', this.props.query),
      }));
    }
  };

  render() {
    return (
      <div className="naviLine" style={{ paddingLeft: sysconfig.Header_LogoWidth }}>
        {this.config.map((c) => {
          const currentClass = c.label === this.state.current ? 'current' : '';
          return (
            <div key={c.label} className={`navi ${currentClass}`}>
              <a onClick={this.onClick(c)}>{c.label}</a>
            </div>);
        })}
      </div>
    );
  }
}

export default connect()(SearchTypeWidgets);
