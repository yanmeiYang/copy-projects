/**
 * Created by Administrator on 2017/8/9.
 */
import React from 'react';
import { connect } from 'dva';
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
      <div className="rizAll">
        <div className="name bg">
          <h2 className="section_header">Show {count} experts in map.</h2>
        </div>
        <div>
          <HindexGraph persons={persons} avg={avg} />
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZoneAll);
