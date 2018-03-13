/**
 * Created by ranyanchuan on 2018/3/8.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Auth } from 'hoc';
import { Form, Popconfirm, message, Table, Upload, Input, Icon, Modal, Button, Radio, Tabs } from 'antd';
import { Layout } from 'components/layout';
import { loadECharts } from 'utils/requirejs';
import { theme, applyTheme } from 'themes';
import EmailStatistics from './components/statistics/index';
import { menuData, weekSubscribeData, daySubscribeData, weekLineData, dayLineData, emailListData } from './fake-data'
import styles from './index.less';


@connect(({app}) => ({app}))
@Auth
class EmailGroupIndex extends Component {

  state = {
    menuActive: 0,
    delEditIconVisible: false,
    createGroupVisible: false,
    editGroupFormVisible: false,
  };

  onMenuSelect = (item, index) => {
    this.setState({menuActive: index,});
  };

  onShowGroupModal = () => {
    this.setState({createGroupVisible: true});
  };
  onHideGroupModal = () => {
    this.setState({createGroupVisible: false});
  };

  onEditGroupName = () => {
    this.setState({editGroupFormVisible: true});
  };

  onCreateGroupSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({createGroupVisible: false});
      }
    });
  };

  onEmailFileSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  onUpdateGroupSubmit = (e) => {
    const values = this.props.form.getFieldsValue();
    if (values.editName) {
      this.setState({editGroupFormVisible: false, delEditIconVisible: false});
    }
  };

  onMouseOverGroupName = () => {
    this.setState({delEditIconVisible: true});
  };

  onMouseLeaveGroupName = () => {
    this.setState({delEditIconVisible: false});
  };

  getUploadNormFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  onConfirmDelGroup = () => {
    message.info('Click on Yes.');
  };

  render() {
    const {menuActive, delEditIconVisible, editGroupFormVisible,} = this.state;
    const {getFieldDecorator} = this.props.form;
    const weekColumns = [
      {title: '订阅用户', dataIndex: 'all'},
      {title: '新增用户', dataIndex: 'add'},
      {title: '主动订阅', dataIndex: 'active'},
      {title: '退订用户', dataIndex: 'cancel'},
      {title: '日期', dataIndex: 'date'}
    ];

    const dayColumns = [
      {title: '订阅用户', dataIndex: 'all'},
      {title: '新增用户', dataIndex: 'add'},
      {title: '主动订阅', dataIndex: 'active'},
      {title: '退订用户', dataIndex: 'cancel'},
      {title: '日期', dataIndex: 'date'}
    ];

    const emailColumns = [
      {title: '邮箱', width: 180, dataIndex: 'email', key: 'email', fixed: 'left'},
      {title: 'Aminer ID', width: 220, dataIndex: 'aid', key: 'aid', fixed: 'left'},
      {title: '属性', width: 80, dataIndex: 'attr', key: 'attr', fixed: 'left'},
      {title: '状态', width: 80, dataIndex: 'status', key: 'status', fixed: 'left'},
      {title: '姓名', dataIndex: 'name', key: 'name', width: 150},
      {title: '推送', dataIndex: 'pushNum', key: 'pushNum', width: 80},
      {title: '打开', dataIndex: 'openNum', key: 'openNum', width: 80},
      {title: '单位', dataIndex: 'aff', key: 'aff', width: 150},
      {title: '职称', dataIndex: 'position', key: 'position', width: 100},
      {title: '研究兴趣', dataIndex: 'keyword', key: 'keyword', width: 250},
      {title: '来源', dataIndex: 'origin', key: 'origin', width: 80},
      {title: '订阅时间', dataIndex: 'bookDate', key: 'bookDate', width: 120},
      {title: '取消时间', dataIndex: 'cancelDate', key: 'cancelDate', width: 120},
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (text, record) => (
          <span>
            <Popconfirm placement="left" title="您确定要删除该订阅用户吗？" onConfirm={this.confirm} okText="Yes"
                        cancelText="No">
              <a href="#">删除</a>
            </Popconfirm>
         </span>
        ),
      },
    ];
    // todo 用css控制宽
    const tableWidth = document.documentElement.clientWidth - 250;
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.emailGroup}>
          <div className={styles.menu}>
            <div className={styles.createMenu}>
              <Button icon="plus" onClick={this.onShowGroupModal}>创建</Button>
            </div>
            <div className={styles.menuItems}>
              {menuData && menuData.map((item, index) => {
                return (
                  <div className={menuActive === index ? styles.itemActive : styles.item} key={item}
                       onClick={this.onMenuSelect.bind(this, item, index)}>
                    <span>{item}</span>
                  </div>)
              })
              }
            </div>
          </div>

          <div style={{width: tableWidth}} className={styles.emailTable}>
            <div className={styles.groupAction}>
              <div className={styles.groupTitle}
                   onMouseOver={this.onMouseOverGroupName}
                   onMouseLeave={this.onMouseLeaveGroupName}
              >
                {!editGroupFormVisible &&
                <div>
                  <span className={styles.title}>{menuData[menuActive]}</span>
                  {delEditIconVisible &&
                  <span>
                        <span onClick={this.onEditGroupName}><Icon type="edit" className={styles.icon}/></span>
                        <Popconfirm placement="left" title="您确认删除这个邮件组吗?" okText="Yes" cancelText="No"
                                    onConfirm={this.onConfirmDelGroup}>
                          <Icon type="delete" className={styles.icon}/>
                        </Popconfirm>
                  </span>
                  }
                </div>
                }
                { editGroupFormVisible &&
                <Form layout="inline">
                  <Form.Item>
                    {getFieldDecorator('editName', {
                      rules: [{required: true, message: 'Please input your group name!'}],
                      initialValue: menuData[menuActive],
                    })(
                      <Input placeholder="Group Name"/>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.onUpdateGroupSubmit}>提交</Button>
                  </Form.Item>
                </Form>
                }
              </div>
              <div>
                <Form onSubmit={this.onEmailFileSubmit} className={styles.uploadform}>
                  <Form.Item>
                    {getFieldDecorator('upload', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.getUploadNormFile,
                    })(
                      <Upload name="logo" action="/upload.do" listType="picture" className={styles.uploadBtn}>
                        <Button><Icon type="upload"/> 上传</Button>
                      </Upload>
                    )}
                  </Form.Item>
                </Form>
              </div>
            </div>
            <Tabs defaultActiveKey="1" className={styles.tab}>

              <Tabs.TabPane tab={<span>按周统计</span>} key="1">
                <EmailStatistics id="weekEchart" origin={weekLineData}/>
                <Table columns={weekColumns} dataSource={weekSubscribeData} size="middle"/>
              </Tabs.TabPane>

              <Tabs.TabPane tab={<span>按天统计</span>} key="2">
                <EmailStatistics id="dayEchart" origin={dayLineData}/>
                <Table columns={dayColumns} dataSource={daySubscribeData} size="middle"/>
              </Tabs.TabPane>

              <Tabs.TabPane tab={<span>邮件列表</span>} key="3">
                <Table columns={emailColumns} dataSource={emailListData()} scroll={{x: 1700, y: 800}} size="middle"/>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>

        <Modal
          title="创建"
          visible={this.state.createGroupVisible}
          onCancel={this.onHideGroupModal}
          footer={null}
        >
          <Form layout="inline" onSubmit={this.onCreateGroupSubmit}>
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [{required: true, message: 'Please input your group name!'}],
              })(
                <Input placeholder="Group Name" className={styles.addGroupName}/>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

export default Form.create()(EmailGroupIndex);
