import React, { Component } from 'react';
import { connect, routerRedux, FormCreate } from 'engine';
import { Form, Button, Input, Breadcrumb, Divider } from 'antd';
import { Auth } from 'hoc';
import { compare } from 'utils/compare';
import classnames from 'classnames';
import AddNewTask from './addNewTask';
import CreateNewOrg from './addNewTask/createNewOrg';
import styles from './CreateProject.less';

@FormCreate()
@connect(({ app, reco }) => ({ app, reco }))
@Auth
export default class CreateProject extends Component {
  state = {
    projTitle: '',
    orgList: [],
    selectedOrg: '',
    taskInfo: [],
    isEdit: false,
    isView: false,
  };

  componentWillMount() {
    if (this.props.isView || this.props.isEdit || this.props.isCopy) {
      this.setState({
        isView: this.props.isView ? this.props.isView : false,
        isEdit: this.props.isEdit ? this.props.isEdit : false,
      });
      this.props.dispatch({
        type: 'reco/getProjectById',
        payload: {
          ids: [this.props.projId],
          searchType: 'reviewer_project',
          offset: 0,
          size: 100,
        },
      }).then((data) => {
        this.setState({
          taskInfo: data[0],
          projTitle: data[0].title,
          selectedOrg: data[0].orgId,
        });
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (compare(nextState, this.state, 'projTitle', 'selectedOrg')) {
      return true;
    }
    return false;
  }

  // 创建组织callback
  saveOrgInfo = (orgsList, orgInfo) => {
    this.setState({ orgList: orgsList, selectedOrg: orgInfo });
  };
  // newtask callback
  saveTaskInfo = (data) => {
    this.setState({ taskInfo: data });
  };
  // 提交所有信息事件
  saveAll = () => {
    const projId = this.props.projId ? this.props.projId : '';
    const { projTitle, taskInfo, selectedOrg, orgList } = this.state;
    const { isEdit } = this.props;
    let currentType = 'reco/sendProjInfo';
    if (isEdit) {
      currentType = 'reco/updataProj';
    }
    this.props.dispatch({
      type: currentType,
      payload: {
        projectId: [projId],
        data: taskInfo,
        title: projTitle,
        // orgList: orgList,
        orgId: selectedOrg,
      },
    }).then((data) => {
      if (data.succeed) {
        this.props.dispatch(routerRedux.push({
          pathname: '/',
        }));
      }
    });
  };
  // 保存title
  saveProTitle = (e) => {
    this.setState({ projTitle: e.target.value });
  };

  render() {
    const { orgList, taskInfo, isEdit, isView, selectedOrg, projTitle } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <div className={styles.createproject}>
          <div className={classnames(styles.cover, { [styles.none]: isView })}>
            <h3>项目信息</h3>
            <Divider />
            <Form onSubmit={this.saveAll}>
              <Form.Item
                {...formItemLayout}
                label="项目名称:"
              >
                <Input onChange={this.saveProTitle} value={projTitle} />
              </Form.Item>
            </Form>
            <CreateNewOrg
              callbackParent={this.saveOrgInfo}
              orgList={orgList} selectedOrg={selectedOrg} />
            <AddNewTask callbackParent={this.saveTaskInfo} projData={taskInfo}
                        isEdit={isEdit} isView={isView} isCopy={this.props.isCopy} />
          </div>
        </div>
        <div className={styles.outsideSave}>
          {!isView &&
          <Button onClick={this.saveAll} size="large" className={styles.sumbitBtn}>提交</Button>}
        </div>
      </div>
    );
  }
}
