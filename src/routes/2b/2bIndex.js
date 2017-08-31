/**
 *  Created by BoGao on 2017-08-13;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { routerRedux, Link } from 'dva/router';
import styles from './2bIndex.less';
import { sysconfig } from '../../systems';
import locales from '../../locales';
import { RequireGod } from '../../hoc';
import { system } from '../../utils';
import { saveLocale } from '../../utils/locale';

@connect(({ app }) => ({ app }))
@RequireGod
export default class SystemConfig extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  componentWillMount() {
    this.props.dispatch({ type: 'app/hideHeaderSearch' });
  }

  // componentDidMount() {
  // }
  //
  // shouldComponentUpdate(nextProps) {
  // }
  //
  // componentDidUpdate() {
  // }

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
          <Link to="/2b/email-template">Email Template 设置</Link>, <br />

        </div>

        <ul>
          <li>
            <Link to="/rcd">Recommendation</Link>
          </li>
        </ul>

        TODO quick choose system.<br />
        TODO on error redirect.<br />
      </div>
    );
  }
}
