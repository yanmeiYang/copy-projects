/**
 * Created by yangyanmei on 17/6/20.
 */
import React from 'react';
import { Modal, Button, Input, Form, Col, Tag, Icon, Radio, Spin, Select } from 'antd';
import { Link } from 'dva/router';
import CanlendarInForm from '../calendar';
import defaultImg from '../../../assets/people/default.jpg';
import styles from './index.less';

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
    integral: 0,
    name: '',
    position: '',
    affiliation: '',
    talkAbstract: '',
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
  };

  setModalVisible() {
    this.setState({ modalVisible: false });
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

  // 选择一位推荐专家
  selectedExpert = (speaker) => {
    this.speakerInformation.name = this.refs.speakerName.refs.input.value = speaker.payload.name;
    this.speakerInformation.affiliation = this.refs.speakerAff.refs.input.value = speaker.payload.org;
    speaker.pos.length > 0 && speaker.pos[0].n ? this.speakerInformation.position = this.refs.speakerPos.refs.input.value = speaker.pos[0].n : this.speakerInformation.position = this.refs.speakerPos.refs.input.value = ' ';
    this.speakerInformation.aid = this.refs.speakerAid.value = speaker.payload.id;
    this.speakerInformation.img = this.refs.speakerImg.src = speaker.img;
    this.speakerInformation.bio = this.refs.speakerBio.refs.input.value = '';
    this.setState({
      speakerInfo: this.speakerInformation,
      step3: true,
      step2: false,
      step1: false,
    });
    this.props.parentProps.seminar.speakerSuggests = [];
    // this.props.callbackParent(this.speakerInformation);
  };

  // 修改当前专家信息
  saveExpertInfo = (type, e) => {
    this.speakerInformation[type] = e.target.value;
    this.setState({
      speakerInfo: this.speakerInformation,
    });
    // this.props.callbackParent(this.speakerInformation);
  };
  setTalkAbstrack = (e) => {
    this.setState({ talkAbstract: e.target.value });
  };
  saveTalkData = () => {
    const state = this.state;
    const talk = {
      title: '',
      speaker: { name: '', position: '', affiliation: '', img: '', aid: '', bio: '', stype: { label: '', score: 0 } },
      location: { city: '', address: '' },
      abstract: '',
    };
    talk.title = this.refs.talkTitle.refs.input.value;
    talk.speaker.name = state.speakerInfo.name;
    talk.speaker.position = state.speakerInfo.position;
    talk.speaker.affiliation = state.speakerInfo.affiliation;
    talk.speaker.img = state.speakerInfo.img;
    talk.speaker.aid = state.speakerInfo.aid;
    talk.speaker.bio = state.speakerInfo.bio;
    talk.speaker.gender = parseInt(state.speakerInfo.gender);
    talk.speaker.email = state.speakerInfo.email;
    talk.speaker.phone = state.speakerInfo.phone;
    talk.speaker.stype = state.speakerInfo.stype;
    // talk.stype[xxx]='1';
    if (state.talkStartValue || state.talkEndValue) {
      talk['time'] = {};
    }
    if (state.talkStartValue) {
      talk['time'].from = state.talkStartValue.toJSON();
    }
    if (state.talkEndValue) {
      talk['time'].to = state.talkEndValue.toJSON();
    }
    talk.location.address = this.refs.talkLocation.refs.input.value;
    talk.abstract = state.talkAbstract;
    this.props.callbackParent(talk);
    this.setState({ modalVisible: false });
  };

  suggestExpert(type) {
    let data = {};
    data = {
      name: this.refs.name.refs.input.value,
      position: this.refs.pos.refs.input.value,
      affiliation: this.refs.aff.refs.input.value,
      title: '',
    };
    if (type === 0) {
      if (this.state.name !== this.refs.name.refs.input.value || this.state.position !== this.refs.pos.refs.input.value || this.state.affiliation !== this.refs.aff.refs.input.value) {
        this.props.parentProps.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
      }
    } else {
      this.props.parentProps.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
    }
    this.setState({
      name: this.refs.name.refs.input.value,
      position: this.refs.pos.refs.input.value,
      affiliation: this.refs.aff.refs.input.value,
    });
  }

  activityTypeChange = (value) => {
    this.setState({ integral: value.split('#')[1] });
    this.speakerInformation.stype.label = value.split('#')[0];
    this.speakerInformation.stype.score = parseInt(value.split('#')[1]);
  };

  jumpToStep2 = () => {
    this.props.parentProps.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setStep('step2', true);
      }
    });
  };

  cancelCurrentPerson = () => {
    this.setState({ step2: true, step3: false, speakerInfo: {} });
    this.refs.speakerName.refs.input.value = '';
    this.refs.speakerAff.refs.input.value = '';
    this.refs.speakerPos.refs.input.value = '';
    this.refs.speakerAid.value = '';
    this.refs.speakerImg.src = defaultImg;
    this.refs.speakerBio.refs.input.value = '';
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
    const { modalVisible, step2, step3, integral } = this.state;
    const { parentProps } = this.props;
    const { speakerSuggests, loading, contribution_type } = parentProps.seminar;
    const { getFieldDecorator } = parentProps.form;

    return (
      <Modal
        title="添加专家"
        visible={modalVisible}
        width={640}
        footer={null}
        wrapClassName={styles.addExpertModal}
        onCancel={this.setModalVisible.bind(this)}
      >
        <div className={!step2 && !step3 ? styles.showStep4 : styles.hideStep4}>
          <FormItem
            {...formItemLayout}
            label="演讲标题"
          >
            <Input placeholder="请输入演讲标题。。。" ref="talkTitle" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>活动时间</span>)}
            hasFeedback>
            <CanlendarInForm callbackParent={this.onChildTalkChanged} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>演讲地点</span>)}>
            <Input placeholder="请输入活动地点。。。" ref="talkLocation" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>演讲摘要</span>)}>
            <Input type="textarea" rows={4} placeholder="请输入演讲摘要。。。" ref="talkAbstract" onBlur={this.setTalkAbstrack}/>
          </FormItem>
          {contribution_type && <FormItem
            {...formItemLayout}
            label="贡献类别"
          >
            {getFieldDecorator('email', {
              rules: [{
                required: true, message: '请选择贡献类别',
              }],
            })(
              <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择贡献类别"
                  optionFilterProp="children"
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
          <div className="ant-col-7">
            <Input size="large" placeholder="专家姓名" ref="name"
                   onBlur={this.suggestExpert.bind(this, 0)} />
          </div>
          <div className="ant-col-7">
            <Input size="large" placeholder="专家职称" ref="pos"
                   onBlur={this.suggestExpert.bind(this, 0)} />
          </div>
          <div className="ant-col-7">
            <Input size="large" placeholder="专家单位" ref="aff"
                   onBlur={this.suggestExpert.bind(this, 0)} />
          </div>
          <div className="ant-col-3">
            <Button type="primary" size="large"
                    onClick={this.suggestExpert.bind(this, 1)}>推荐</Button>
          </div>

          {speakerSuggests &&
          <div className={styles.personWrap}>
            <Spin spinning={loading} style={{ marginTop: 30 }}>
              {speakerSuggests.map((speaker) => {
                const position = speaker.pos && speaker.pos.length > 0 ? speaker.pos[0].n : null;
                const aff = speaker.payload.aff ? speaker.payload.aff : null;
                return (
                  <li key={speaker.payload.id} className={styles.person}>
                    <div className={styles.left}>
                      <img src={this.getImg(speaker.img)} alt="头像" />
                    </div>
                    <div className={styles.right}>
                      <div className={styles.nameWrap}>
                        <h3>{speaker.text}</h3>
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
                            <Icon type="idcard" />{ position }
                          </span>}
                        </p>

                        <p>{aff && <span className={styles.infoItem}>
                          <Icon type="home" />
                          { aff }
                        </span> }</p>
                      </div>
                      <div className={styles.tagWrap}>
                        {speaker.tags && speaker.tags.slice(0, 5).map((tag) => {
                          if (tag === 'Null') {
                            return '';
                          }
                          return (
                            <Link key={Math.random()}>
                              <Tag className={styles.tag}>{tag.t}</Tag>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <Button type="primary" onClick={this.selectedExpert.bind(this, speaker)}>添加此人</Button>
                    </div>
                  </li>
                );
              })}
            </Spin>
          </div>}


          <div style={{ height: 20 }}>
            <Button key="submit" type="primary" size="large"
                    style={{ float: 'right', marginTop: 10 }}
                    onClick={() => this.setStep('step3', true)}>
              未找到，手工填写信息
            </Button>
            <Button type="default" size="large" style={{ marginTop: 10 }}
                    onClick={() => this.setStep('step2', false)}>
              上一步
            </Button>
          </div>
        </div>

        <div className={`${step3 ? styles.showStep4 : styles.hideStep4}`} style={{ minHeight: 392, maxHeight: 800 }}>
          <Col><label>专家信息</label></Col>

          <Col span={6}>
            <section>
              <div className="people">
                <div className="no-padding shadow-10">
                  <div className={styles.crop}><span className="helper" /><img
                    src={this.getImg()}
                    ref="speakerImg" />
                    <input ref="speakerAid" style={{ display: 'none' }} />
                  </div>
                </div>
              </div>
            </section>
          </Col>
          <Col span={18} className={styles.expertProfile}>
            <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
              <label className="ant-col-3">姓名: </label>
              <div className="ant-col-21">
                <Input size="large" placeholder="专家姓名" ref="speakerName"
                       onBlur={this.saveExpertInfo.bind(this, 'name')} />
              </div>
            </div>

            <div className="ant-form-item" style={{ paddingBottom: '20px' }}>
              <label className="ant-col-3">性别: </label>
              <div className="ant-col-21">
                <RadioGroup defaultValue="1" onChange={this.saveExpertInfo.bind(this, 'gender')}>
                  <Radio value="1" name="gender">男</Radio>
                  <Radio value="2" name="gender">女</Radio>
                </RadioGroup>
              </div>
            </div>
            <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
              <label className="ant-col-3">职称: </label>
              <div className="ant-col-21">
                <Input size="large" placeholder="专家职称" ref="speakerPos"
                       onBlur={this.saveExpertInfo.bind(this, 'position')} />
              </div>
            </div>
            <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
              <label className="ant-col-3">单位: </label>
              <div className="ant-col-21">
                <Input size="large" placeholder="专家单位" ref="speakerAff"
                       onBlur={this.saveExpertInfo.bind(this, 'affiliation')} />
              </div>
            </div>
            <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
              <label className="ant-col-3">电话: </label>
              <div className="ant-col-21">
                <Input size="large" placeholder="电话" ref="speakerIphone"
                       onBlur={this.saveExpertInfo.bind(this, 'phone')} />
              </div>
            </div>
            <div className="ant-form-item" style={{ paddingBottom: '15px' }}>
              <label className="ant-col-3">邮箱: </label>
              <div className="ant-col-21">
                <Input size="large" placeholder="邮箱" ref="speakerEmail"
                       onBlur={this.saveExpertInfo.bind(this, 'email')} />
              </div>
            </div>
          </Col>
          <Col span={24}>
            <label className="ant-col-3">专家简介: </label>
            <div className="ant-col-21">
              <Input type="textarea" rows={4} size="large" placeholder="专家简介" ref="speakerBio"
                     onBlur={this.saveExpertInfo.bind(this, 'bio')} />
            </div>
          </Col>

          <Col span={24} style={{ marginTop: 25 }}>
            <Button key="submit" type="primary" size="large" style={{ float: 'right' }}
                    onClick={this.saveTalkData}>
              提交
            </Button>
            <Button type="default" size="large" onClick={this.cancelCurrentPerson}>
              上一步
            </Button>
          </Col>
        </div>
      </Modal>
    );
  }
}

export default (AddExpertModal);
