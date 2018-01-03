import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { hole } from 'core';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { KgSearchBox } from 'components/search';
import { IndexHotLinks } from 'components/widgets';
import { Auth } from 'hoc';
import styles from './index.less';

// console.log('--------------------------------');
// console.log(hole);
// console.log(hole.fill);
// console.log(sysconfig);
// console.log(theme, applyTheme);
// console.log(IndexHotLinks);
// console.log(Auth);
// console.log('--------------------------------');


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
          {/*// TODO use localStorage to search.*/}
          {/*<Spinner loading={true} type="dark" />*/}

          <KgSearchBox size="huge" className={styles.searchBox} onSearch={this.onSearch} />
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
