/**
 * Created by Administrator on 2017/8/3.
 */

import React from 'react';
import styles from './h-index-graph.less';
/**
 * @param param
 *
 */
class HindexGraph extends React.Component {
  render() {
    console.log('refresh person list ');
    return (
      <div className={styles.container}>
        <div className={styles.item1}>1</div>
        <div className={styles.item2}>2</div>
        <div className={styles.item1}>3</div>
        <div className={styles.item2}>4</div>
        <div className={styles.item1}>5</div>
      </div>
    );

    // console.log("persons is ", this.props.persons);
  }
}

export default HindexGraph;

