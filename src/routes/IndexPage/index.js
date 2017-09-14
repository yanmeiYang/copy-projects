import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { Layout } from 'routes';
import { sysconfig, applyTheme } from 'systems';
import { KgSearchBox } from 'components/search';
import { Auth } from 'hoc';
import styles from './index.less';

const { theme } = sysconfig;
const tc = applyTheme(styles);

@connect()
@Auth
export default class IndexPage extends Component {
  static displayName = 'IndexPage';

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  componentWillMount() {
    this.dispatch({ type: 'app/layout', payload: { headerSearchBox: null } });
  }

  // componentWillUnmount() {
  //   this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  // };

  onSearch = ({ query }) => {
    if (query && query.trim() !== '') {
      this.dispatch(routerRedux.push({
        pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/20`,
      }));
    }
  };

  render() {
    const commonSearch = sysconfig.IndexPage_QuickSearchList;
    const bannerZone = theme.index_bannerZone;
    const centerZone = theme.index_centerZone;

    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])}>

        {bannerZone && bannerZone.length > 0 && bannerZone.map(elm => elm)}

        <div className={styles.search}>
          <KgSearchBox
            size="large" onSearch={this.onSearch}
            style={{ width: 515, boxShadow: '0 0 8px 0px rgba(99, 99, 99, 0.5)' }} />
        </div>

        <div className={styles.keywords}>
          <div className={styles.inner}>
            {commonSearch.map((query, index) => {
              return (
                <div key={query}>
                  <Link
                    to={`/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
                  >{query}</Link>
                  {/*<span>{(index === commonSearch.length - 1) ? '' : ''}</span>*/}
                </div>
              );
            })}
          </div>

        </div>

        {centerZone && centerZone.length > 0 && centerZone.map(elm => elm)}

      </Layout>
    );
  }
}
