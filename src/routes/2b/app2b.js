/**
 * Created by yangyanmei on 17/8/12.
 */
import React from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import NProgress from 'nprogress';
import { TobLayout } from '../../components/index';
import { sysconfig } from '../../systems/index';
import { classnames, config } from '../../utils/index';
import '../../themes/index.less';
import './app2b.less';

const { prefix } = config;

const { Header2b, styles } = TobLayout;
let lastHref;

const App2b = ({ children, location, dispatch, app, loading }) => {
  const { user, darkTheme, navOpenKeys, roles } = app;
  const href = window.location.href;

  if (lastHref !== href) {
    NProgress.start();
    if (!loading.global) {
      NProgress.done();
      lastHref = href;
    }
  }

  const headerProps = {
    user,
    roles,
    location,
    navOpenKeys,
    logout() {
      dispatch({ type: 'app/logout' });
    },
  };

  // const breadProps = {
  //   menu,
  // };

  const siderProps = {
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

  const { iconFontJS, iconFontCSS } = config;

  const mainMarginLeft = sysconfig.ShowSideMenu ? 188 : 0;

  // TODO Config Helmet out of app.js
  return (
    <div>
      <Helmet>
        <title>后台管理系统</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>

      <div className={classnames(styles.layout)}>
        <Header2b {...headerProps} />
        <div className={styles.main} style={{ marginLeft: mainMarginLeft }}>
          <div className={styles.container}>
            <div className={styles.content}>
              {/* <Bread {...breadProps} location={location} /> */}
              {children}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};


export default connect(({ app, loading }) => ({ app, loading }))(App2b);
