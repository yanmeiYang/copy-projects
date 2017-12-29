/**
 * Created by yangyanmei on 17/7/29.
 */
import React from 'react';
import { Layout } from 'routes';
import SystemConfig from '../system-config';

class ActivityType extends React.Component {
  state = {};
  render() {
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div>
          <h2 style={{ paddingLeft: 24 }}>活动类型</h2>
          <SystemConfig />
        </div>
      </Layout>
    );
  }
}
export default ActivityType;
