/**
 * Created by Administrator on 2017/8/3.
 */

import React from 'react';
import styles from './h-index-graph.less';
/**
 * @param param
 *
 */
class HindexGraph extends React.PureComponent {
  render() {
    const persons = this.props.persons;
    const groupNumTemp = [0, 0, 0, 0, 0];
    persons.map((person) => {
      if (person.indices) {
        const indices = person.indices;
        if (indices.h_index >= 0 && indices.h_index <= 10) {
          groupNumTemp[0] += 1;
        }
        if (indices.h_index > 10 && indices.h_index <= 20) {
          groupNumTemp[1] += 1;
        }
        if (indices.h_index > 20 && indices.h_index <= 30) {
          groupNumTemp[2] += 1;
        }
        if (indices.h_index > 30 && indices.h_index <= 40) {
          groupNumTemp[3] += 1;
        }
        if (indices.h_index > 40) {
          groupNumTemp[4] += 1;
        }
      } else {
        if (person.hindex >= 0 && person.hindex <= 10) {
          groupNumTemp[0] += 1;
        }
        if (person.hindex > 10 && person.hindex) {
          groupNumTemp[1] += 1;
        }
        if (person.hindex > 20 && person.hindex) {
          groupNumTemp[2] += 1;
        }
        if (person.hindex > 30 && person.hindex <= 40) {
          groupNumTemp[3] += 1;
        }
        if (person.hindex > 40) {
          groupNumTemp[4] += 1;
        }
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
        <div className={styles.lab}>H-index分布图</div>
        <div className={styles.container1}>
          <div className={styles.itema} style={{ width: '52px' }}>小于10</div>
          <div className={styles.item1} style={{ width: groupHeight[0] }}>{groupNumTemp[0]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema} style={{ width: '52px' }}>10~20</div>
          <div className={styles.item2} style={{ width: groupHeight[1] }}>{groupNumTemp[1]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema} style={{ width: '52px' }}>20~30</div>
          <div className={styles.item3} style={{ width: groupHeight[2] }}>{groupNumTemp[2]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema} style={{ width: '52px' }}>30~40</div>
          <div className={styles.item4} style={{ width: groupHeight[3] }}>{groupNumTemp[3]}</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.itema} style={{ width: '52px' }}>大于40</div>
          <div className={styles.item5} style={{ width: groupHeight[4] }}>{groupNumTemp[4]}</div>
        </div>
      </div>
    );

    // console.log("persons is ", this.props.persons);
  }
}

export default HindexGraph;

