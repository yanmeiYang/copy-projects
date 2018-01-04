import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'routes';
import { Form, Radio, Button, Input } from 'antd';
import { Auth } from 'hoc';
import AddNewTask from './addNewTask';
import CreateNewOrg from './addNewTask/createNewOrg';
import styles from './createProject.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@connect(({ app, reco }) => ({ app, reco }))
@Auth
class CreateProject extends Component {

  state = {
    orgInfo: [],
    taskInfo: [],
    operator: 'insert',
    isEdit: false,
  };

  componentDidMount() {
    // TODO @xiaobei: 发请求读projid,取回信息,填入
    if (this.props.isEdit) {
      this.setState({ operator: 'update', isEdit: true });
      this.props.dispatch({
        type: 'reco/getProjectById',
        payload: {
          ids: [this.props.projId],
          searchType: "reviewer_project",
          offset: 0,
          size: 100,
        },
      }).then((data) => {
        this.editProject(data[0]);
        this.setState({ taskInfo: data[0] });
      })
    }
  }

  // 修改proj方法，回传参数
  editProject = (data) => {
    this.props.form.setFieldsValue({
      projectName: data.title,
      // radio-group: data.
    })
  };

  // 创建组织callback
  saveOrgInfo = (data) => {
    this.setState({ orgInfo: data });
  };
  // newtask callback
  saveTaskInfo = (data) => {
    this.setState({ taskInfo: data });
  };
  // 提交所有信息事件
  saveAll = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const projTitle = values.projectName;
      const projid = this.props.projId ? this.props.projId : '';
      this.props.dispatch({
        type: 'reco/sendProjInfo',
        payload: {
          projectId: [projid],
          operator: this.state.operator,
          data: this.state.taskInfo,
          title: projTitle,
        },
      })
    })
    // TODO @xiaobei: 增加isEdit属性，所有组件支持编辑模式
  };

  render() {
    const { orgInfo, taskInfo, isEdit } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.createproject}>
          <h4>项目信息</h4>
          <Form onSubmit={this.saveAll}>
            <FormItem
              {...formItemLayout}
              label="Project Name :"
            >
              {getFieldDecorator('projectName', {
                rules: [
                  { required: true, message: 'Please select your country!' },
                ],
              })(
                <Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Paper Attribute"
            >
              {getFieldDecorator('radio-group')(
                <RadioGroup>
                  <Radio value={1}>Related Organization</Radio>
                  <Radio value={2}>Single Recommendation</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
          <CreateNewOrg
            callbackParent={this.saveOrgInfo}
            orgList={orgInfo} />
          <AddNewTask callbackParent={this.saveTaskInfo} projData={taskInfo} isEdit={isEdit} />
        </div>
        <Button onClick={this.saveAll}>提交</Button>
      </Layout>
    );
  }
}

export default Form.create()(CreateProject);
