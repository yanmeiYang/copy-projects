/**
 * Created by yangyanmei on 17/8/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Cascader, Input, Row, Col, Button, Tag } from 'antd';
import { contactByJoint, getValueByJoint } from '../../../services/seminar';
import styles from './index.less';

class AddCoOrgModal extends React.Component {
  state = { modalVisible: false, currentOrg: [], tags: [] };

  componentDidMount() {
    if (this.props.coOrg !== '') {
      this.setState({ tags: this.props.coOrg, currentOrg: this.props.coOrg });
    }
  }

  onOrgChange = (value) => {
    if (value[1]) {
      const data = contactByJoint(value[0], value[1]);
      this.setState({ currentOrg: this.state.currentOrg.concat(data) });
    }
  };

  setModalVisible = () => {
    this.setState({ modalVisible: false, manual: false });
  };
  deleteTag = (org, index, e) => {
    const tags = this.state.currentOrg.filter(tag => tag !== org);
    this.setState({ currentOrg: tags, tags });
    this.props.callbackParent(tags);
  };
  addOrg = (e) => {
    const value = e.target.value;
    // 新增加的内容不再列表里添加
    let isExist = [];
    let parent = {};
    this.props.orgList.map((tag) => {
      if (tag.children.filter(item => item.value === value).length > 0) {
        isExist = tag.children.filter(item => item.value === value);
        parent = tag;
        return true;
      } else {
        return false;
      }
    });
    if (isExist.length <= 0 && value !== '') {
      const data = { key: value, val: ' ' };
      this.props.dispatch({ type: 'seminar/addKeyAndValue', payload: data });
      this.setState({ currentOrg: value === '' ? this.state.currentOrg : this.state.currentOrg.concat(value) });
    } else if (isExist.length > 0) {
      this.setState({
        currentOrg: this.state.currentOrg.concat(contactByJoint(parent.value, isExist[0].value)),
      });
    }
  };

  handleOk = () => {
    if (this.state.manual) {
      ReactDOM.findDOMNode(this.refs.manualValue).value = '';
    }
    this.setState({ modalVisible: false, tags: this.state.currentOrg });
    this.props.callbackParent(this.state.currentOrg);
  };
  showAddCoOrgModal = () => {
    this.setState({ modalVisible: true });
  };

  jumpToManual = () => {
    const { tags, currentOrg } = this.state;
    if (currentOrg.length > tags.length) {
      currentOrg.pop();
    }
    this.setState({ manual: !this.state.manual, currentOrg });
  };

  render() {
    const { orgList } = this.props;
    const { modalVisible, tags, manual } = this.state;
    return (
      <div>
        {tags.map((org, index) => {
          return (
            <Tag key={org} color="#2db7f5" closable
                 onClose={this.deleteTag.bind(this, org, index)}>
              {getValueByJoint(org)}
            </Tag>
          );
        })}

        <Button onClick={this.showAddCoOrgModal} size="small">添加</Button>
        <Modal
          title="添加协办单位"
          visible={modalVisible}
          width={640}
          footer={null}
          onOk={this.handleOk}
          // wrapClassName={styles.addExpertModal}
          onCancel={this.setModalVisible.bind()}
        >
          <div>
            {!manual &&
            <Row style={{ maxHeight: '555vh' }}>
              <Col span={4}>
                选择协办单位
              </Col>
              <Col span={20}>
                <Cascader options={orgList} onChange={this.onOrgChange} ref="cascader"
                          showSearch placeholder="请选择承办单位" style={{ width: '100%' }} />
              </Col>
              <Col span={24} className={styles.action}>
                <Button type="primary" onClick={this.jumpToManual}>未找到，手动填写</Button>
                <Button type="primary" onClick={this.handleOk}>提交</Button>
              </Col>
            </Row>
            }
            {manual &&
            <Row style={{ marginTop: '10px' }}>
              <Col span={4}>手动填写</Col>
              <Col span={20}>
                <Input onBlur={this.addOrg} ref="manualValue" />
              </Col>
              <Col span={24} className={styles.action}>
                <Button type="primary" onClick={this.jumpToManual}>返回</Button>
                <Button type="primary" onClick={this.handleOk}>提交</Button>
              </Col>
            </Row>}
          </div>
        </Modal>
      </div>
    );
  }
}

export default (AddCoOrgModal);
