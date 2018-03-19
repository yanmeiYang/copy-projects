import React, { Component } from 'react';
import { connect } from 'engine';
import { TreeSelect, Modal, Button, message, Icon } from 'antd';
import { List, Map, toJSON } from 'immutable';
import { Maps } from 'utils/immutablejs-helpers';
import hierarchy from 'helper/hierarchy';
import PropTypes from "prop-types";
import styles from './MoveEBMenuItem.less';

const TreeNode = TreeSelect.TreeNode;

@connect(({ expertbaseTree }) => ({ expertbaseTree }))
export default class MoveEBMenuItem extends Component {

  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
    onGetData: PropTypes.func,
  };

  static defaultProps = {
    label: 'Move',
    icon: 'select',
  };

  state = {
    value: '',
  };

  onChange = (value) => {
    this.setState({ value: value });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.props.callbackParent && this.props.callbackParent();
  };

  handleOk = () => {
    const { onGetData } = this.props;
    const node = onGetData && onGetData();
    this.props.dispatch({
      type: 'expertbaseTree/MoveExperBaseByID',
      payload: {
        id: node.id || '',
        parentsId: this.state.value || '',
      },
    }).then((data) => {
      if (data.succeed) {
        this.props.dispatch({ type: 'expertbaseTree/deleteNode', payload: { id: node.id } });
        this.props.dispatch({
          type: 'expertbaseTree/addNode',
          payload: { node, id: this.state.value }
        });
        message.success('移动成功');
        this.handleCancel();
      } else {
        message.error('移动失败');
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  ListToArray = (data, index) => {
    let newData = hierarchy.fromData(index, data);
    let orgs = newData.data && newData.data.toJS();
    return this.renderTreeNodes(orgs)
  };

  renderTreeNodes = (orgs) => {
    if (orgs) {
      return orgs.map((org) => {
        if (org.childs) {
          return (
            <TreeNode title={org.name_zh} value={org.id} key={org.id}>
              {this.renderTreeNodes(org.childs)}
            </TreeNode>
          );
        }
        return (<TreeNode title={org.name_zh} value={org.id} key={org.id} />);
      });
    }
  };

  render() {
    const [treeData, treeIndex] = Maps.getAll(this.props.expertbaseTree, 'treeData', 'treeIndex');
    const { label, icon, className } = this.props;
    return (
      <div>
        <div onClick={this.showModal} className={className}>
          <Icon type={icon} /><span>{label}</span>
        </div>
        <Modal
          title={label}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <TreeSelect
            showSearch
            style={{ width: 300 }}
            value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            onChange={this.onChange.bind(this)}
          >
            {this.ListToArray(treeData, treeIndex)}
          </TreeSelect>

        </Modal>
      </div>
    );
  }
}
