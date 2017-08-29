/**
 *  Created by BoGao on 2017-08-13;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { routerRedux, Link } from 'dva/router';
import styles from './2bIndex.less';
import { sysconfig } from '../../systems';
import { RequireGod } from '../../hoc';
import { system } from '../../utils';

@connect(({ app }) => ({ app }))
@RequireGod
export default class SystemConfig extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

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
    // localStorage.setItem('')
  };

  render() {
    return (
      <div className="content-inner" style={{ maxWidth: '1228px' }}>
        AMiner 2b system config homepage.
        <br />
        <Link to="/2b/email-template">Email Template 设置</Link>, <br />

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
        TODO quick choose system.<br />
        TODO on error redirect.<br />
      </div>
    );
  }
}
