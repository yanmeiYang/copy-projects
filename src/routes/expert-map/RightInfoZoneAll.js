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
    const count = this.props.count;
    const avg = this.props.avg;
    const persons = this.props.persons;
    if (!persons) {
      return <div />;
    }
    return (
      <div className={styles.rizAll}>
        <div className={styles.name}>
          {/*<h2 className={styles.section_header}>Show {count} experts in map.</h2>*/}
          <span alt="" className={classnames('icon', styles.titleIcon)} />
          H-index分布
        </div>
        <div className={styles.statistics}>
          总值：
          <span className={styles.count}>{count * avg}</span>
          平均值：
          <span className={styles.count}>{avg}</span>
        </div>
        <div>
          <HindexGraph persons={persons} avg={avg} count={count} />
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZoneAll);
