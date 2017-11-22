import React, { Component } from 'react';
import { connect } from 'dva';
import { getLocalToken, saveLocalToken } from 'utils/auth';
import { PersonList } from 'components/person';
import { Button, Input, Form, Col, Radio, Spin, Select, Upload } from 'antd';
import CanlendarInForm from '../../seminar/calendar';
import { config } from '../../../utils';
import styles from './addExperModal.less';
import defaultImg from '../../../assets/people/default.jpg';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(({ loading }) => ({ loading }))
class AddExperModal extends Component {
  state = {
    talkStartValue: null,
    talkEndValue: null,
    addNewTalk: false,
    picSrc: defaultImg,
    isEdit: false,
    newRole: [],
  };

  componentDidMount() {
    if (this.props.address) {
      this.props.form.setFieldsValue({
        address: this.props.address,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editTheTalk !== nextProps.editTheTalk) {
      if (nextProps.editTheTalk.speaker) {
        const modifyTalk = nextProps.editTheTalk;
        this.setState({
          newRole: modifyTalk.speaker.role,
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.editTheTalk !== prevProps.editTheTalk) {
      this.editTalk(this.props.editTheTalk);
    }
  }

  // 获取时间
  onChildTalkChanged = (field, value) => {
    if (field === 'startValue') {
      this.setState({ talkStartValue: value });
    } else {
      this.setState({ talkEndValue: value });
    }
  };
// 清空已选择的专家
  notFoundSuggestExpert = () => {
    const data = {
      payload: { name: '', aff: '', aff_zh: '', id: '', org: '', org_zh: '', position: '' },
      bio: '',
      email: '',
      img: defaultImg,
      phone: '',
      pos: [],
      role: this.speakerInformation.role,
    };
    this.props.dispatch({ type: 'seminar/cancleSuggestExpert', payload: data });
  };
// 修改专家信息
  editTalk = (modifyTalk) => {
    this.props.form.setFieldsValue({
      name: modifyTalk.speaker.name,
      title: modifyTalk.title,
      address: modifyTalk.location.address,
      abstract: modifyTalk.abstract,
      phone: modifyTalk.speaker.phone,
      email: modifyTalk.speaker.email,
      bio: modifyTalk.speaker.bio,
      affiliation: modifyTalk.speaker.affiliation,
      position: modifyTalk.speaker.position,
      label: modifyTalk.speaker.stype.label,
    });
    this.setState({
      isEdit: true,
      picSrc: modifyTalk.speaker.img,
    });
  };
//保存所有信息
  saveExpertInfo = (type, e) => {
    this.speakerInformation[type] = e.target.value;
  };
//提交按钮提交form内所有value
  handle = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.speakerInfoNew = {
          title: this.speakerInformation.talkTitle || values.title || '',
          speaker: {
            name: values.name,
            position: values.position,
            affiliation: values.affiliation,
            img: this.state.picSrc,
            aid: this.speakerInformation.aid,
            bio: values.bio,
            stype: {
              label: this.speakerInformation.stype.label || values.label,
              score: this.speakerInformation.stype.score || 0,
            },
            role: this.state.newRole,
            gender: this.speakerInformation.gender || 0,
            phone: values.phone,
            email: values.email,
          },
          location: {
            city: '',
            address: this.speakerInformation.talkLocation || values.address || this.props.address,
          },
          abstract: this.speakerInformation.talkAbstract || values.abstract || '',
          time: {
            from: this.state.talkStartValue || this.props.talkStartTime,
            to: this.state.talkEndValue || this.props.talkEndTime,
          },
        };
        this.props.callbackParent(this.speakerInfoNew, this.state.isEdit);
        this.deleteSpeakerInfo();
        this.notFoundSuggestExpert();
        this.setState({
          isEdit: false,
          picSrc: defaultImg,
          newRole: [],
        });
      }
    });
  };
  // 清空所有信息
  deleteSpeakerInfo = () => {
    this.speakerInformation = {
      name: '',
      position: '',
      affiliation: '',
      aid: '',
      img: '',
      bio: '',
      gender: '',
      email: '',
      phone: '',
      stype: {},
      role: [],
      talkTitle: '',
      talkLocation: '',
      talkAbstract: '',
      professionalTitle: '',
    };
  };
// 增加专家
  addTalkData = () => {
    this.setState({ newRole: ['talk'] });
  };
// 增加主席事件
  addTalkTest = () => {
    this.setState({ newRole: ['president'] });
  };
//添加此人事件
  selectedExpert = (person) => {
    const speaker = {
      payload: person.person,
    };
    this.speakerInformation.aid = person.person.id;
    this.props.dispatch({
      type: 'seminar/saveSuggestExpert',
      payload: { speaker },
    }).then(() => {
      const res = this.props.seminar.selectedSuggestSpeaker;
      this.props.form.setFieldsValue({
        name: res.payload.name_zh || res.payload.name,
        position: res.payload.profile.position,
        bio: res.bio,
        email: res.email,
        affiliation: res.payload.profile.affiliation,
        phone: res.phone,
        src: res.payload.avatar,
      });
      this.setState({
        picSrc: res.payload.avatar,
      });
    });
  };

  activityTypeChange = (value) => {
    this.speakerInformation.stype.label = value.split('#')[0];
    this.speakerInformation.stype.score = parseInt(value.split('#')[1], 10);
  };
  speakerInformation = {
    name: '',
    position: '',
    affiliation: '',
    aid: '',
    img: '',
    bio: '',
    gender: '',
    email: '',
    phone: '',
    stype: {},
    role: [],
    talkTitle: '',
    talkLocation: '',
    talkAbstract: '',
    professionalTitle: '',
  };
  speakerInfoNew = {
    title: '',
    speaker: {
      name: '',
      position: '',
      affiliation: '',
      img: '',
      aid: '',
      bio: '',
      stype: { label: this.speakerInformation.stype, score: 0 },
      role: [],
      gender: { i: '', s: '' },
      phone: '',
      email: '',
    },
    location: { city: '', address: '' },
    abstract: '',
    time: { from: '', to: '' },
  };

//寻找专家
  suggestExpert = (type) => {
    // let data = {};
    let data = {
      name: this.speakerInformation.name,
      position: this.speakerInformation.professionalTitle,
      affiliation: this.speakerInformation.affiliation,
      title: '',
    };
    if (type === 0) {
      if (this.speakerInformation.name.length !== 0) {
        this.props.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
      }
    }
  };

  render() {
    const load = this.props.loading.effects['seminar/getSpeakerSuggest'];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const outerThis = this;
    const changeExpertAvatar = {
      name: 'file',
      action: config.api.uploadActivityPosterImgFile,
      headers: {
        Authorization: getLocalToken(),
      },
      onChange(info) {
        info.file.status = 'done';
      },
      onSuccess(response) {
        outerThis.setState({
          picSrc: response.url,
        });
      },
    };
    const { contribution_type } = this.props;
    const { newRole } = this.state;
    const { getFieldDecorator } = this.props.form;
    const speakerSuggestsInfo = this.props.seminar.speakerSuggests;
    const data = speakerSuggestsInfo.map((speaker) => {
      return {
        avatar: speaker.img,
        indices: {
          hindex: speaker.payload.h_index,
          citations: speaker.payload.n_citation,
          pubs: speaker.payload.n_pubs,
        },
        id: speaker.payload.id,
        name: speaker.payload.name,
        name_zh: speaker.payload.name_zh,
        profile: {
          affiliation: speaker.payload.aff_zh,
          position: speaker.payload.position,
        },
      };
    });
    const button = [
      (person) => {
        return (
          <div key={100}>
            <Button onClick={this.selectedExpert.bind(this, person)} size="small">添加此人</Button>
          </div>
        );
      },
    ];

    return (
      <div className={styles.add}>
        <div className={styles.addNewExpert}>
          <Button onClick={this.addTalkTest.bind(this, this.state.addNewTalk)}>新增主席</Button>
          <Button onClick={this.addTalkData.bind(this, this.state.addNewTalk)}>新增专家</Button>
        </div>
        {newRole.length > 0 &&
        <div className={styles.box}>
          <Col span={24}>
            <Form onSubmit={this.handle}>
              <div className={styles.activeBox}>
                {newRole[0] === 'talk' &&
                <FormItem className={styles.info}
                          {...formItemLayout}
                          label="演讲标题"
                >
                  {getFieldDecorator('title', {
                    rules: [{
                      required: true, message: '请输入演讲标题',
                    }],
                  })(<Input placeholder="请输入演讲标题" className={styles.inputBox}
                            onBlur={this.saveExpertInfo.bind(this, 'talkTitle')} />)}
                </FormItem>}
                {newRole[0] === 'talk' &&
                <FormItem className={styles.info}
                          {...formItemLayout}
                          label={(<span>活动时间</span>)}
                          hasFeedback>
                  {getFieldDecorator('time', {
                    rules: [{
                      message: '请输入活动时间',
                    }],
                  })(<CanlendarInForm callbackParent={this.onChildTalkChanged}
                                      startValue={this.state.talkStartValue}
                                      endValue={this.state.talkEndValue} />)}
                </FormItem>}
                {newRole[0] === 'talk' &&
                <FormItem className={styles.info}
                          {...formItemLayout}
                          label={(<span>演讲地点</span>)}>
                  {getFieldDecorator('address', {
                    rules: [{
                      required: true, message: '请输入活动地点',
                    }],
                  })(<Input placeholder="请输入活动地点" className={styles.inputBox}
                            onBlur={this.saveExpertInfo.bind(this, 'talkLocation')} />)}
                </FormItem>}
                {contribution_type.data &&
                <FormItem className={styles.info}
                          {...formItemLayout}
                          label="贡献类别"
                >
                  {getFieldDecorator('label', {
                    rules: [{
                      required: true, message: '请选择贡献类别',
                    }],
                  })(<Select
                    showSearch
                    style={{ width: 260 }}
                    placeholder="请选择贡献类别"
                    optionFilterProp="children"
                    onChange={this.activityTypeChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {Object.values(contribution_type.data).map((item) => {
                      return (<Option key={item.id}
                                        value={`${item.key}#${item.value}`}>{item.key}</Option>);
                      })}
                  </Select>)}
                </FormItem>}
                {newRole[0] === 'talk' &&
                <FormItem className={styles.info}
                          {...formItemLayout}
                          label={(<span>演讲摘要</span>)}>
                  {getFieldDecorator('abstract', {
                    rules: [{
                      required: true, message: '请输入演讲摘要',
                    }],
                  })(<Input type="textarea" rows={4} placeholder="请输入演讲摘要"
                            className={styles.textBox}
                            onBlur={this.saveExpertInfo.bind(this, 'talkAbstract')} />)}
                </FormItem>}
              </div>
              <Col span={12}>
                <div className={styles.specialist}>
                  <Col span={6}>
                    <section>
                      <div className="people">
                        <div className="no-padding shadow-10">
                          <div className={styles.crop}>
                            <span className="helper" />
                            <img src={this.state.picSrc} alt="" />
                            <input style={{ display: 'none' }} />
                          </div>
                          <Upload {...changeExpertAvatar}>
                            <button type="button" className="ant-btn ant-btn-ghost">
                              <i className="anticon anticon-upload" /> 修改头像
                            </button>
                          </Upload>
                        </div>
                      </div>
                    </section>
                  </Col>
                  <Col span={18}>
                    <div className={styles.talkBox}>
                      <label className="ant-col-3">姓名: </label>
                      <div className="ant-col-21">
                        {getFieldDecorator('name', {
                          rules: [{
                            required: true, message: '请输入专家姓名',
                          }],
                        })(<Input size="large" placeholder="专家姓名"
                                  onPressEnter={this.suggestExpert.bind(this, 0)}
                                  onChange={this.saveExpertInfo.bind(this, 'name')}
                                  onBlur={this.suggestExpert.bind(this, 0)} />)}
                      </div>
                    </div>
                    <div className={styles.gender}>
                      <label className="ant-col-3">性别: </label>
                      <div className="ant-col-21">
                        <RadioGroup defaultValue="0"
                                    onChange={this.saveExpertInfo.bind(this, 'gender')}>
                          <Radio value="0" name="gender">男</Radio>
                          <Radio value="1" name="gender">女</Radio>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className={styles.talkBox}>
                      <label className="ant-col-3">职称: </label>
                      <div className="ant-col-21">
                        {getFieldDecorator('position', {
                          rules: [{
                            required: true, message: '请输入专家职称',
                          }],
                        })(<Input size="large" placeholder="专家职称" className={styles.inputSize}
                                  onChange={this.saveExpertInfo.bind(this, 'professionalTitle')}
                                  onBlur={this.suggestExpert.bind(this, 0)} />)}
                      </div>
                    </div>
                    <div className={styles.talkBox}>
                      <FormItem>
                        <label className="ant-col-3">单位: </label>
                        <div className="ant-col-21">
                          {getFieldDecorator('affiliation', {
                            rules: [{
                              required: true, message: '请输入专家单位',
                            }],
                          })(<Input size="large" placeholder="专家单位"
                                    onChange={this.saveExpertInfo.bind(this, 'affiliation')}
                                    onBlur={this.suggestExpert.bind(this, 0)} />)}
                        </div>
                      </FormItem>
                    </div>
                    <div className={styles.talkBox}>
                      <FormItem>
                        <label className="ant-col-3">电话: </label>
                        <div className="ant-col-21">
                          {getFieldDecorator('phone', {
                            rules: [{
                              required: true, message: '请输入专家电话',
                            }],
                          })(<Input size="large" placeholder="电话" className={styles.inputSize}
                                    onBlur={this.saveExpertInfo.bind(this, 'phone')} />)}
                        </div>
                      </FormItem>
                    </div>
                    <div className={styles.talkBox}>
                      <FormItem>
                        <label className="ant-col-3">邮箱: </label>
                        <div className="ant-col-21">
                          {getFieldDecorator('email', {
                            rules: [{
                              required: true, message: '请输入专家邮箱',
                            }],
                          })(<Input size="large" placeholder="邮箱" className={styles.inputSize}
                                    onBlur={this.saveExpertInfo.bind(this, 'email')} />)}
                        </div>
                      </FormItem>
                    </div>
                  </Col>
                  <Col span={24}>
                    <FormItem className={styles.talkBio}>
                      <label className="ant-col-3">专家简介: </label>
                      <div className="ant-col-21">
                        {getFieldDecorator('bio', {
                          rules: [{
                            required: true, message: '请输入专家简介',
                          }],
                        })(<Input type="textarea" rows={4} size="large" placeholder="专家简介"
                                  onBlur={this.saveExpertInfo.bind(this, 'bio')} />)}
                      </div>
                    </FormItem>
                  </Col>
                </div>
                <Button key="submit" htmlType="submit" type="primary" size="large"
                        className={styles.sumbBtn}>提交
                </Button>
              </Col>
              <Col span={12} className={styles.personWrap}>
                <div className={styles.personBox}>
                  {this.speakerInformation.name.length <= 0 &&
                  <p className={styles.message}>请在左侧输入姓名,会有智能提示您所输入的专家信息,可快速添加!</p>}
                  {this.speakerInformation.name.length > 0 &&
                  <Spin spinning={load}>
                    <PersonList
                      persons={data}
                      type="tiny"
                      indicesType={'text'}
                      PersonList_PersonLink_NewTab={true}
                      rightZoneFuncs={button}
                      showIndices={['h_index', 'citations', 'num_pubs']}
                    />
                  </Spin>}
                </div>
              </Col>
            </Form>
          </Col>
        </div>}
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(Form.create()(AddExperModal));
