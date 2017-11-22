/**
 * Created by yangyanmei on 17/7/29.
 */
import React from 'react';
import { Layout } from 'routes';
import SystemConfig from '../system-config';

class ContributionTyps extends React.Component {
  state = {};
  render() {
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <h2>贡献类别</h2>
        <SystemConfig />
      </Layout>
      );
  }
}
export default ContributionTyps;
