/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import NProgress from 'nprogress';
import { Layout as LayoutComponent, Affix, Button, Popover } from 'antd';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { hole, classnames, config } from 'utils';
import { Header, Navigator, Feedback } from 'components/Layout';
import { ErrorBoundary } from 'components';
import styles from './Layout.less';

const { iconFontJS, iconFontCSS, logo } = config;
const { Sider, Content, Footer } = LayoutComponent;

const tc = applyTheme(styles);
let lastHref;

require(`themes/theme-${theme.themeName}.less`); // basic themes，:global css only

@connect(({ app, loading }) => ({ app, loading }))
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
    showSidebar: sysconfig.Layout_HasSideBar,
    sidebar: theme.sidebar,
    footer: theme.footer,
    fixAdvancedSearch: false, // TODO use localStorage to cache user habits.
    showFeedback: sysconfig.GLOBAL_ENABLE_FEEDBACK,
  };

  componentDidMount() {
    // TODO 这个统计有问题呀 ????
    if (sysconfig.googleAnalytics) {
      const { user } = this.props.app;
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
    // console.count('>>>>>>>>>> App Render'); // TODO performance
    const { sidebar, footer } = this.props;
    const { contentClass, showHeader, showNavigator, showSidebar, showFeedback } = this.props;
    const { dispatch, app, loading } = this.props;

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
      logoZone, searchZone, infoZone, query, onSearch, fixAdvancedSearch, disableAdvancedSearch,
      logout() {
        dispatch({ type: 'app/logout' });
      },
    };
    const navigatorOptions = { query, navis: sysconfig.HeaderSearch_TextNavi };

    const title = pageTitle || (pageSubTitle ? `${sysconfig.PageTitle} | ${pageSubTitle}` : sysconfig.PageTitle);

    return (
      <LayoutComponent className={tc(['layout'])}>
        <Helmet>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={`/sys/${sysconfig.SYSTEM}/favicon.ico`} type="image/x-icon" />

          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}

          <link rel="stylesheet" href="/fa/css/font-awesome.min.css" />

          {this.headerResourcesArray && this.headerResourcesArray.length > 0 &&
          this.headerResourcesArray.map((item) => {
            console.log('|||  ', item);
            return item;
          })}

          {/*{href.indexOf('/lab/knowledge-graph-widget') > 0 &&*/}
          {/*<link rel="stylesheet"*/}
          {/*href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />*/}
          {/*}*/}

          {/*{(href.indexOf('/expert-map') > 0) &&*/}
          {/*<script*/}
          {/*type="text/javascript"*/}
          {/*src="https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20170713160001" />}*/}

          {/*{(href.indexOf('/expert-map') > 0) &&*/}
          {/*<script*/}
          {/*src="https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1"*/}
          {/*charSet="utf-8" async defer />}*/}

          {/*{href.indexOf('/expert-map') > 0 &&*/}
          {/*<script*/}
          {/*src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0"*/}
          {/*async defer />}*/}

          {/*{false && href.indexOf('/expert-heatmap') > 0 &&*/}
          {/*<script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/3.7.1/echarts.js" />}*/}

          {/*{(href.indexOf('/expert-trajectory') > 0) &&*/}
          {/*<script*/}
          {/*type="text/javascript"*/}
          {/*src="https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20170713160001" />}*/}

          {/*{(href.indexOf('/expert-trajectory') > 0) &&*/}
          {/*<script*/}
          {/*src="https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1"*/}
          {/*charSet="utf-8" async defer />}*/}

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
              {this.props.children}
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
