/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './ExpertTrajectoryPage.less';


class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
  };

  render() {
    return (
      <div className={classnames('content-inner', styles.page)}>
        your contents
      </div>
    );
  }
}

export default connect()(ExpertTrajectoryPage);
