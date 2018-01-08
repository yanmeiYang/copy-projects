import React, { Component } from 'react';
import { connect } from 'dva';
import { engine, router, Router, Link } from 'engine';
import { hole } from 'core';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
// import { KgSearchBox } from 'components/search';
import { IndexHotLinks } from 'components/widgets';
import { Auth } from 'hoc';
import styles from './page.less';

const tc = applyTheme(styles);

console.log('>>>>>>>>>>>>> IndexPageIndexPageIndexPageIndexPageIndexPage',);

@connect(({ app }) => ({ app }))
@Auth
// @Router
class IndexPage extends Component {
  static displayName = 'IndexPage';

  constructor(props) {
    super(props);
  }

  // componentWillUnmount() {
  //   this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  // };

  onSearch = ({ query }) => {
    if (query && query.trim() !== '') {
      router.push(`/${sysconfig.SearchPagePrefix}/${query}/0/20`);
    }
  };

  render() {
    const bannerZone = theme.index_bannerZone;

    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>

        {bannerZone && bannerZone.length > 0 && bannerZone.map(elm => elm)}

        <div className={styles.search}>
          {/*// TODO use localStorage to search.*/}
          {/*<Spinner loading={true} type="dark" />*/}

          {/*<KgSearchBox size="huge" className={styles.searchBox} onSearch={this.onSearch} />*/}
        </div>

        {hole.fill(theme.index_centerZone, [
          <IndexHotLinks
            key={100}
            links={sysconfig.IndexPage_QuickSearchList}
            urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
          />,
        ], { k: 124 })}

        {/*{centerZone && centerZone.length > 0 && centerZone.map(elm => elm)}*/}

      </Layout>
    );
  }
}

export default engine.router(IndexPage);
