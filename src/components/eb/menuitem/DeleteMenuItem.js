import React, { Component } from 'react';
import { connect } from 'dva';
import { Popconfirm, message, Icon } from 'antd';
import PropTypes from "prop-types";

@connect(({ app, expertbaseTree }) => ({ app, expertbaseTree }))
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
  confirm = () => {
    const { onGetData } = this.props;
    const data = onGetData && onGetData();
    this.props.dispatch({
      type: 'expertbaseTree/DeleteExperBaseByID',
      payload: {
        ids: [data.id] || [],
      },
    }).then((info) => {
      if (info.succeed) {
        this.props.dispatch({ type: 'expertbaseTree/deleteNode', payload: { id: data.id } });
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    });
  };

  openSwitch = () => {
    this.props.callbackParent && this.props.callbackParent();
  };

  render() {
    const { label, icon, className } = this.props;
    return (
      <Popconfirm
        title="你确定要删除么?"
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
