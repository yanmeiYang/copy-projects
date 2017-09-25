/**
 * Created by Administrator on 2017/8/3.
 */

import React from 'react';
import styles from './h-index-graph.less';

function group(hindex) {
  let g = 0;
  switch (true) {
    case hindex >= 0 && hindex < 10:
      g = 0;
      break;
    case hindex >= 10 && hindex < 20:
      g = 1;
      break;
    case hindex >= 20 && hindex < 40:
      g = 2;
      break;
    case hindex >= 40 && hindex < 60:
      g = 3;
      break;
    case hindex >= 60 :
      g = 4;
      break;
    default:
      g = 0;
  }
  return g;
}

class HindexGraph extends React.PureComponent {
  render() {
    const persons = this.props.persons;
    const avg = this.props.avg;
    const groupNumTemp = [0, 0, 0, 0, 0];
    persons.map((person) => {
      if (person.indices) {
        const g = group(person.indices.h_index);
        groupNumTemp[g] += 1;
      } else {
        const g = group(person.hindex);
        groupNumTemp[g] += 1;
      }
      return groupNumTemp;
    });
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
          <div className={styles.itema}>&lt;10</div>
          <div className={styles.item1} style={{ width: groupHeight[0] }}>{groupNumTemp[0]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>10~20</div>
          <div className={styles.item2} style={{ width: groupHeight[1] }}>{groupNumTemp[1]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>20~40</div>
          <div className={styles.item3} style={{ width: groupHeight[2] }}>{groupNumTemp[2]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>40~60</div>
          <div className={styles.item4} style={{ width: groupHeight[3] }}>{groupNumTemp[3]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema}>&gt;60</div>
          <div className={styles.item5} style={{ width: groupHeight[4] }}>{groupNumTemp[4]}</div>
        </div>
      </div>
    );

    // console.log("persons is ", this.props.persons);
  }
}

export default HindexGraph;

