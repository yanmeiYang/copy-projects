/**
 * Created by Administrator on 2017/8/9.
 */
import React from 'react';
import { connect } from 'dva';
import styles from './RightInfoZoneAll.less';
import * as profileUtils from '../../utils/profile_utils';
import { HindexGraph } from '../../components/widgets';

class RightInfoZoneAll extends React.PureComponent {

  componentDidMount() {
  }

  componentWillReceiveProps() {

  }

  render() {
    const count = this.props.count;
    const hIndexSum = this.props.hIndexSum;
    const avg = this.props.avg;
    const persons = this.props.persons;
    if (!persons) {
      return <div />;
    }
    return(
      <div className="rizPersonInfo">
        <div className="name bg">
          <h2 className="section_header">Cluster of {count} experts.</h2>
        </div>
        <div className="info bg">
          <span>Sum of H-index: {hIndexSum}</span>
          <span>Avg of H-index: {avg}</span>
        </div>
        <div>
          <HindexGraph persons={persons} />
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZoneAll);
