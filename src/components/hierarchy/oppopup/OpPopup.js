import React, { Component } from 'react';
import { Popover, Button, Icon } from 'antd';
import { MoveOrg } from './index';
import styles from './OpPopup.less';

export default class OpPopup extends Component {

  state = {
    fatherId: [],
    switch: true
  };

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
    console.log('popup',);
    const content = (
      <div className={styles.OpPopup}>
        <AddExpertbase fatherId={this.props.fatherId} callbackParent={this.switch} name="新建" />
        <AddExpertbase fatherId={this.props.fatherId} callbackParent={this.switch} name="编辑" />
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
