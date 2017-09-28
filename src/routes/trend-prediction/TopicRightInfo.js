import React from 'react';
import { connect } from 'dva';
import styles from './TopicRightInfo.less';

class TopicRightInfo extends React.PureComponent {
  componentDidMount() {
  }

  showExpert = (word) => {
    console.log(word);
    console.log('#################');
  }

  render() {
    return (
      <span className={styles.keyword} role="presentation" onClick={this.showExpert.bind(this, this.props.query)}>{this.props.query}#####</span>
    );
  }
}

export default connect()(TopicRightInfo);
