import React, { PureComponent } from 'react';
import { connect, routerRedux } from 'engine';
import { Hole } from 'components/core';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { KgSearchBox } from 'components/search';
import { IndexHotLinks } from 'components/widgets';
import { Auth } from 'hoc';
import styles from './page.less';

const tc = applyTheme(styles);

@connect(({ app }) => ({ app }))
@Auth
export default class IndexPage extends PureComponent {
  static displayName = 'IndexPage';

  onSearch = ({ query }) => {
    if (query && query.trim() !== '') {
      this.props.dispatch(routerRedux.push(`/${sysconfig.SearchPagePrefix}/${query}`));
    }
  };

  componentWillMount = () => {
    if (sysconfig.IndexPage_Redirect) {
      this.props.dispatch(routerRedux.push(sysconfig.IndexPage_Redirect));
    }
  };

  render() {
    // 首页重定向
    if (sysconfig.IndexPage_Redirect) {
      return '';
    }

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
              urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}`}
            />,
          ]}
        />

      </Layout>
    );
  }
}
