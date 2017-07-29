/**
 * Created by yangyanmei on 17/7/29.
 */
import React from 'react';
import SystemConfig from '../system-config';

class ActivityType extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <h2 style={{ paddingLeft: 24, marginBottom: '-20px' }}>活动类型</h2>
        <SystemConfig />
      </div>
    );
  }
}
export default ActivityType;
