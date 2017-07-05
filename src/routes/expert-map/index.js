/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import ExpertMap from './expert-map.js';
import styles from './index.less';

class ExpertMapPage extends React.Component {

  showtype = (e) => {
    const typeid = e.target && e.target.getAttribute('data');
    const tli = document.getElementById('menu0').getElementsByTagName('li');
    ExpertMap.test1();
    let currentclass = '';
    for (let i = 0; i < tli.length; i += 1) {
      if (tli[i].className !== '') {
        currentclass = tli[i].className;
      }
    }
    for (let i = 0; i < tli.length; i += 1) {
      if (i === typeid) {
        tli[i].className = currentclass;
      } else {
        tli[i].className = '';
      }
    }
  };

  render() {
    return (
      <div className={styles.content}>
        <h1>Expert Map</h1>
        <ExpertMap />
      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(ExpertMapPage);
