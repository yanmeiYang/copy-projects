/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect, renderChildren } from 'engine';
import withIntl from 'engine/i18n';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import NProgress from 'nprogress';
import { Layout as LayoutComponent } from 'antd';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { imCompare } from 'utils/compare';
import { hole } from 'core';
import { Header, Navigator } from 'components/headers';
import { Feedback } from 'components/widgets';
import { Hole, ErrorBoundary } from 'components/core';
import styles from './Layout.less';

const { Sider, Content, Footer } = LayoutComponent;
const tc = applyTheme(styles);
const debug = require('debug')('aminer:engine');

let lastHref;

// @Models([require('models/app')])
@connect(({ app, loading }) => ({ app, loading }))
export default class Layout extends PureComponent {
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

  // deprecated methods to require resources.
  componentWillReceiveProps = (nextProps) => {
    console.log('===========', nextProps.app.get('headerResources'));
    const headerResources = nextProps.app && nextProps.app.get('headerResources');
    if (imCompare(this.props, nextProps, 'app', 'headerResources')
      || (headerResources && !this.headerResourcesArray)) {
      this.headerResourcesArray = [];
      if (headerResources) {
        console.log('>>>>>>-0-0-0-0-0-0-0-0-', headerResources);
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

    const { href } = window.location;
    if (lastHref !== href) {
      NProgress.start();
      if (!loading.global) {
        NProgress.done();
        lastHref = href;
      }
    }

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

    return withIntl(
      <LayoutComponent className={tc(['layout'])}>
        <Helmet>
          <title>{title}</title>
          {this.headerResourcesArray || false}
        </Helmet>

        {showHeader && <Header {...headerOptions} />}
        {showNavigator && <Navigator {...navigatorOptions} />}

        <LayoutComponent>

          {/* -------- Left Side Bar -------- */}

          {showSidebar &&
          <Sider className={tc(['sider'])}>
            {hole.fill(sidebar)}
          </Sider>}

          {/* -------- Main Content -------- */}

          <Content className={tc(['content'], [contentClass])}>
            <ErrorBoundary>
              {renderChildren(this.props.children)}
            </ErrorBoundary>
          </Content>

          {/*<Sider>right sidebar</Sider>*/}
        </LayoutComponent>

        {/* -------- Footer -------- */}

        <Footer className={tc(['footer'])}>
          {footer}
        </Footer>

        {showFeedback && <Feedback />}

      </LayoutComponent>
    );
  }
}
