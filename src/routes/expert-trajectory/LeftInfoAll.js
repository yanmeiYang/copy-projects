import React from 'react';
import { connect } from 'dva';
import styles from './LeftInfoAll.less';
import classnames from 'classnames';
import * as profileUtils from '../../utils/profile-utils';
import HindexGraph from './h-index-graph-little';

class LeftInfoAll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    ddd: 'dfs',
  };

  componentDidMount() {
    this.hindex = [];
  }

  componentWillReceiveProps() {
    // if (nextProps.expertTrajectory.hindex !== this.props.expertTrajectory.hindex) {
    //   this.setState({ ddd: '999' });
    // }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.expertTrajectory.hindex !== this.props.expertTrajectory.hindex) {
      this.hindex = nextProps.expertTrajectory.hindex;
      return true;
    }
    // if (nextState.ddd !== this.state.ddd) {
    //   console.log("hahahahha====")
    //   return true;
    // }
    return false;
  }

  render() {
    let count;
    let hindexSum = 0;
    let avg;
    if (this.hindex){
      count = this.hindex.length;
      for ( let i = 0 ; i < count; i += 1) {
        hindexSum += parseInt(this.hindex[i]);
      }
      avg = hindexSum/ count;
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
          <span className={styles.count}>{hindexSum}</span> <br />
          平均值：
          <span className={styles.count}>{avg}</span>
        </div>
        <div className={styles.statistics}>
          专家：
          <span className={styles.count} style={{ marginRight: 0 }}>{count}</span> 人
        </div>

        <div>
          <HindexGraph hindex={this.hindex} avg={avg} count={count} />
        </div>
      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))(LeftInfoAll);
