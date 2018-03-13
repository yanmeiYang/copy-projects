import React, { Component } from 'react';
import { connect, FormCreate } from 'engine';
import { Modal, Form, Input, Button, message, Icon, Radio } from 'antd';
import { system } from 'core';
import styles from './popup.less';

// TODO 需要可以配置创建的时候弹出的是哪个控件。

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@FormCreate()
@connect(({ magOrg }) => ({ magOrg }))
export default class AddExpertbase extends Component {
  state = {
    fatherId: [],
    visible: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.fatherId !== this.props.fatherId) {
      const addId = this.props.fatherId.length > 0 ? this.props.fatherId : nextProps.fatherId;
      this.setState({ fatherId: addId });
    }
  }

  handleOk = (event) => {
    // TODO dispatch 提交数据
    // event.stopPropagation();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const parent = this.state.fatherId;
        const data = {
          name: values.name || '',
          name_zh: values.name_zh || '',
          desc: values.desc || '',
          desc_zh: values.desc_zh || '',
          isPublic: values.isPublic === '1' ? true : false,
          // address: values.address || '',
        };
        console.log('current status', data);
        if (this.props.name === '编辑') {
          const { fatherId } = this.state;
          this.props.dispatch({
            type: 'magOrg/updateOrganizationByID',
            payload: { fatherId, data },
          }).then((info) => {
            if (info.succeed) {
              this.updataInfo();
            } else {
              message.error('更新失败');
            }
          });
        } else {
          data.parents = parent || [];
          this.props.dispatch({
            type: 'magOrg/organizationCreate',
            payload: { data },
          }).then((info) => {
            if (info.succeed) {
              this.updataInfo();
            } else {
              message.error('添加失败');
            }
          });
        }
      }
    });
    this.setState({
      fatherId: [],
      visible: false,
    });
  };

  updataInfo = (event) => {
    // event.stopPropagation();
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
          'created_time', 'updated_time', 'is_deleted', 'parents', 'system', 'is_public'],
      },
    });
  };

  handleCancel = (event) => {
    // event.stopPropagation();
    this.props.form.resetFields();
    this.setState({
      fatherId: [],
      visible: false,
    });
  };

  changeVisible = (event) => {
    // event.stopPropagation();
    this.setState({
      visible: true,
    });
    if (this.props.name === '编辑') {
      this.props.dispatch({
        type: 'magOrg/getOrgByID',
        payload: {
          ids: this.props.fatherId,
          expertbase: ['id', 'name', 'name_zh', 'desc', 'desc_zh', 'is_public'],
        },
      }).then((data) => {
        const name = data.name ? data.name.toString() : '';
        this.props.form.setFieldsValue({
          name,
          name_zh: data.name_zh || '',
          // logo: data.logo || '',
          desc: data.desc || '',
          desc_zh: data.desc_zh || '',
          isPublic: data.is_public ? '1' : '2',
          // address: data.address || '',
        });
      });
    }
    this.props.callbackParent();
  };

  render() {
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { name } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className={styles.AddExpertbase}>
        <div onClick={this.changeVisible} className={styles.menuItem}>
          {name === '新建' &&
          <Icon type="plus-square-o" />
          }
          {name === '编辑' &&
          <Icon type="edit" />
          }
          <span>{name}</span>
        </div>
        <Modal visible={visible}
               title={name}
               style={{ top: 20 }}
               wrapClassName="orgtreemodal"
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               maskClosable={false}
               footer={[
                 <Button key="back" onClick={this.handleCancel}>返回</Button>,
                 <Button key="submit" type="primary" onClick={this.handleOk}>
                   提交
                 </Button>,
               ]}>
          <Form onSubmit={this.handleOk}>
            <FormItem
              {...formItemLayout}
              label="英文名称:"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入英文名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="中文名称:"
            >
              {getFieldDecorator('name_zh', {
                rules: [{ required: true, message: '请输入中文名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="英文简介:"
            >
              {getFieldDecorator('desc', {
                rules: [{ required: false, message: '请输入英文简介' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="中文描述:"
            >
              {getFieldDecorator('desc_zh', {
                rules: [{ required: false, message: '请输入中文描述' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否公开:"
            >
              {getFieldDecorator('isPublic', {})(
                <RadioGroup>
                  <Radio value="1">公开</Radio>
                  <Radio value="2">不公开</Radio>
                </RadioGroup>)}
            </FormItem>
            {/*<FormItem*/}
            {/*{...formItemLayout}*/}
            {/*label="地址:"*/}
            {/*>*/}
            {/*{getFieldDecorator('address')(<Input />)}*/}
            {/*</FormItem>*/}
          </Form>
        </Modal>
      </div>
    );
  }
}
