import React, { Component } from 'react';
import { connect, FormCreate } from 'engine';
import { Modal, Form, Input, Button, message, Icon, Radio } from 'antd';
import { system } from 'core';
import styles from './AddEBMenuItem.less';
import PropTypes from "prop-types";

// TODO 需要可以配置创建的时候弹出的是哪个控件。

@FormCreate()
@connect(({ expertbaseTree }) => ({ expertbaseTree })) // TODO
export default class AddEBMenuItem extends Component {

  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string,
    onGetData: PropTypes.func,
  };

  static defaultProps = {
    label: 'Create',
    icon: 'plus-square-o',
  };

  state = { // TODO
    data: null,
    visible: false,
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.fatherId !== this.props.fatherId) {
  //     const addId = this.props.fatherId.length > 0 ? this.props.fatherId : nextProps.fatherId;
  //     this.setState({ fatherId: addId });
  //   }
  // }

  handleOk = () => {
    // TODO dispatch 提交数据
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const parent = [this.state.data.id] || [];
        const data = {
          name: values.name || '',
          name_zh: values.name_zh || '',
          desc: values.desc || '',
          desc_zh: values.desc_zh || '',
          is_public: values.isPublic === '1' ? true : false,
          // address: values.address || '',
        };
        if (this.props.type === 'edit') {
          data.id = [this.state.data.id] || [];
          this.props.dispatch({
            type: 'expertbaseTree/UpdateExperBaseByID',
            payload: { data },
          }).then((info) => {
            if (info.succeed) {
              message.success('更新成功');
            } else {
              message.error('更新失败');
            }
          });
        } else {
          data.parents = parent || [];
          this.props.dispatch({
            type: 'expertbaseTree/createExpertBase',
            payload: { data },
          }).then((info) => {
            if (info.succeed) {
              message.success('添加成功');
            } else {
              message.error('添加失败');
            }
          });
        }
      }
    });
    this.setState({
      visible: false,
    });
  };
  // // 假更新，直接添加到本地数据
  // addInfoToLocal = (data) => {
  //   this.props.dispatch({
  //     type: 'magOrg/addInfoToLocal',
  //     payload: { data },
  //   });
  // };
  // TODO 这里需要修改，暂时是调用api刷新，但是需要改成修改本地数据的形式
  // updataInfo = () => {
  //   this.props.dispatch({
  //     type: 'magOrg/getOrganizationByIDs',
  //     payload: {
  //       ids: [],
  //       query: '',
  //       offset: 0,
  //       size: 100,
  //       searchType: 'all',
  //       filters: { terms: { system: [system.System] } },
  //       expertbase: ['name', 'name_zh',
  //         'logo', 'desc', 'type', 'stats',
  //         'created_time', 'updated_time', 'is_deleted', 'parents', 'system', 'is_public'],
  //     },
  //   });
  // };

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };

  changeVisible = () => {
    // I get dat here.
    const { onGetData } = this.props;
    const data = onGetData && onGetData();
    this.setState({ visible: true, data });
     // TODO 是否有必要设置state，是否可以每次调用 方法取data
    if (this.props.type === 'edit') {
      this.props.dispatch({
        type: 'expertbaseTree/getExperBaseByID',
        payload: {
          ids: [data.id] || [],
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
    this.props.callbackParent && this.props.callbackParent();
  };

  render() {
    const { label, icon, className } = this.props;

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

    return [
      <div key={0} className={className} onClick={this.changeVisible}>
        <Icon type={icon} /><span>{label}</span>
      </div>,
      <Modal key={1}
             visible={visible}
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
          <Form.Item
            {...formItemLayout}
            label="英文名称:"
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入英文名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="中文名称:"
          >
            {getFieldDecorator('name_zh', {
              rules: [{ required: true, message: '请输入中文名称' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="英文简介:"
          >
            {getFieldDecorator('desc', {
              rules: [{ required: false, message: '请输入英文简介' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="中文描述:"
          >
            {getFieldDecorator('desc_zh', {
              rules: [{ required: false, message: '请输入中文描述' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="是否公开:"
          >
            {getFieldDecorator('isPublic', {})(
              <Radio.Group>
                <Radio value="1">公开</Radio>
                <Radio value="2">不公开</Radio>
              </Radio.Group>)}
          </Form.Item>
          {/*<FormItem*/}
          {/*{...formItemLayout}*/}
          {/*label="地址:"*/}
          {/*>*/}
          {/*{getFieldDecorator('address')(<Input />)}*/}
          {/*</FormItem>*/}
        </Form>
      </Modal>
    ];
  }
}
