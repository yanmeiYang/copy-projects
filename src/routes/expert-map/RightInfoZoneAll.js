/**
 * Created by Administrator on 2017/8/9.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './RightInfoZoneAll.less';
import { HindexGraph } from '../../components/widgets';

class RightInfoZoneAll extends React.PureComponent {
  componentDidMount() {
  }

  componentWillReceiveProps() {

  }

  render() {
    const { persons } = this.props;
    console.log('persons:', persons);
    if (!persons) {
      return null;
    }
    let count = 0;
    let isACMFellowNumber = 0;
    let isIeeeFellowNumber = 0;
    let isChNumber = 0;
    let hIndexSum = 0;
    if (persons) {
      persons.map((person1) => {
        hIndexSum += person1.hindex;
        count += 1;
        if (person1.fellows[0] === 'acm') {
          isACMFellowNumber += 1;
        }
        if (person1.fellows[0] === 'ieee' || person1.fellows[1] === 'ieee') {
          isIeeeFellowNumber += 1;
        }
        if (person1.is_ch) {
          isChNumber += 1;
        }
        return hIndexSum;
      });
    }
    const avg = (hIndexSum / count).toFixed(0);

    return (
      <div className={styles.rizAll}>
        <div className={styles.name}>
          {/*<h2 className={styles.section_header}>Show {count} experts in map.</h2>*/}
          <span alt="" className={classnames('icon', styles.titleIcon)} />
          H-index分布
        </div>
        <div className={styles.statistics}>
          {/*总值：*/}
          {/*<span className={styles.count}>{count * avg}</span>*/}
          平均值：
          <span className={styles.count}>{avg}</span>
        </div>

        <div>
          <HindexGraph persons={persons} avg={avg} count={count} />
        </div>

        <div className={styles.statistics}>
          专家：<span className={styles.count}>{count}</span>
          <br />ACM Fellow:<span className={styles.count}>{isACMFellowNumber}</span>
          <br />IEEE Fellow:<span className={styles.count}>{isIeeeFellowNumber}</span>
          <br />华人:<span className={styles.count}>{isChNumber}</span>
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZoneAll);
