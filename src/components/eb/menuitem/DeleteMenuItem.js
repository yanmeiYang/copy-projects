import React, { Component } from 'react';
import { connect } from 'dva';
import { Popconfirm, message, Icon } from 'antd';
import styles from './DeleteMenuItem.less';
import PropTypes from "prop-types";

@connect(({ app, magOrg }) => ({ app, magOrg }))
export default class DeleteBtn extends Component {

  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
    onGetData: PropTypes.func,
  };

  static defaultProps = {
    label: 'Delete',
    icon: 'delete',
  };

  state = {};

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

  openSwitch = (event) => {
    event.stopPropagation();
    this.props.callbackParent && this.props.callbackParent();
  };

  render() {
    const { label, icon, className } = this.props;

    return (
      <Popconfirm
        title="你确定要删除么?" className="expertbase_delete_menuitem"
        onConfirm={this.confirm.bind(this)}
        okText="确定" cancelText="取消"
      >
        <div onClick={this.openSwitch} className={className}>
          <Icon type={icon} /><span>{label}</span>
        </div>
      </Popconfirm>
    );
  }
}
