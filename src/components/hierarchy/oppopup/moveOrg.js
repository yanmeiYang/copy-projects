import React, { Component } from 'react';
import { connect } from 'engine';
import { TreeSelect, Modal, message, Icon } from 'antd';
import { system } from 'core';
import { Maps } from 'utils/immutablejs-helpers';
import styles from './popup.less';

const TreeNode = TreeSelect.TreeNode;

@connect(({ app, magOrg }) => ({ app, magOrg }))
export default class MoveOrg extends Component {

  state = {
    value: [],
    fatherId: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.fatherId !== this.props.fatherId) {
      // console.log('moveid', this.props.fatherId, '\n', nextProps.fatherId);
      const moveId = this.props.fatherId.length > 0 ? this.props.fatherId : nextProps.fatherId;
      this.setState({ fatherId: moveId });
    }
  }

  onChange = (value) => {
    this.setState({ value: [value] });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
    this.props.callbackParent();
  };
  handleOk = (event) => {
    // event.stopPropagation();
    // TODO 发请求
    this.props.dispatch({
      type: 'magOrg/MoveOrganizationByID',
      payload: {
        ids: this.state.fatherId,
        parentsId: this.state.value,
      },
    }).then((data) => {
      if (data.succeed) {
        message.success('移动成功');
        this.props.dispatch({
          type: 'magOrg/getOrganizationByIDs',
          payload: {
            ids: [],
            query: '',
            offset: 0,
            size: 100,
            searchType: 'all',
            filters: { terms: { system: [system.System] } },
            expertbase: ['name', 'name_zh',
              'logo', 'desc', 'type', 'stats',
              'created_time', 'updated_time', 'is_deleted', 'parents', 'system'],
          },
        });
      } else {
        message.error('移动失败');
      }
    });
  };
  handleCancel = (event) => {
    // event.stopPropagation();
    this.setState({
      visible: false,
    });
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

// TODO 考虑性能，这些都暂时先不加载，得设置个触发条件，！！！暂时还没想好怎么加，哈哈
  render() {
    const [allOrgs] = Maps.getAll(this.props.magOrg, 'allOrgs');
    return (
      <div>
        <div onClick={this.showModal} className={styles.menuItem}>
          <Icon type="select" />
          <span>移动</span>
        </div>
        <Modal
          title="Basic Modal"
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
            onSelect={this.test}
          >
            {this.renderTreeNodes(allOrgs)}
          </TreeSelect>

        </Modal>
      </div>
    );
  }
}
