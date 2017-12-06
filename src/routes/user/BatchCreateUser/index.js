/**
 * Created by yangyanmei on 17/11/28.
 */
import React from 'react';
import { connect } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { Link } from 'dva/router';
import { Form, Input, Button, Select, Modal, Table } from 'antd';
import { Layout } from 'routes';
import { theme, applyTheme } from 'themes';
import styles from './index.less';

const tc = applyTheme(styles);
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const { Column } = Table;
// const AutocompleteOption = AutoComplete.Option;t

class BatchCreateUser extends React.Component {
  state = { visible: false, usersAndFeedback: [], loading: null };

  handleOk = (e) => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({ visible: false });
    this.props.form.resetFields();
  };

  registered = (e) => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const tempUsers = (values.data && values.data.trim().split('\n')) || [];
        const users = (values.data && values.data.trim().split('\n')) || [];
        const payload = {
          gender: 3, position: 8,
          last_name: '', password: '',
          sub: true, ghost: true,
        };

        // 循环创建用户
        const fetchData = (data, i, overallLength, results) => {
          const currentUser = data[0].split(/[;；]/g);
          if (currentUser.length > 1) {
            payload.first_name = currentUser[0].trim();
            payload.email = currentUser[1].trim();
          }
          that.setState({ loading: true });
          this.props.dispatch({ type: 'auth/createUser', payload: { ...payload } })
            .then((res) => {
              if (i + 1 < overallLength) {
                data.splice(0, 1);
                fetchData(data, i + 1, overallLength, results.concat(res));
              } else {
                const usersAndFeedback = [];
                const feedbacks = results.concat(res);
                tempUsers && tempUsers.length > 0 && tempUsers.map((item, index) => {
                  return usersAndFeedback.push({ user: item, feedback: feedbacks[index] });
                })
                that.setState({ visible: true, usersAndFeedback, loading: false });
                // that.props.form.resetFields();
              }
            });
        };
        const results = [];
        fetchData(users, 0, users.length, results);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, usersAndFeedback, loading } = this.state;
    return (
      <Layout searchZone={[]} contentClass={tc(['BatchCreateUser'])} showNavigator={false}>
        <div className={styles.header}>
          <h2 className={styles.title}>批量创建用户</h2>
          <h2>
            <Link to="/user-info" href="/user-info">
              返回
            </Link>
          </h2>
        </div>
        <div className={styles.note}>
          <span>
            每个用户必须有name、email两个值，并且之间用半圆角分号分隔；多用户之间用回车分隔。例如：
          </span>
          <p>name;email</p>
          <p>name1;email1</p>
        </div>

        <Form onSubmit={this.registered}>
          <FormItem>
            {
              getFieldDecorator('data')(
                <TextArea autosize={{ minRows: 10 }} placeholder="请按照正确格式输入" />,
              )
            }
          </FormItem>
          <FormItem className={styles.footerBtn}>
            <Button type="primary" loading={loading} onClick={this.registered}>
              批量创建用户
            </Button>
          </FormItem>
        </Form>

        <Modal
          title="Feedback"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Table dataSource={usersAndFeedback} bordered size="small" pagination={false}>
            <Column
              dataIndex="user" key="userInfo"
              className={styles.venueDesc}
            />
            <Column
              dataIndex="feedback" key="feedback"
              className={styles.venueDesc}
              render={(feedback) => {
                return (
                  <span
                    className={(feedback.statusCode && styles.errorStyle) ||
                    (feedback.status && styles.successStyle)}>
                    {feedback.message &&
                    <FM id={`com.feedback.${feedback.message}`}
                        defaultMessage={feedback.message} />}
                  </span>
                );
              }} />

          </Table>
        </Modal>
      </Layout>
    );
  }
}

export default connect(
  ({ app, auth, universalConfig }) => ({ app, auth, universalConfig }),
)(Form.create()(BatchCreateUser));
