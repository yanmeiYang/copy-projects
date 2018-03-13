/**
 * Created by ranyanchuan on 2018/3/8.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Layout } from 'components/layout';
import { Auth } from 'hoc';
import { theme, applyTheme } from 'themes';
import { Form, Popconfirm, message, Table, Upload, Input, Icon, Modal, Button, Radio, Tabs, Divider } from 'antd';
import { loadECharts } from 'utils/requirejs';
import EmailStatistics from './components/statistics/index';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const menuData = [
  "1.||||||||||||||", "2.||||||||||||||", "3.||||||||||||||", "4.||||||||||||||", "5.||||||||||||||",
  "6.||||||||||||||", "7.||||||||||||||", "8.||||||||||||||", "9.||||||||||||||", "10.|||||||||||||",
];
@connect(({app}) => ({app}))
@Auth
class EmailGroupIndex extends Component {

  state = {
    defaultGroup: menuData[0],
    mActive: 0,
    delEditIcon: false,
    createVisible: false,
    editForm: false,
  };

  componentWillUpdate(nextProps) {

  };

  menuSelect = (item, index) => {
    this.setState({mActive: index, defaultGroup: item});
  };

  showModal = () => {
    this.setState({createVisible: true});
  };
  hideModal = () => {
    this.setState({createVisible: false});
  };

  editGroupName = () => {
    this.setState({editForm: true});
  };

  createSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({createVisible: false});
      }
    });
  };

  emailFileSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  updateSubmit = (e) => {
    const values = this.props.form.getFieldsValue();
    if (values.editName) {
      this.setState({editForm: false, delEditIcon: false, defaultGroup: values.editName});
    }
  };

  showDelEditIcon = () => {
    this.setState({delEditIcon: true});
  };

  hideDelEditIcon = () => {
    this.setState({delEditIcon: false});
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  confirm = () => {
    message.info('Click on Yes.');
  };

  render() {
    const {mActive, delEditIcon, editForm, tabKey, defaultGroup} = this.state;
    const {getFieldDecorator} = this.props.form;
    const text = '您确认删除这个邮件组吗?';
    const weekColumns = [
      {title: '订阅用户', dataIndex: 'all'},
      {title: '新增用户', dataIndex: 'add'},
      {title: '主动订阅', dataIndex: 'active'},
      {title: '退订用户', dataIndex: 'cancel'},
      {title: '日期', dataIndex: 'date'}
    ];
    const weekData = [
      {key: '1', all: 4000, add: 320, active: 30, cancel: 10, date: '2018-03-10'},
      {key: '2', all: 4200, add: 420, active: 40, cancel: 4, date: '2018-03-05'},
      {key: '3', all: 4300, add: 320, active: 50, cancel: 20, date: '2018-03-01'},
      {key: '4', all: 4440, add: 320, active: 30, cancel: 3, date: '2018-02-25'},
      {key: '5', all: 4500, add: 420, active: 40, cancel: 30, date: '2018-02-20'},
      {key: '6', all: 4630, add: 320, active: 50, cancel: 10, date: '2018-02-15'},
      {key: '7', all: 4650, add: 320, active: 30, cancel: 3, date: '2018-02-10'},
    ];

    const dayColumns = [
      {title: '订阅用户', dataIndex: 'all'},
      {title: '新增用户', dataIndex: 'add'},
      {title: '主动订阅', dataIndex: 'active'},
      {title: '退订用户', dataIndex: 'cancel'},
      {title: '日期', dataIndex: 'date'}
    ];
    const dayData = [
      {key: '1', all: 4000, add: 32, active: 3, cancel: 3, date: '2018-03-10'},
      {key: '2', all: 5000, add: 42, active: 4, cancel: 4, date: '2018-03-11'},
      {key: '3', all: 6000, add: 32, active: 5, cancel: 5, date: '2018-03-12'},
      {key: '4', all: 4000, add: 32, active: 3, cancel: 3, date: '2018-03-10'},
      {key: '5', all: 5000, add: 42, active: 4, cancel: 4, date: '2018-03-11'},
      {key: '6', all: 6000, add: 32, active: 5, cancel: 5, date: '2018-03-12'},
      {key: '7', all: 4000, add: 32, active: 3, cancel: 3, date: '2018-03-10'},
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
    const emailData = [];
    for (let i = 0; i < 100; i++) {
      emailData.push({
        key: i,
        email: 'jery.tang@gmail.com',
        aid: '53f46a3edabfaee43ed05f08',
        attr: '主动',
        status: '正常',
        name: `jie tang ${i}`,
        pushNum: i,
        openNum: i,
        aff: '清华大学',
        position: '副教授',
        keyword: "Data Mining,Social Network",
        origin: "扫码",
        bookDate: "2018-02-01",
        cancelDate: "2018-03-08",
      });
    }
    const tableWidth = document.documentElement.clientWidth - 250;
    const originWeek = {
      date: ['2018-02-10', '2018-02-15', '2018-02-20', '2018-02-25', '2018-03-01', '2018-03-05', '2018-03-10'],
      data: [
        {
          name: '新增用户',
          type: 'line',
          data: [320, 420, 320, 320, 420, 320, 320]
        },
        {
          name: '主动订阅',
          type: 'line',
          data: [220, 182, 191, 234, 290, 230, 310]
        },
        {
          name: '退订用户',
          type: 'line',
          data: [150, 232, 201, 154, 190, 130, 410]
        },
        {
          name: '订阅用户',
          type: 'line',
          data: [4000, 4200, 4300, 4440, 4500, 4630, 4650]
        }
      ]
    };
    const originDay = {
      date: ['2018-03-04', '2018-03-05', '2018-03-06', '2018-03-07', '2018-03-08', '2018-03-09', '2018-03-10'],
      data: [
        {
          name: '新增用户',
          type: 'line',
          data: [32, 42, 32, 32, 42, 32, 32]
        },
        {
          name: '主动订阅',
          type: 'line',
          data: [22, 18, 19, 23, 29, 23, 31]
        },
        {
          name: '退订用户',
          type: 'line',
          data: [15, 23, 20, 15, 19, 13, 1]
        },
        {
          name: '订阅用户',
          type: 'line',
          data: [4320, 4390, 4440, 4580, 4610, 4630, 4650]
        }
      ]
    }

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div className={styles.emailGroup}>
          <div className={styles.menu}>
            <div className={styles.createMenu}>
              <Button icon="plus" onClick={this.showModal}>创建</Button>
            </div>
            <div className={styles.menuItems}>
              { menuData.map((menu, index) => {
                return (
                  <div className={mActive === index ? styles.itemActive : styles.item}
                       onClick={this.menuSelect.bind(this, menu, index)}
                       key={index.toString()}>
                    <span>{menu}</span>
                  </div>)
              })
              }
            </div>
          </div>

          <div style={{width: tableWidth}} className={styles.emailTable}>
            <div className={styles.groupAction}>
              <div className={styles.groupTitle} onMouseOver={this.showDelEditIcon} onMouseLeave={this.hideDelEditIcon}>
                {!editForm &&
                <div>
                  <span className={styles.title}>{defaultGroup}</span>
                  {delEditIcon &&
                  <span>
                        <span onClick={this.editGroupName}><Icon type="edit" className={styles.icon}/></span>
                        <span>
                          <Popconfirm placement="left" title={text} onConfirm={this.confirm} okText="Yes"
                                      cancelText="No">
                          <Icon type="delete" className={styles.icon}/>
                          </Popconfirm>
                        </span>
                  </span>
                  }
                </div>
                }
                { editForm &&
                <Form layout="inline">
                  <FormItem>
                    {getFieldDecorator('editName', {
                      rules: [{required: true, message: 'Please input your group name!'}],
                      initialValue: defaultGroup,
                    })(
                      <Input placeholder="Group Name"/>
                    )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" onClick={this.updateSubmit}>提交</Button>
                  </FormItem>
                </Form>
                }
              </div>
              <div>
                <Form onSubmit={this.emailFileSubmit} className={styles.uploadform}>
                  <FormItem>
                    {getFieldDecorator('upload', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(
                      <Upload name="logo" action="/upload.do" listType="picture" className={styles.uploadBtn}>
                        <Button><Icon type="upload"/> 上传</Button>
                      </Upload>
                    )}
                  </FormItem>
                </Form>
              </div>
            </div>
            <Tabs defaultActiveKey="1" className={styles.tab} onTabClick={this.onTabClick}>
              <TabPane tab={<span>按周统计</span>} key="1">
                <EmailStatistics id="weekEchart" origin={originWeek}/>
                <Table columns={weekColumns} dataSource={weekData} size="middle"/>
              </TabPane>
              <TabPane tab={<span>按天统计</span>} key="2">
                <EmailStatistics id="dayEchart" origin={originDay}/>
                <Table columns={dayColumns} dataSource={dayData} size="middle"/>
              </TabPane>
              <TabPane tab={<span>邮件列表</span>} key="3">
                <Table columns={emailColumns} dataSource={emailData} scroll={{x: 1700, y: 800}} size="middle"/>
              </TabPane>
            </Tabs>
          </div>
        </div>

        <Modal
          title="创建"
          visible={this.state.createVisible}
          onCancel={this.hideModal}
          footer={null}
        >
          <Form layout="inline" onSubmit={this.createSubmit}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{required: true, message: 'Please input your group name!'}],
              })(
                <Input placeholder="Group Name" className={styles.addGroupName}/>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit">提交</Button>
            </FormItem>
          </Form>
        </Modal>
      </Layout>
    );
  }
}

export default Form.create()(EmailGroupIndex);
