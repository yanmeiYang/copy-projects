/* eslint-disable react/require-default-props */
import React from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types'
import NProgress from 'nprogress';
import { routerRedux, withRouter } from 'dva/router';
import { Layout } from 'components';
import { sysconfig } from 'systems';
import { classnames, config, getMenusByUser } from 'utils';
import 'themes/index.less';
import './app.less';

const { prefix } = config;

const { Header, Footer, Sider, styles } = Layout;
let lastHref;

const App = ({ children, location, dispatch, app, loading }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, roles } = app;
  const href = window.location.href;
  const menu = getMenusByUser(user, roles)[0];

  if (lastHref !== href) {
    NProgress.start();
    if (!loading.global) {
      NProgress.done();
      lastHref = href;
    }
  }

  const headerProps = {
    menu,
    user,
    siderFold,
    roles,
    location,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' });
    },
    logout() {
      dispatch({ type: 'app/logout' });
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' });
    },
    changeOpenKeys(openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    },
  };

  // const breadProps = {
  //   menu,
  // };

  const siderProps = {
    menu,
    siderFold,
    roles,
    darkTheme,
    location,
    navOpenKeys,
    changeTheme() {
      dispatch({ type: 'app/switchTheme' });
    },
    changeOpenKeys(openKeys) {
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys));
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    },
  };

  if (config.openPages && config.openPages.indexOf(location.pathname) > -1) {
    return <div>{children}</div>;
  }

  // Header 中的搜索
  const onSearch = (data) => {
    if (app.onHeaderSearch) {
      app.onHeaderSearch(data);
    } else {
      onSearchDefault(data);
    }
  };

  // Header 中的搜索默认会去搜索结果页面. TODO 如何覆盖
  const onSearchDefault = (data) => {
    const newOffset = data.offset || 0;
    const newSize = data.size || 30;
    dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}`,
    }));
  };

  const { iconFontJS, iconFontCSS } = config;

  const mainMarginLeft = sysconfig.Layout_HasSideBar ? 188 : 0;

  const { showFooter } = app;

  // TODO Config Helmet out of app.js
  return (
    <div>

      <Helmet>
        <title>{sysconfig.PageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={`/sys/${sysconfig.SYSTEM}/favicon.ico`} type="image/x-icon" />

        <link rel="stylesheet" href="/fa/css/font-awesome.min.css" />

        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}

        {href.indexOf('/lab/knowledge-graph-widget') > 0 &&
        <link rel="stylesheet" href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />
        }

        {(href.indexOf('/expert-map') > 0) &&
        <script type="text/javascript"
                src="https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20170713160001" />}

        {(href.indexOf('/expert-map') > 0) &&
        <script src="https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1"
                charSet="utf-8" async defer />}

        {/*{href.indexOf('/expert-googlemap') > 0 &&*/}
        {/*<script src="../../expertmap/googlemap/markerclusterer.js" />}*/}

        {href.indexOf('/expert-googlemap') > 0 &&
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0"
          async defer />}

        {href.indexOf('/expert-heatmap') > 0 &&
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/echarts/3.7.1/echarts.js" />}

      </Helmet>

      <div className={classnames(styles.layout)}>
        <Header {...headerProps} onSearch={onSearch} />
        {sysconfig.Layout_HasSideBar && !isNavbar ?
          <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''
        }
        <div
          className={classnames(styles.main, sysconfig.Layout_HasSideBar && styles.main_margin_188)}>
          <div className={styles.container}>
            <div className={styles.content}>
              {/* <Bread {...breadProps} location={location} /> */}
              {children}
            </div>
          </div>
        </div>

        {showFooter && sysconfig.ShowFooter && <Footer />}

      </div>

    </div>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
};

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App));
