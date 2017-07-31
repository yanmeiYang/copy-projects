/**
 *  Created by BoGao on 2017-06-09;
 */
import React from 'react';
import { connect } from 'dva';
import AddUserRolesByOrg from '../../common/add-role';


class AddUserRoles extends React.Component {
  componentDidMount() {
    this.updateCategory('user_roles');
  }

  updateCategory = (category) => {
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category },
    });
  };

  render() {
    return (
      <div className="content-inner">
        <AddUserRolesByOrg />
      </div>
    );
  }
}

export default connect(
  ({ adminSystemConfig, loading }) => ({ adminSystemConfig, loading }),
)(AddUserRoles);
