import React from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import NProgress from 'nprogress';
import { Layout } from '../components';
import { classnames, config, menu } from '../utils';
import '../themes/index.less';
import './app.less';

const { prefix } = config;

const { Header, Footer, Sider, styles } = Layout;
let lastHref;

const App = ({ children, location, dispatch, app, loading }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys } = app;
  const href = window.location.href;

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
  }

  if (config.openPages && config.openPages.indexOf(location.pathname) > -1) {
    return <div>{children}</div>;
  }

  const { iconFontJS, iconFontCSS, logo } = config;

  return (
    <div>
      <Helmet>
        <title>CCF 专家库</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
        {href.indexOf('/lab/knowledge-graph-widget') > 0 &&
        <link rel="stylesheet" href="https://cdn.rawgit.com/novus/nvd3/v1.8.1/build/nv.d3.css" />
        }

      </Helmet>
      <div className={classnames(styles.layout)}>
        <Header {...headerProps} />
        {!isNavbar ?
          <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''
        }
        <div className={styles.main}>
          <div className={styles.container}>
            <div className={styles.content}>
              {/*<Bread {...breadProps} location={location} />*/}
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </div>

    </div>
  );
};


export default connect(({ app, loading }) => ({ app, loading }))(App);
