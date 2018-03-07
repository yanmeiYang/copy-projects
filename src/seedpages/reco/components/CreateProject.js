import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Layout } from 'components/layout';
import { Form, Radio, Button, Input, Breadcrumb, Divider } from 'antd';
import { Auth } from 'hoc';
import { compare } from 'utils/compare';
import classnames from 'classnames';
import AddNewTask from './addNewTask';
import CreateNewOrg from './addNewTask/createNewOrg';
import styles from './CreateProject.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

@connect(({ app, reco }) => ({ app, reco }))
@Auth
class CreateProject extends Component {
  state = {
    projTitle: '',
    orgList: [],
    selectedOrg: '',
    taskInfo: [],
    isEdit: false,
    isView: false,
    links: [],
    currentImg: '',
  };

  componentWillMount() {
    // TODO @xiaobei: 需要修改生命周期钩子
    if (this.props.isView || this.props.isEdit) {
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
    if (data.email.mailBody) {
      const hrefBox =
        data.email.mailBody.match(/<a[^>]+.*?href=["']htt+?([^"']+)["']?[^>](.|[\s\S])*?<\/a>/g);
      const imgBox = data.email.mailBody.match(/<img(.|[\s\S])*?(?:>|\/>)/g);
      const imgArray = [];
      if (hrefBox) {
        for (const items of imgBox) {
          const item = items.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/);
          imgArray.push(item[1]);
        }
      }
      const taskBox = [];
      if (imgBox) {
        for (const href of hrefBox) {
          const content = href.match(/>(.|[\s\S]*)<\/a>/);
          const url = href.match(/href=\"([^\"]+)/);
          const task = {
            name: content[1],
            url: url[1],
          };
          taskBox.push(task);
        }
      }
      this.setState({ taskInfo: data, links: taskBox, currentImg: imgArray[0] });
    } else {
      this.setState({ taskInfo: data });
    }
  };
  // 提交所有信息事件
  saveAll = () => {
    const projid = this.props.projId ? this.props.projId : '';
    const { projTitle, taskInfo, selectedOrg, orgList, links, currentImg } = this.state;
    const { isEdit } = this.props;
    let currentType = 'reco/sendProjInfo';
    if (isEdit) {
      currentType = 'reco/updataProj';
    }
    this.props.dispatch({
      type: currentType,
      payload: {
        projectId: [projid],
        data: taskInfo,
        title: projTitle,
        // orgList: orgList,
        orgId: selectedOrg,
        link: links,
        trackOpenimg: currentImg,
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
      <Layout searchZone={[]} showNavigator={false} pageTitle="create project">
        <div className={styles.createproject}>
          <div className={styles.navbar}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item href="/">项目列表</Breadcrumb.Item>
              <Breadcrumb.Item>创建项目</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className={classnames(styles.cover, { [styles.none]: isView })}>
            <h3>项目信息</h3>
            <Divider />
            <Form onSubmit={this.saveAll}>
              <FormItem
                {...formItemLayout}
                label="项目名称:"
              >
                <Input onChange={this.saveProTitle} value={projTitle} />
              </FormItem>
            </Form>
            <CreateNewOrg
              callbackParent={this.saveOrgInfo}
              orgList={orgList} selectedOrg={selectedOrg} />
            <AddNewTask callbackParent={this.saveTaskInfo} projData={taskInfo}
                        isEdit={isEdit} isView={isView} />
          </div>
        </div>
        <div className={styles.outsideSave}>
          {!isView &&
          <Button onClick={this.saveAll} size="large" className={styles.sumbitBtn}>提交</Button>}
        </div>
      </Layout>
    );
  }
}

export default Form.create()(CreateProject);
