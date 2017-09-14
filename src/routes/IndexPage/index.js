import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { KgSearchBox } from 'components/search';
import { Auth } from 'hoc';
import styles from './index.less';

const { theme } = sysconfig;

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
    // console.log('>>> ', sysconfig.ExpertBases);
    // const { seminars } = search;
    const commonSearch = sysconfig.IndexPage_QuickSearchList;
    const bannerZone = theme.index_bannerZone;

    return (
      <Layout searchZone={[]}>

        {bannerZone && bannerZone.length > 0 && bannerZone.map(elm => elm)}

        <div className={styles.search}>
          <KgSearchBox
            size="large" onSearch={this.onSearch}
            style={{ width: 515, boxShadow: '0 0 8px 0px rgba(99, 99, 99, 0.5)' }} />
        </div>

        <div className={styles.search}>
          {/* ---- 常用搜索 ---- */}
          <p className={styles.commonSearch}>
            {
              commonSearch.map((query, index) => {
                return (
                  <span key={query}>
                    <Link
                      to={`/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
                    >{query}</Link>
                    <span>{(index === commonSearch.length - 1) ? '' : ', '}</span>
                  </span>
                );
              })
            }
          </p>

          {/* Insert Blocks in Config file. */}
          {sysconfig.IndexPage_InfoBlocks}

        </div>

      </Layout>
    );
  }
}
