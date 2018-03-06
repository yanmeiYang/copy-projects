/**
 * Created by ranyanchuan on 2018/2/7.
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Input, Popconfirm } from 'antd';
import * as ConflictsService from 'services/coi-service';
import styles from './userModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class UserModal extends React.Component {
  state = { showModal: false };
  loading = false;
  componentWillUpdate(nextProps, nextState) {
    const status = this.props.conflicts.get('status');
    const nextStatus = nextProps.conflicts.get('status');
    if (status !== nextStatus) { // 获取专家
      this.loading = false;
      this.props.form.resetFields();
      this.hideUserModal();
    }
  }

  showUserModal = () => {
    this.setState({ showModal: true });
  };
  hideUserModal = () => {
    this.setState({ showModal: false });
    this.loading = false;
  };
  reset = () => {
    this.loading = false;
    // this.props.form.resetFields();
    this.props.form.setFieldsValue({ userName: '' });
  };
  clearData = () => {
    const { cId } = this.props;
    const originText = '';
    const personList = [];
    this.props.dispatch({
      type: 'conflicts/fetchPersonInfo',
      payload: { originText, personList, cId },
    });
  };
  handleSubmit = () => {
    const { cId } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const originText = values.userName;
        const personList = ConflictsService.stringToJson(originText);
        if (cId === 'right') {
          localStorage.setItem('originTextRight', JSON.stringify(originText));
        } else {
          localStorage.setItem('originTextLeft', JSON.stringify(originText));
        }
        this.props.dispatch({
          type: 'conflicts/fetchPersonInfo',
          payload: { originText, personList, cId },
        });
        this.loading = true;
      }
    });
  };
  objToString = (data) => {
    let personString = '';
    for (const person of data) {
      const id = person.id ? `${person.id},` : '';
      const org = person.org === '' ? '' : `,${person.org}`;
      personString = `${personString + id + person.name}${org}\n`;
    }
    return personString;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { conflicts, cId } = this.props;
    let textAreaDefault = this.objToString(conflicts.get('personListRight'));
    if (cId === 'left') {
      textAreaDefault = this.objToString(conflicts.get('personListLeft'));
    }
    const { showModal } = this.state;
    return (
      <div className={this.props.className}>
        <Popconfirm title="你确定要清空数据么？" onConfirm={this.clearData}
                    okText="确定" cancelText="取消">
          <Button type="primary" className={styles.userModalAddExpertBtn}>
            清空数据
          </Button>
        </Popconfirm>
        <Button type="primary" className={styles.userModalAddExpertBtn}
                onClick={this.showUserModal}>
          编辑专家列表
        </Button>
        <Modal
          title="编辑专家列表"
          visible={showModal}
          onOk={this.hideUserModal}
          onCancel={this.hideUserModal}
          footer={null}
          bodyStyle={{ padding: '10px 20px 1px 20px' }}
        >
          <div className={styles.userModal}>
            <div className={styles.inputInfoTxt}>
              请输入专家信息，每行一个专家。格式：“姓名, 工作单位”。<br />
              例如：Jie Tang,Tsinghua University
            </div>
            <Form
              className={styles.formStyle}
              onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: false, message: 'Please input your username!' }],
                  initialValue: textAreaDefault,
                })(<TextArea autosize={{ minRows: 10, maxRows: 20 }} />)}
              </FormItem>
              <FormItem>
                <div className={styles.submit}>
                  <Popconfirm title="你确定要清空数据么？" onConfirm={this.reset}
                              okText="确定" cancelText="取消">
                    <Button type="default" className={styles.reset}>
                      清空
                    </Button>
                  </Popconfirm>
                  <Button type="primary" onClick={this.handleSubmit} loading={this.loading}>
                    确定
                  </Button>
                </div>
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(({ auth, login, conflicts }) => (
  { auth, login, conflicts }))(Form.create()(UserModal));

