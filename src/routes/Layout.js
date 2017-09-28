/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { PureComponent, Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { Layout as LayoutComponent } from 'antd';
import { sysconfig, applyTheme } from 'systems';
import { Header, Navigator } from 'components/Layout';
import styles from './Layout.less';

const { Sider, Content, Footer } = LayoutComponent;

const { theme } = sysconfig;
const tc = applyTheme(styles);

require(`themes/theme-${theme.themeName}.less`); // basic themes，:global css only

@connect(({ app }) => ({ app }))
export default class Layout extends Component {
  static displayName = 'Layout';

  static propTypes = {
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

    // props
    query: PropTypes.string,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    showHeader: true,
    showNavigator: sysconfig.Layout_HasNavigator,
    sidebar: theme.sidebar,
    footer: theme.footer,
  };

  render() {
    // console.count('>>>>>>>>>> App Render'); // TODO performance
    const { logoZone, searchZone, infoZone, sidebar, footer } = this.props;
    const { contentClass, showHeader, showNavigator } = this.props;
    const { query, onSearch } = this.props;
    const { dispatch, app } = this.props;
    const { user, roles } = app;

    const headerOptions = {
      logoZone, searchZone, infoZone, query, onSearch,
      logout() {
        dispatch({ type: 'app/logout' });
      },
    };
    const navigatorOptions = { query, navis: sysconfig.HeaderSearch_TextNavi };

    const href = window.location.href;

    return (
      <LayoutComponent className={tc(['layout'])}>

        <Helmet>
          <title>{sysconfig.PageTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={`/sys/${sysconfig.SYSTEM}/favicon.ico`} type="image/x-icon" />

          <link rel="stylesheet" href="/fa/css/font-awesome.min.css" />

          {/*{href.indexOf('/lab/knowledge-graph-widget') > 0 &&*/}
          {/*<link rel="stylesheet"*/}
          {/*href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />*/}
          {/*}*/}

          {(href.indexOf('/expert-map') > 0) &&
          <script
            type="text/javascript"
            src="https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20170713160001" />}

          {(href.indexOf('/expert-map') > 0) &&
          <script
            src="https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1"
            charSet="utf-8" async defer />}

          {href.indexOf('/expert-googlemap') > 0 &&
          <script
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0"
            async defer />}

          {href.indexOf('/expert-heatmap') > 0 &&
          <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/3.7.1/echarts.js" />}

        </Helmet>

        {showHeader && <Header {...headerOptions} />}
        {showNavigator && <Navigator {...navigatorOptions} />}

        <LayoutComponent>

          {/* -------- Left Side Bar -------- */}

          {sysconfig.Layout_HasSideBar &&
          <Sider className={tc(['sider'])}>
            {sidebar && sidebar.length > 0 && sidebar.map(elm => elm)}
          </Sider>}

          {/* -------- Main Content -------- */}

          <Content className={tc(['content'], [contentClass])}>
            {this.props.children}
          </Content>

          {/*<Sider>right sidebar</Sider>*/}
        </LayoutComponent>

        {/* -------- Footer -------- */}

        <Footer className={tc(['footer'])}>
          {footer}
        </Footer>

      </LayoutComponent>
    );
  }
}
