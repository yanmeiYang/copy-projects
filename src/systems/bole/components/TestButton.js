import React from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';

class TestButton extends React.Component {

  render() {
    <div>
      <Modal
        title="Basic Modal"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(TestButton);
