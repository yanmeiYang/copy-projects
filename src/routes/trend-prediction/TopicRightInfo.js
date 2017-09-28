import React from 'react';
import { connect } from 'dva';

class TopicRightInfo extends React.PureComponent {
  componentDidMount() {
  }

  showExpert = (word) => {
    console.log(word);
    console.log('#################');
  }

  render() {
    return (
      <div onClick={this.showExpert.bind(this, this.props.query)}>{this.props.query}#####</div>
    );
  }
}

export default connect()(TopicRightInfo);
