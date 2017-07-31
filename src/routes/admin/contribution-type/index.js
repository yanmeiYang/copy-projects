/**
 * Created by yangyanmei on 17/7/29.
 */
import React from 'react';
import SystemConfig from '../system-config';

class ContributionTyps extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <h2 style={{ paddingLeft: 24, marginBottom: '-20px' }}>贡献类别</h2>
        <SystemConfig />
      </div>
      );
  }
}
export default ContributionTyps;
