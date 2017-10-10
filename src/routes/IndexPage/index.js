import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { hole } from 'utils';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { classnames } from 'utils/index';
import { KgSearchBox } from 'components/search';
import { IndexHotLinks } from 'components/widgets';
import { Auth } from 'hoc';
import styles from './index.less';

const tc = applyTheme(styles);

@connect(({ app }) => ({ app }))
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
    const bannerZone = theme.index_bannerZone;

    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>

        {bannerZone && bannerZone.length > 0 && bannerZone.map(elm => elm)}

        <div className={styles.search}>
          <KgSearchBox
            size="large" onSearch={this.onSearch}
            style={{ width: 515, boxShadow: '0 0 8px 0px rgba(99, 99, 99, 0.5)' }}
            searchBtnStyle={{ height: 48, width: 115, fontSize: '18px', fontWeight: 'bold' }}
            indexPageStyle="indexPageStyle"
          />
        </div>

        {hole.fill(theme.index_centerZone, [
          <IndexHotLinks
            key={100}
            links={sysconfig.IndexPage_QuickSearchList}
            urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
          />,
        ])}

        {/*{centerZone && centerZone.length > 0 && centerZone.map(elm => elm)}*/}

      </Layout>
    );
  }
}
