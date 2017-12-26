/**
 * Created by yangyanmei on 17/6/20.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Modal, Button, Input, Form, Col, Tag, Icon, Radio, Spin, Select, Upload } from 'antd';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { getLocalToken, saveLocalToken } from 'utils/auth';
import CanlendarInForm from '../calendar';
import defaultImg from '../../../assets/people/default.jpg';
import ExpertBasicInfo from './expertBasicInfo';
import { config } from '../../../utils';
import * as profileUtils from '../../../utils/profile-utils';
import styles from './index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class AddExpertModal extends React.Component {
  state = {
    modalVisible: true,
    step2: false,
    step3: false,
    talkStartValue: null,
    talkEndValue: null,
    speakerInfo: {},
    name: '',
    position: '',
    affiliation: '',
    talkAbstract: '',
    isEdit: false,
    isSearched: false, // 是否搜索过，没有搜索到结果显示'没有推荐专家'
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
    role: 'talker',
  };

  componentWillMount() {
    if (this.props.startValue) {
      this.setState({ talkStartValue: this.props.startValue });
    }
    if (this.props.endValue) {
      this.setState({ talkEndValue: this.props.endValue });
    }
  }

  componentDidMount() {
    if (this.props.editTheTalk.speaker) {
      const editTheTalk = this.props.editTheTalk;
      const setFormFieldsVale = this.props.parentProps.form;
      this.props.parentProps.seminar.speakerSuggests = [];
      this.setState({
        isEdit: true,
        speakerInfo: editTheTalk.speaker,
        talkStartValue: editTheTalk.time ? editTheTalk.time.from : '',
        talkEndValue: editTheTalk.time ? editTheTalk.time.to : '',
      });
      this.speakerInformation = this.props.editTheTalk.speaker;
    }
    //TODO 地点携带问题,在这里取不到refs
    // if (this.props.address) {
    //   ReactDOM.findDOMNode(this.refs.talkLocation).value = this.props.address;
    // }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.parentProps.seminar.selectedSuggestSpeaker === this.props.parentProps.seminar.selectedSuggestSpeaker) {
      return false;
    }
    const selectedExpert = nextProps.parentProps.seminar.selectedSuggestSpeaker;
    this.speakerInformation.name = this.refs.speakerName.input.value = profileUtils.displayNameCNFirst(selectedExpert.payload.name, selectedExpert.payload.name_zh);
    this.speakerInformation.affiliation = this.refs.speakerAff.input.value = selectedExpert.payload.org;
    selectedExpert.pos.length > 0 && selectedExpert.pos[0].n ? this.speakerInformation.position = this.refs.speakerPos.input.value = selectedExpert.pos[0].n : this.speakerInformation.position = this.refs.speakerPos.input.value = '';
    this.speakerInformation.aid = this.refs.speakerAid.value = selectedExpert.payload.id;
    this.speakerInformation.img = this.refs.speakerImg.src = selectedExpert.img;
    this.speakerInformation.bio = selectedExpert.bio;
    this.speakerInformation.phone = selectedExpert.phone;
    this.speakerInformation.email = selectedExpert.email;
    this.speakerInformation.role = typeof selectedExpert.role === 'string' ? [selectedExpert.role] : selectedExpert.role;
    ReactDOM.findDOMNode(this.refs.speakerBio).value = selectedExpert.bio;
    ReactDOM.findDOMNode(this.refs.speakerIphone).value = selectedExpert.phone;
    ReactDOM.findDOMNode(this.refs.speakerEmail).value = selectedExpert.email;
    this.setState({
      speakerInfo: this.speakerInformation,
    });
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps && (this.state.isEdit !== prevState.isEdit)) {
      const editTheTalk = this.props.editTheTalk;
      const setFormFieldsVale = this.props.parentProps.form;
      this.props.parentProps.seminar.speakerSuggests = [];
      this.speakerInformation = this.props.editTheTalk.speaker;
      ReactDOM.findDOMNode(this.refs.talkTitle).value = editTheTalk.title;
      ReactDOM.findDOMNode(this.refs.talkLocation).value = editTheTalk.location ? editTheTalk.location.address : '';
      ReactDOM.findDOMNode(this.refs.talkAbstract).value = editTheTalk.abstract;
      setFormFieldsVale.setFieldsValue({ contrib: editTheTalk.speaker.stype.label });
      editTheTalk.speaker.role !== undefined ? setFormFieldsVale.setFieldsValue({ role: editTheTalk.speaker.role[0] }) : '';
      ReactDOM.findDOMNode(this.refs.name).value = editTheTalk.speaker.name;
      ReactDOM.findDOMNode(this.refs.speakerName).value = editTheTalk.speaker.name;
      ReactDOM.findDOMNode(this.refs.speakerPos).value = editTheTalk.speaker.position;
      ReactDOM.findDOMNode(this.refs.speakerAff).value = editTheTalk.speaker.affiliation;
      ReactDOM.findDOMNode(this.refs.speakerIphone).value = editTheTalk.speaker.phone;
      ReactDOM.findDOMNode(this.refs.speakerEmail).value = editTheTalk.speaker.email;
      ReactDOM.findDOMNode(this.refs.speakerBio).value = editTheTalk.speaker.bio;
      ReactDOM.findDOMNode(this.refs.speakerImg).src = editTheTalk.speaker.img;
      if (this.props.address) {
        ReactDOM.findDOMNode(this.refs.talkLocation).value = this.props.address;
      }
    }
  }

  setModalVisible() {
    this.setState({ modalVisible: false });
    this.speakerInformation = {
      name: '', position: '', affiliation: '', aid: '', img: '', bio: '', gender: '', email: '',
      phone: '', stype: {}, role: 'talker',
    };
    this.props.callbackParentSetAddNewTalk();
  }

  setStep(step, visible) {
    this.setState({ [step]: visible });
  }

  // 增加专家
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };
  // 获取演讲时间
  onChildTalkChanged = (field, value) => {
    if (field === 'startValue') {
      this.setState({ talkStartValue: value });
    } else {
      this.setState({ talkEndValue: value });
    }
  };
  // 清空已选择的专家
  notFoundSuggestExpert = () => {
    this.setStep('step3', true);
    const data = {
      payload: { name: '', aff: '', aff_zh: '', id: '', org: '', org_zh: '', position: '' },
      bio: '',
      email: '',
      img: defaultImg,
      phone: '',
      pos: [],
      role: this.speakerInformation.role,
    };
    this.props.parentProps.dispatch({ type: 'seminar/cancleSuggestExpert', payload: data });
  };
  // 选择一位推荐专家
  selectedExpert = (speaker) => {
    this.notFoundSuggestExpert();
    speaker.role = this.speakerInformation.role;
    this.props.parentProps.dispatch({ type: 'seminar/saveSuggestExpert', payload: { speaker } });
    this.setState({
      step3: true,
      step2: false,
      step1: false,
    });
    this.props.parentProps.seminar.speakerSuggests = [];
  };
  // 修改当前专家信息
  saveExpertInfo = (type, e) => {
    this.speakerInformation[type] = e.target.value;
    this.setState({ speakerInfo: this.speakerInformation });
  };
  setTalkAbstrack = (e) => {
    this.setState({ talkAbstract: e.target.value });
  };
  saveTalkData = () => {
    const state = this.state;
    const { getFieldValue, setFieldsValue } = this.props.parentProps.form;
    const talk = {
      title: '',
      speaker: {
        name: '',
        position: '',
        affiliation: '',
        img: '',
        aid: '',
        bio: '',
        stype: { label: '', score: 0 },
        role: [],
      },
      location: { city: '', address: '' },
      abstract: '',
    };
    talk.title = this.refs.talkTitle.input.value;
    talk.speaker = state.speakerInfo;
    if (typeof state.speakerInfo.gender !== 'number') {
      if (typeof state.speakerInfo.gender === 'object') {
        talk.speaker.gender = parseInt(state.speakerInfo.gender.i);
      } else {
        talk.speaker.gender = 1;
      }
    }
    if (state.talkStartValue || state.talkEndValue) {
      talk.time = {};
    }
    if (talk.speaker.stype && (!talk.speaker.stype.label || talk.speaker.stype.label === '')) {
      talk.speaker.stype = {
        label: getFieldValue('contrib').split('#')[0],
        score: parseInt(getFieldValue('contrib').split('#')[1]),
      };
    }
    talk.speaker.role = typeof getFieldValue('role') === 'string' ? [getFieldValue('role')] : [];
    if (state.talkStartValue) {
      talk.time.from = typeof state.talkStartValue === 'string' ? state.talkStartValue : state.talkStartValue.toJSON();
    }
    if (state.talkEndValue) {
      talk.time.to = typeof state.talkStartValue === 'string' ? state.talkEndValue : state.talkEndValue.toJSON();
    }
    talk.location.address = this.refs.talkLocation.input.value;
    talk.abstract = ReactDOM.findDOMNode(this.refs.talkAbstract).value;
    this.props.callbackParent(talk, state.isEdit);
    this.setState({ modalVisible: false });
    setFieldsValue({ role: 'talker' });
    this.speakerInformation = {
      name: '', position: '', affiliation: '', aid: '', img: '', bio: '', gender: '', email: '',
      phone: '', stype: {}, role: 'talker',
    };
  };

  suggestExpert(type) {
    let data = {};
    data = {
      name: this.refs.name.input.value,
      position: this.refs.pos.input.value,
      affiliation: this.refs.aff.input.value,
      title: '',
    };
    if (type === 0) {
      if (this.state.name !== this.refs.name.input.value || this.state.position !== this.refs.pos.input.value || this.state.affiliation !== this.refs.aff.input.value) {
        this.props.parentProps.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
      }
    } else {
      this.props.parentProps.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
    }
    if (this.props.editTheTalk.speaker !== undefined) {
      this.props.editTheTalk.speaker = {};
    }
    this.setState({
      name: this.refs.name.input.value,
      position: this.refs.pos.input.value,
      affiliation: this.refs.aff.input.value,
      isSearched: true,
      speakerInfo: {},
    });
  }

  activityTypeChange = (value) => {
    this.speakerInformation.stype.label = value.split('#')[0];
    this.speakerInformation.stype.score = parseInt(value.split('#')[1]);
    // this.speakerInformation.role = this.props.parentProps.form.getFieldValue('role');
  };
  expertRoleChange = (value) => {
    this.speakerInformation.role = value;
    const setFormFieldsVale = this.props.parentProps.form;
    setFormFieldsVale.setFieldsValue({ contrib: '', role: value });
  };
  jumpToStep2 = () => {
    this.props.parentProps.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setStep('step2', true);
      }
    });
  };
  cancelCurrentPerson = () => {
    this.props.parentProps.seminar.speakerSuggests = [];
    this.setState({ step2: true, step3: false, isSearched: false });
  };

  render() {
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
        outerThis.refs.speakerImg.src = response.url;
        const data = { target: { value: response.url } };
        outerThis.saveExpertInfo('img', data);
      },
    };
    const { modalVisible, step2, step3, isEdit, speakerInfo, isSearched } = this.state;
    const { parentProps, editTheTalk } = this.props;
    const { speakerSuggests, loading, contribution_type } = parentProps.seminar;
    const { getFieldDecorator, getFieldValue } = parentProps.form;
    const isTalker = getFieldValue('role') || 'talker';
    const getPersonLoading = this.props.loading.effects['seminar/saveSuggestExpert'];
    return (
      <Modal
        title="添加专家"
        visible={modalVisible}
        maskClosable={false}
        width={640}
        footer={null}
        wrapClassName={styles.addExpertModal}
        onCancel={this.setModalVisible.bind(this)}
      >
        <div id="area">
          <div className={!step2 && !step3 ? styles.showStep4 : styles.hideStep4}>
            <FormItem
              {...formItemLayout}
              label={(<span>专家角色</span>)}>
              {getFieldDecorator('role', { initialValue: 'talker' })(
                <Select
                  className={styles.inputBox}
                  style={{ width: 200 }}
                  placeholder="请选择专家角色"
                  onChange={this.expertRoleChange}
                >
                  <Option value="president">主席(包括主持人/主编等)</Option>
                  <Option value="talker">特邀嘉宾(包括报告人/评审人/评奖人等)</Option>
                </Select>)}
            </FormItem>
            <div
              className={classnames({ [styles.isShowActivityDesc]: isTalker === 'president' })}>
              <FormItem
                {...formItemLayout}
                label="演讲标题"
              >
                <Input placeholder="请输入演讲标题" ref="talkTitle" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(<span>活动时间</span>)}
                hasFeedback>
                <CanlendarInForm callbackParent={this.onChildTalkChanged} forbidCallback={true}
                                 startValue={this.state.talkStartValue}
                                 endValue={this.state.talkEndValue} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(<span>演讲地点</span>)}>
                <Input placeholder="请输入活动地点" ref="talkLocation" />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={(<span>演讲摘要</span>)}>
                <Input type="textarea" rows={4} placeholder="请输入演讲摘要" ref="talkAbstract"
                       onBlur={this.setTalkAbstrack} />
              </FormItem>
            </div>
            {contribution_type.data && <FormItem
              {...formItemLayout}
              label="贡献类别"
            >
              {getFieldDecorator('contrib', {
                rules: [{
                  required: true, message: '请选择贡献类别',
                }],
              })(
                <Select
                  className={styles.inputBox}
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择贡献类别"
                  optionFilterProp="children"
                  getPopupContainer={() => document.getElementById('area')}
                  onChange={this.activityTypeChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    Object.values(contribution_type.data).map((item) => {
                      return (<Option key={item.id}
                                      value={`${item.key}#${item.value}`}>{item.key}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>}
            <div style={{ height: 20 }}>
              <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                      onClick={this.jumpToStep2.bind()}>
                下一步
              </Button>
            </div>
          </div>
          <div
            className={`ant-form-item ${step2 && !step3 ? styles.showStep4 : styles.hideStep4}`}>
            <Col><label>专家信息</label></Col>
            <div className={styles.searchExpertBtn}>
              <div className="ant-col-7">
                <Input placeholder="专家姓名" ref="name"
                       onPressEnter={this.suggestExpert.bind(this, 0)}
                       onBlur={this.suggestExpert.bind(this, 0)} />
              </div>
              <div className="ant-col-7">
                <Input placeholder="专家职称" ref="pos"
                       onPressEnter={this.suggestExpert.bind(this, 0)}
                       onBlur={this.suggestExpert.bind(this, 0)} />
              </div>
              <div className="ant-col-7">
                <Input placeholder="专家单位" ref="aff"
                       onPressEnter={this.suggestExpert.bind(this, 0)}
                       onBlur={this.suggestExpert.bind(this, 0)} />
              </div>
              <div className="ant-col-2">
                <Button type="primary" onClick={this.suggestExpert.bind(this, 1)}>
                  推荐
                </Button>
              </div>
            </div>
            <div className={styles.personWrap}>
              <Spin spinning={loading} style={{ marginTop: 30 }}>
                {speakerSuggests.length > 0 ?
                  <div>
                    {speakerSuggests.map((speaker) => {
                      const position = profileUtils.displayPosition(speaker.pos);
                      const aff = speaker.payload.aff ? speaker.payload.aff : null;
                      const name = profileUtils.displayNameCNFirst(speaker.payload.name, speaker.payload.name_zh);
                      return (
                        <li key={speaker.payload.id} className={styles.person}>
                          <div className={styles.left}>
                            <img src={this.getImg(speaker.img)} alt="头像" />
                          </div>
                          <div className={styles.right}>
                            <div className={styles.nameWrap}>
                              <h3>{name}</h3>
                            </div>
                            <div className={styles.statWrap}>
                              <div className={styles.item}>
                                <span className={styles.label}>h-index:</span>
                                <span>{speaker.payload.h_index}</span>
                              </div>
                              <span className={styles.split}>|</span>
                              <div className={styles.item}>
                                <span className={styles.label}>论文数:</span>
                                <span>{speaker.payload.n_pubs}</span>
                              </div>
                              <span className={styles.split}>|</span>
                              <div className={styles.item}>
                                <span className={styles.label}>引用数:</span>
                                <span>{speaker.payload.n_citation}</span>
                              </div>
                            </div>
                            <div className={styles.infoWrap}>
                              <p>
                                {position &&
                                <span className={styles.infoItem}>
                                  <Icon type="idcard" />{position}
                                </span>}
                              </p>

                              <p>{aff && <span className={styles.infoItem}>
                                <Icon type="home" />
                                {aff}
                              </span>}</p>
                            </div>
                            <div className={styles.tagWrap}>
                              {speaker.tags && speaker.tags.slice(0, 5).map((tag, index) => {
                                if (tag === 'Null') {
                                  return '';
                                }
                                return (
                                  <Tag key={`${tag.t}_${index}`} className={styles.tag}>
                                    {tag.t}
                                  </Tag>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <Button type="primary"
                                    onClick={this.selectedExpert.bind(this, speaker)}>添加此人</Button>
                          </div>
                        </li>
                      );
                    })}
                  </div> :
                  <div>
                    {isSearched &&
                    <div className={styles.noExpertsRecomm}><span>没有推荐专家</span></div>}
                  </div>
                }
              </Spin>
              {/* 活动页面点编辑展示的内容 */}
              {isEdit && editTheTalk.speaker !== undefined && editTheTalk.speaker.name !== undefined &&
              <ExpertBasicInfo currentExpert={editTheTalk.speaker} />
              }
              {/* 非活动详情页面编辑 */}
              {speakerSuggests.length === 0 && !isEdit && speakerInfo.name &&
              <ExpertBasicInfo currentExpert={speakerInfo} />
              }
            </div>
            <div style={{ height: 20 }}>
              {!isSearched && speakerInfo.name !== undefined && speakerInfo.name !== '' &&
              <Button key="" type="primary"
                      style={{ float: 'right', marginTop: 10, marginLeft: 10 }}
                      onClick={() => this.setStep('step3', true)}>
                下一步
              </Button>}
              <Button key="submit" type="primary"
                      style={{ float: 'right', marginTop: 10 }}
                      onClick={() => this.notFoundSuggestExpert()}>
                未找到，手工填写信息
              </Button>
              <Button type="default" style={{ marginTop: 10 }}
                      onClick={() => this.setStep('step2', false)}>
                上一步
              </Button>
            </div>
          </div>

          <div className={`${step3 ? styles.showStep4 : styles.hideStep4}`}
               style={{ minHeight: 392, maxHeight: 800 }}>
            <Col><label>专家信息</label></Col>

            <Col span={6}>
              <section>
                <div className="people">
                  <div className="no-padding shadow-10">
                    <div className={styles.crop}>
                      <span className="helper" />
                      <img src={this.getImg()} ref="speakerImg" alt="" />
                      <input ref="speakerAid" style={{ display: 'none' }} />
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
            <Col span={18} className={styles.expertProfile}>
              <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
                <label className="ant-col-3">姓名: </label>
                <div className="ant-col-21">
                  <Input placeholder="专家姓名" ref="speakerName"
                         onBlur={this.saveExpertInfo.bind(this, 'name')} />
                </div>
              </div>

              <div className="ant-form-item" style={{ paddingBottom: '20px' }}>
                <label className="ant-col-3">性别: </label>
                <div className="ant-col-21">
                  <RadioGroup defaultValue="1"
                              onChange={this.saveExpertInfo.bind(this, 'gender')}>
                    <Radio value="1" name="gender">男</Radio>
                    <Radio value="2" name="gender">女</Radio>
                    <Radio value="0" name="gender">不详</Radio>
                  </RadioGroup>
                </div>
              </div>
              <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
                <label className="ant-col-3">职称: </label>
                <div className="ant-col-21">
                  <Input placeholder="专家职称" ref="speakerPos"
                         onBlur={this.saveExpertInfo.bind(this, 'position')} />
                </div>
              </div>
              <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
                <label className="ant-col-3">单位: </label>
                <div className="ant-col-21">
                  <Input placeholder="专家单位" ref="speakerAff"
                         onBlur={this.saveExpertInfo.bind(this, 'affiliation')} />
                </div>
              </div>
              <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
                <label className="ant-col-3">电话: </label>
                <div className="ant-col-21">
                  <Input placeholder="电话" ref="speakerIphone"
                         onBlur={this.saveExpertInfo.bind(this, 'phone')} />
                </div>
              </div>
              <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
                <label className="ant-col-3">邮箱: </label>
                <div className="ant-col-21">
                  <Input placeholder="邮箱" ref="speakerEmail"
                         onBlur={this.saveExpertInfo.bind(this, 'email')} />
                </div>
              </div>
            </Col>
            <Col span={24}>
              <label className="ant-col-3">专家简介: </label>
              <div className="ant-col-21">
                <Input.TextArea rows={4} size="large" placeholder="专家简介" ref="speakerBio"
                                onBlur={this.saveExpertInfo.bind(this, 'bio')} />
                {/*<Input type="textarea" rows={4} size="large" placeholder="专家简介" ref="speakerBio"*/}
                {/*onBlur={this.saveExpertInfo.bind(this, 'bio')}/>*/}
              </div>
            </Col>

            <Col span={24} style={{ marginTop: 25 }}>
              <Button key="submit" type="primary" style={{ float: 'right' }}
                      loading={getPersonLoading} onClick={this.saveTalkData.bind()}>
                提交
              </Button>
              <Button type="default" onClick={this.cancelCurrentPerson}>
                上一步
              </Button>
            </Col>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(({ loading }) => ({ loading }))(AddExpertModal);
