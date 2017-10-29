/**
 *  Created by BoGao on 2017-06-07;
 *  Refactor on 2017-10-26;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import queryString from 'query-string';
import { Auth } from 'hoc';
import { detectSavedMapType, compare } from 'utils';
import { DomainSelector, MapFilter } from 'routes/expert-map';
import * as strings from 'utils/strings';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './ExpertMapPage.less';

const tc = applyTheme(styles);

const MAP_DISPATCH_KEY = 'map-dispatch';

@connect(({ app, expertMap }) => ({ app: { user: app.user, roles: app.roles }, expertMap }))
@Auth
export default class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: '', // [baidu|google]
    domainId: '',
    range: '',
    hindexRange: '',
  };

  componentWillMount() {
    const { location } = this.props;
    const { query, type, domain } = queryString.parse(location.search);
    const mapType = type || detectSavedMapType(MAP_DISPATCH_KEY);
    this.setState({
      query: domain ? '' : query,
      domainId: domain,
      mapType,
    });
    // first laod.
    if (domain) {
      this.searchMapByDomain(domain);
    } else if (query) {
      this.searchMapByQuery(query);
    }
  }

  componentWillReceiveProps(np) {
    const { location } = np;
    const { query, type, domain } = queryString.parse(location.search);
    if (this.state.type !== type) {
      const mapType = type || detectSavedMapType(MAP_DISPATCH_KEY);
      this.setState({ mapType });
    }
    if (this.state.query !== query) {
      this.setState({ query });
    }
    if (this.state.domain !== domain) {
      this.setState({ domainId: domain });
    }
  }

  // TODO use did update ?
  shouldComponentUpdate(np, ns) { // nextProps, nextState
    if (ns.domainId && ns.domainId !== this.state.domainId) {
      this.searchMapByDomain(ns.domainId);
      return true;
    }
    if (ns.query && ns.query !== this.state.query) {
      this.searchMapByQuery(ns.query);
      return true;
    }
    if (compare(ns, this.state, 'range', 'hindexRange')) {
      return true;
    }
    return false;
  }

  onDomainChange = (domain) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/expert-map', search: `?domain=${domain.id}` }));
  };

  onRangeChange = (key) => {
    this.setState({ range: key });
  };

  onHindexRangeChange = (key) => {
    this.setState({ hindexRange: key });
  };

  onSearch = (data) => {
    const { dispatch } = this.props;
    if (data.query) {
      this.setState({ query: data.query });
      dispatch(routerRedux.push({
        pathname: '/expert-map',
        search: `?query=${data.query}`,
      }));
    }
  };

  searchMapByDomain = (domainEBID) => {
    const { dispatch } = this.props;
    dispatch({ type: 'expertMap/searchExpertBaseMap', payload: { eb: domainEBID } });
    this.resetRightInfo();
  };

  searchMapByQuery = (query) => {
    this.props.dispatch({
      type: 'expertMap/searchMap',
      payload: { query: strings.firstNonEmptyQuery(query) },
    });
    this.resetRightInfo();
  };

  resetRightInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expertMap/setRightInfo',
      payload: { idString: '', rightInfoType: 'global' },
    });
  };

  // Tips: 不会根据state变化的jsx block放到外面。这样多次渲染的时候不会多次初始化;
  // titleBlock = <h1>专家地图:</h1>;

  render() {
    const { query, mapType, domainId, range, hindexRange } = this.state;
    const options = { ...this.state, title: this.titleBlock };
    console.log('>>>>>> options:', options);
    return (
      <Layout
        contentClass={tc(['expertMapPage'])}
        query={query}
        onSearch={this.onSearch}
        disableAdvancedSearch
      >
        <DomainSelector
          domains={sysconfig.Map_HotDomains}
          currentDomain={domainId}
          onChange={this.onDomainChange}
          time={Math.random()}
        />

        <MapFilter
          onRangeChange={this.onRangeChange}
          onHindexRangeChange={this.onHindexRangeChange}
        />

        {mapType === 'google'
          ? <ExpertGoogleMap {...options} />
          : <ExpertMap {...options} />
        }
      </Layout>
    );
  }
}
