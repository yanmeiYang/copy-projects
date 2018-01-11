import React, { Component } from 'react';
import { Page, connect, router } from 'engine';
import { Hole } from 'components/core';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { KgSearchBox } from 'components/search';
import { IndexHotLinks } from 'components/widgets';
import { Auth } from 'hoc';
import styles from './page.less';

const tc = applyTheme(styles);

@Page()
@connect(({ app }) => ({ app }))
@Auth
export default class IndexPage extends Component {
  static displayName = 'IndexPage';

  constructor(props) {
    super(props);
  }

  // componentWillUnmount() {
  //   this.props.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  // };

  onSearch = ({ query }) => {
    if (query && query.trim() !== '') {
      router.push(`/${sysconfig.SearchPagePrefix}/${query}/0/20`);
    }
  };

  render() {
    const bannerZone = theme.index_bannerZone;

    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}
              showFooter={false}>

        {bannerZone && bannerZone.length > 0 && bannerZone.map(elm => elm)}

        <div className={styles.search}>
          <KgSearchBox size="huge" className={styles.searchBox} onSearch={this.onSearch} />
        </div>

        <Hole
          fill={theme.index_centerZone}
          defaults={[
            <IndexHotLinks
              key={100}
              links={sysconfig.IndexPage_QuickSearchList}
              urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
            />,
          ]}
        />

      </Layout>
    );
  }
}
