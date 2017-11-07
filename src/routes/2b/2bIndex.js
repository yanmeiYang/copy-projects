/**
 *  Created by BoGao on 2017-08-13;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { routerRedux, Link } from 'dva/router';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { RequireGod } from 'hoc';
import { config, system } from 'utils';
import { saveLocale } from 'utils/locale';
import styles from './2bIndex.less';
import locales from '../../locales';

@connect(({ app }) => ({ app }))
@RequireGod
export default class SystemConfig extends React.Component {

  onChangeSystem = (sys) => {
    const { user } = this.props.app;
    console.log('on change sys', sys);
    system.saveSystem(sys, user);
    window.location.reload();
  };

  onChangeLocale = (locale) => {
    saveLocale(sysconfig.SYSTEM, locale);
    window.location.reload();
  };

  render() {
    return (
      <Layout searchZone={[]} contentClass={styles.index2b} showNavigator={false}>

        <div className="content-inner" style={{ maxWidth: '1228px' }}>
          AMiner 2b system config homepage.

          <div className={styles.changer}>
            {system.AvailableSystems.map((sys) => {
              const options = {
                onClick: this.onChangeSystem.bind(this, sys),
              };
              // console.log('sysconfig.SYSTEM === sys: ', sysconfig.SYSTEM, sys);
              if (sysconfig.SYSTEM === sys) {
                options.type = 'primary';
              }
              return (
                <div key={sys} className={styles.sysbtn}>
                  <Button {...options}>
                    <img src={`/sys/${sys}/favicon.ico`} alt={sys} />{sys}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className={styles.changer}>
            {locales && locales.map((locale) => {
              const options = {
                onClick: this.onChangeLocale.bind(this, locale),
              };
              if (sysconfig.Locale === locale) {
                options.type = 'primary';
              }
              return (
                <div key={locale} className={styles.sysbtn}>
                  <Button {...options}>{locale}</Button>
                </div>
              );
            })}
          </div>

          <div className={styles.changer}>
            <ul>
              <li><a href={config.graphqlAPI}>GraphiQL</a></li>
              <li><Link to="/2b/email-template">Email Template 设置</Link></li>
              <li><Link to="/rcd">Recommendation</Link></li>
            </ul>
          </div>

          <ul>
            <li>
              <Link to="/rcd">Recommendation</Link>
            </li>
          </ul>

          TODO quick choose system.<br />
          TODO on error redirect.<br />
        </div>
      </Layout>
    );
  }
}
