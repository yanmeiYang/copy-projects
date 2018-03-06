import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Button, Icon } from 'antd';
import AddOrg from './addOrg';
import DeleteBtn from './deleteBtn';
import MoveOrg from './moveOrg';
import styles from './rightZone.less';

export default class RightZone extends Component {
  state = { fatherId: [], switch: true };

// TODO 传id 多了一层
  componentWillReceiveProps(nextProps) {
    if (nextProps.fatherId !== this.props.fatherId) {
      // console.log('fatherIdreciprops', this.props.fatherId, '\n', nextProps.fatherId);
      this.setState({ fatherId: nextProps.fatherId });
    }
  }

  handleVisibleChange = (visible) => {
    if (this.state.switch) {
      this.props.changemenu(visible);
    }
  };
  // 阻止点击新建，删除，移动时，点击modal层消失的bug
  switch = () => {
    this.setState({ switch: false });
  };

  render() {

    const content = (
      <div className={styles.rightcontent}>
        <AddOrg fatherId={this.props.fatherId} callbackParent={this.switch} name="新建" />
        <AddOrg fatherId={this.props.fatherId} callbackParent={this.switch} name="编辑" />
        <MoveOrg fatherId={this.props.fatherId} callbackParent={this.switch} />
        <DeleteBtn fatherId={this.props.fatherId} callbackParent={this.switch} />
      </div>
    );
    return (
      <Popover placement="rightTop" content={content}
        // mouseEnterDelay={2}
        // mouseLeaveDelay={1}
        // onVisibleChange={this.handleVisibleChange}
      >
        <Icon type="plus-circle-o" />
      </Popover>
    );
  }
}
