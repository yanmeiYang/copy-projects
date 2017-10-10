/**
 * Created by Administrator on 2017/8/3.
 */

import React from 'react';
import styles from './h-index-grapg-little.less';

function group(hindex) {
  let g = 0;
  switch (true) {
    case hindex >= 0 && hindex < 45:
      g = 0;
      break;
    case hindex >= 45 && hindex < 55:
      g = 1;
      break;
    case hindex >= 55 && hindex < 70:
      g = 2;
      break;
    case hindex >= 70 && hindex < 90:
      g = 3;
      break;
    case hindex >= 90 :
      g = 4;
      break;
    default:
      g = 0;
  }
  return g;
}

class HindexGraph extends React.PureComponent {
  render() {
    const hindex = this.props.hindex;
    const groupNumTemp = [0, 0, 0, 0, 0];
    if (typeof (hindex) !== 'undefined') {
      hindex.forEach((hindex1) => {
        const g = group(hindex1);
        groupNumTemp[g] += 1;
        return groupNumTemp;
      });
    }
    const groupNum = JSON.parse(JSON.stringify(groupNumTemp));
    groupNum.sort((a, b) => b - a);
    const number = groupNum[0];
    const height = 180 * 0.95;
    const groupHeight = {};
    for (const i in groupNumTemp) {
      if (groupNumTemp[i] !== 0) {
        groupHeight[i] = (groupNumTemp[i] / number) * height;
      } else {
        groupHeight[i] = 0;
      }
    }

    return (
      <div className={styles.container}>
        <div className={styles.container1}>
          <div className={styles.itema}>&lt;45</div>
          <div className={styles.item1} style={{ width: groupHeight[0] }}>{groupNumTemp[0]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>45~55</div>
          <div className={styles.item2} style={{ width: groupHeight[1] }}>{groupNumTemp[1]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>55~70</div>
          <div className={styles.item3} style={{ width: groupHeight[2] }}>{groupNumTemp[2]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>70~90</div>
          <div className={styles.item4} style={{ width: groupHeight[3] }}>{groupNumTemp[3]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>&gt;90</div>
          <div className={styles.item5} style={{ width: groupHeight[4] }}>{groupNumTemp[4]}</div>
        </div>
      </div>
    );

    // console.log("persons is ", this.props.persons);
  }
}

export default HindexGraph;

