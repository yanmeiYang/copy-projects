import React from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import NProgress from 'nprogress';
import { Link, routerRedux } from 'dva/router';
import { Layout } from '../components';
import { sysconfig } from '../systems';
import { classnames, config, getMenusByUser } from '../utils';
import '../themes/index.less';
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
  }

  const { iconFontJS, iconFontCSS, logo } = config;

  const mainMarginLeft = sysconfig.ShowSideMenu ? 188 : 0;

  return (
    <div>

      <Helmet>
        <title>{sysconfig.PageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}

        {href.indexOf('/lab/knowledge-graph-widget') > 0 &&
        <link rel="stylesheet" href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />
        }

        {href.indexOf('/KnowledgeGraphPage') > 0 &&
        <script src="http://code.jquery.com/jquery-1.10.2.min.js" />}

        {href.indexOf('/KnowledgeGraphPage') > 0 &&
        <script src="http://d3js.org/d3.v3.min.js" />}

        {href.indexOf('/expert-map') > 0 &&
        <script type="text/javascript" src="https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20170713160001"></script>}

        {href.indexOf('/expert-map')>0 &&
        <script src="https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1" charset="utf-8" async defer></script>}

        {href.indexOf('/expert-googlemap')>0 &&
        <script src="../../expertmap/googlemap/markerclusterer.js"></script>}

        {href.indexOf('/expert-googlemap')>0 &&
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAnNB6SXL5JJ0NU8j-Ay8pnnmRC50vsrtw" async defer></script>}

      </Helmet>

      <div className={classnames(styles.layout)}>
        <Header {...headerProps} onSearch={onSearch} />
        {sysconfig.ShowSideMenu && !isNavbar ?
          <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''
        }
        <div className={styles.main} style={{ marginLeft: mainMarginLeft }}>
          <div className={styles.container}>
            <div className={styles.content}>
              {/* <Bread {...breadProps} location={location} /> */}
              {children}
            </div>
          </div>
        </div>
        {sysconfig.ShowFooter && <Footer />}
      </div>

    </div>
  );
};


export default connect(({ app, loading }) => ({ app, loading }))(App);
