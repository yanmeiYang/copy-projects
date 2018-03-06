import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Spin, Pagination, Form, Input, Row, Col, Icon } from 'antd';
import { PersonList } from 'components/person/index';

const FormItem = Form.Item;
// import styles from './index.less';
class ChangePerson extends Component {

  state = {
    visible: true,
    person: [],
    loading: true,
    name: null,
    org: null,
    currentName: null,
    currentOrg: null,
  };

  componentWillMount() {
    const { name, org } = this.props;
    this.setState({ name, org });
  }

  componentDidMount() {
    this.getMoreCurrentPerson(1);
    const { name, org } = this.state;
    this.props.form.setFieldsValue({ name, org });
  }

  getMoreCurrentPerson = (page) => {
    const { dispatch } = this.props;
    const pagination = this.props.conflicts.get('pagination');
    const { pageSize } = pagination;
    const { name, org } = this.state;
    dispatch({
      type: 'conflicts/replacePerson',
      payload: {
        name, org,
        offset: (page - 1) * pageSize,
        size: pageSize,
      },
    }).then((data) => {
      dispatch({
        type: 'conflicts/updatePaginationParams',
        payload: { offset: (page - 1) * pageSize, total: data.total },
      });
      if (data && data.items) {
        this.setState({ person: data.items, loading: false });
      }
    });
  };


  handleOk = (e) => {
    this.props.callbackParent();
    this.setState({ visible: false });
  };

  handleCancel = (e) => {
    this.props.callbackParent();
    this.setState({ visible: false });
    this.props.dispatch({
      type: 'conflicts/updatePaginationParams',
      payload: { offset: 0, total: null },
    });
  };

  replacePerson = (e) => {
    const { selectPersonIndex, cId, dispatch } = this.props;
    dispatch({
      type: 'conflicts/replaceInfo',
      payload: { personInfo: e.person, index: selectPersonIndex, cId },
    });
    const { name, org, currentName, currentOrg } = this.state;
    if ((name !== currentName && currentName !== null)
      || (org !== currentOrg && currentName !== null)) {
      dispatch({
        type: 'conflicts/updatePersonList',
        payload: { name: currentName, org: currentOrg, index: selectPersonIndex, cId },
      });
    }
    this.props.callbackParent();
  };

  onPageChange = (page) => {
    this.setState({ loading: true });
    this.getMoreCurrentPerson(page);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({ loading: true });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ currentName: values.name, currentOrg: values.org });
        dispatch({
          type: 'conflicts/replacePerson',
          payload: {
            name: values.name, org: values.org,
            offset: 0,
            size: 20,
          },
        }).then((data) => {
          if (data && data.items) {
            this.setState({ person: data.items, loading: false });
          }
        });
      }
    });
  };

  render() {
    const button = [
      (person) => {
        return (
          <div key={Math.random()}>
            <Button onClick={this.replacePerson.bind(this, person)} size="small">选择</Button>
          </div>
        );
      },
    ];

    const pagination = this.props.conflicts.get('pagination');
    const { current, pageSize, total } = pagination;

    const { person, loading } = this.state;

    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="选择专家"
        width="630px"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={null}
        bodyStyle={{ height: '520px', overflowY: 'scroll' }}
      >
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col xs={{ span: 24 }} sm={{ span: 10 }}>
              <FormItem>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '名字必填 ！' }],
                  },
                )(
                  <Input placeholder="请输入名字" autoComplete="off" />,
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 10 }}>
              <FormItem>
                {getFieldDecorator('org')(
                  <Input placeholder="请输入单位" autoComplete="off" />,
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 3 }}>
              <Button
                style={{ marginTop: '4px' }}
                htmlType="submit" type="primary"
                onClick={this.handleSubmit}>
                <span><Icon type="search" /></span>
                <span>搜索</span>
              </Button>
            </Col>
          </Row>
        </Form>
        <Spin spinning={loading}>
          {person &&
          <PersonList
            persons={person} type="tiny"
            PersonList_PersonLink_NewTab
            rightZoneFuncs={button}
            showIndices={['h_index', 'citations', 'num_pubs']}
          />}
        </Spin>
        {total &&
        <div style={{ textAlign: 'center' }}>
          <Pagination
            showQuickJumper
            current={current}
            defaultCurrent={1}
            defaultPageSize={pageSize}
            total={total}
            onChange={this.onPageChange}
          />
        </div>}
      </Modal>
    );
  }
}
export default connect(({ conflicts, loading }) => ({
  conflicts,
  loading,
}))(Form.create()(ChangePerson));
