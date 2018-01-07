/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { resRoot } from 'core';
import { engine, connect, renderChildren } from 'engine';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
// import NProgress from 'nprogress';
import { Layout as LayoutComponent } from 'antd';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { config } from 'utils';
import { hole } from 'core';
import { Header, Navigator } from 'components/headers';
import { Feedback } from 'components/widgets';
import { ErrorBoundary } from 'components/core';
import styles from './Layout.less';

const { Sider, Content, Footer } = LayoutComponent;

const tc = applyTheme(styles);

engine.model(require('models/app').default);

// let lastHref;

@connect(({ app, loading }) => ({ app: { user: app.user, roles: app.roles }, loading }))
export default class Layout extends Component {
  static displayName = 'Layout';

  static propTypes = {
    // Page Title
    pageTitle: PropTypes.string,
    pageSubTitle: PropTypes.string,

    // Header
    logoZone: PropTypes.array,
    searchZone: PropTypes.array,
    infoZone: PropTypes.array,

    navigator: PropTypes.element,
    navigatorItems: PropTypes.array,
    sidebar: PropTypes.array,
    footer: PropTypes.element,

    contentClass: PropTypes.string,
    showHeader: PropTypes.bool,
    showNavigator: PropTypes.bool,
    showSidebar: PropTypes.bool,
    showFeedback: PropTypes.bool,

    fixAdvancedSearch: PropTypes.bool, // 是否固定是三个框的高级搜索
    disableAdvancedSearch: PropTypes.bool, // 禁止高级搜索

    // props
    query: PropTypes.string,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    showHeader: sysconfig.Layout_ShowHeader,
    showNavigator: sysconfig.Layout_HasNavigator,
    navigatorItems: sysconfig.HeaderSearch_TextNavi,
    showSidebar: sysconfig.Layout_HasSideBar,
    sidebar: theme.sidebar,
    footer: theme.footer,
    fixAdvancedSearch: false, // TODO use localStorage to cache user habits.
    showFeedback: sysconfig.GLOBAL_ENABLE_FEEDBACK,
  };

  componentDidMount() {
    // TODO 这个统计有问题呀 ???? 提取成单独的 Component
    if (sysconfig.googleAnalytics) {
      const { user } = this.props.app || {};
      ReactGA.initialize(sysconfig.googleAnalytics, {
        gaOptions: { userId: (user && user.id) || '' },
      });
      ReactGA.pageview(window.location.href);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { headerResources } = nextProps.app;
    if (
      (headerResources !== this.props.app.headerResources) ||
      (headerResources && !this.headerResourcesArray)
    ) {
      this.headerResourcesArray = [];
      if (headerResources) {
        headerResources.forEach((k, v) => {
          this.headerResourcesArray.push(...k);
        });
      }
    }
  };

  render() {
    // console.log('>>>>>>>>>> App Render:', this.props); // TODO performance
    const { sidebar, footer, navigatorItems } = this.props;
    const { contentClass, showHeader, showNavigator, showSidebar, showFeedback } = this.props;
    const { dispatch, loading } = this.props;

    // const { href } = window.location;
    // if (lastHref !== href) {
    //   NProgress.start();
    //   if (!loading.global) {
    //     NProgress.done();
    //     lastHref = href;
    //   }
    // }

    const { logoZone, searchZone, infoZone, fixAdvancedSearch, disableAdvancedSearch } = this.props;
    const { pageTitle, pageSubTitle } = this.props;
    const { query, onSearch } = this.props;

    const headerOptions = {
      key: 'header',
      logoZone, searchZone, infoZone, query, onSearch, fixAdvancedSearch, disableAdvancedSearch,
      logout() {
        dispatch({ type: 'app/logout' });
      },
    };
    const navigatorOptions = { key: 'navigator', query, navis: navigatorItems };

    const title = pageTitle || (pageSubTitle ? `${sysconfig.PageTitle} | ${pageSubTitle}` : sysconfig.PageTitle);

    return engine.withIntl(
      <LayoutComponent className={tc(['layout'])}>
        <Helmet>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href={`${resRoot}/sys/${sysconfig.SYSTEM}/favicon.ico`}
                rel="icon" type="image/x-icon" />

          <script src={`${resRoot}/iconfont.js`} />
          <link rel="stylesheet" href={`${resRoot}/iconfont.css`} />
          <link rel="stylesheet" href={`${resRoot}/fa/css/font-awesome.min.css`} />

          {this.headerResourcesArray || false}

          {/*{href.indexOf('/lab/knowledge-graph-widget') > 0 &&*/}
          {/*<link rel="stylesheet"*/}
          {/*href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />*/}
          {/*}*/}

        </Helmet>

        {/*{showHeader && <Header {...headerOptions} />}*/}
        {showNavigator && <Navigator {...navigatorOptions} />}

        <LayoutComponent>

          {/* -------- Left Side Bar -------- */}

          {/*{showSidebar &&*/}
          {/*<Sider className={tc(['sider'])}>*/}
          {/*{hole.fill(sidebar)}*/}
          {/*</Sider>}*/}

          {/* -------- Main Content -------- */}

          <Content className={tc(['content'], [contentClass])}>
            <ErrorBoundary>
              {renderChildren(this.props.children)}
            </ErrorBoundary>
          </Content>

          {/*<Sider>right sidebar</Sider>*/}
        </LayoutComponent>


        {/* -------- Footer -------- */}

        {/*<Footer className={tc(['footer'])}>*/}
        {/*{footer}*/}
        {/*</Footer>*/}

        {/*{showFeedback && <Feedback />}*/}

      </LayoutComponent>
    );
  }
}
