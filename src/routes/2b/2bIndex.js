/**
 *  Created by BoGao on 2017-08-13;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './2bIndex.less';
import { sysconfig } from '../../systems';
import { RequireGod } from '../../hoc';

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

  render() {
    return (
      <div className="content-inner" style={{ maxWidth: '1228px' }}>
        AMiner 2b system config homepage.
        <br />
        <Link to="/2b/email-template">Email Template 设置</Link>, <br />

        TODO quick choose system.<br />
        TODO on error redirect.<br />
      </div>
    );
  }
}
