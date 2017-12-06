/**
 * Created by yangyanmei on 17/10/25.
 */

import React from 'react';
import { Layout } from 'routes';
import SystemConfig from '../system-config';

class SystemConfigCategory extends React.Component {
  state = {};
  render() {
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <SystemConfig />
      </Layout>
    );
  }
}
export default SystemConfigCategory;
