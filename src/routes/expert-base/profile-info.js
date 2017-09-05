import React from 'react';
import { connect } from 'dva';

class ExpertProfileInfo extends React.Component {
  render(){
    console.log('a',this.props.ExpertList);
    return (
      <div>

      </div>
    );
  }
}
export default connect(({ expertBase }) => ({ expertBase }))(ExpertProfileInfo);
