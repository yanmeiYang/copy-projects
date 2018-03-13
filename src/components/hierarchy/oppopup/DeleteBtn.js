import React, { Component } from 'react';
import { connect } from 'dva';
import { Popconfirm, message, Icon } from 'antd';
import { system } from 'core';
import styles from './popup.less';

@connect(({ app, magOrg }) => ({ app, magOrg }))
export default class DeleteBtn extends Component {

  state = {
    fatherId: []
  };


  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.fatherId !== this.props.fatherId) {
  //     const deleteId = this.props.fatherId.length > 0 ? this.props.fatherId : nextProps.fatherId;
  //     this.setState({ fatherId: deleteId });
  //   }
  // }

  // 删除确认的两个事件
  confirm = (event) => {
    // event.stopPropagation();
    this.props.dispatch({
      type: 'magOrg/organizationDelete',
      payload: {
        ids: this.props.fatherId,
      },
    }).then((data) => {
      if (data.succeed) {
        message.success('删除成功');
        // TODO 假删除，直接删除数据
        this.props.dispatch({
          type: 'magOrg/deleteInitDate',
          payload: {
            ids: this.props.fatherId,
          },
        });
      } else {
        message.error('删除失败');
      }
    });
  };
  // TODO 这个方法还没写，有用么？
  cancel = (event) => {
    // event.stopPropagation();
  };
  openswitch = (event) => {
    // event.stopPropagation();
    this.props.callbackParent();
  };

  render() {
    return (
      <Popconfirm title="你确定要删除么?" id="orgdelBtn"
                  onConfirm={this.confirm.bind(this)}
                  onCancel={this.cancel.bind(this)}
                  okText="确定" cancelText="取消">
        <div onClick={this.openswitch} className={styles.menuItem}>
          <Icon type="delete" />
          <span>删除</span>
        </div>
      </Popconfirm>
    );
  }
}
