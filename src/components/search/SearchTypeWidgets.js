import React from 'react';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import styles from './SearchTypeWidgets.less';


@connect()
export default class SearchTypeWidgets extends React.PureComponent {

  render() {
    return (
      <div className="naviLine" style={{ paddingLeft: sysconfig.Header_LogoWidth }}>

      </div>
    );
  }
}
