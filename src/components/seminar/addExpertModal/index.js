/**
 * Created by yangyanmei on 17/6/20.
 */
import React from 'react';
import { Modal, Button, Input, Form, Col, Tag, Icon, Radio } from 'antd';
import { Link } from 'dva/router';
import CanlendarInForm from '../calendar';
import ExpertBasicInformation from '../expertBasicInformation/expertBasicInformation';
import defaultImg from '../../../assets/people/default.jpg';
import styles from './index.less'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class AddExpertModal extends React.Component {
  state = {
    modalVisible: true,
    step2: false,
    step3: false,
    step4: false,
    talkStartValue: null,
    talkEndValue: null,
    speakerInfo: {},
    gender: 'male',
  };
  speakerInformation = { name: '', position: '', affiliation: '', aid: '', img: '', bio: '' };

  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  setStep(step, visible) {
    this.setState({ [step]: visible });
  }

  //改变性别
  onChangeGender = (e) => {
    this.setState({ gender: e.target.value });
  };

  //增加嘉宾
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };

  //获取演讲时间
  onChildTalkChanged = (field, value) => {
    field === 'startValue' ? this.setState({ talkStartValue: value }) : this.setState({ talkEndValue: value });

  };

  //选择一位推荐专家
  selectedExpert = (speaker) => {
    this.speakerInformation.name = this.refs.speakerName.refs.input.value = speaker.payload.name;
    this.speakerInformation.affiliation = this.refs.speakerAff.refs.input.value = speaker.payload.org;
    speaker.pos.length > 0 ? this.speakerInformation.position = this.refs.speakerPos.refs.input.value = speaker.pos[0].n : this.speakerInformation.position = this.refs.speakerPos.refs.input.value = ' ';
    this.speakerInformation.aid = this.refs.speakerAid.value = speaker.payload.id;
    this.speakerInformation.img = this.refs.speakerImg.src = speaker.img;
    this.speakerInformation.bio = this.refs.speakerBio.refs.input.value = '';
    this.setState({
      speakerInfo: this.speakerInformation,
      step4: true,
      step3: true,
      step2: false,
      step1: false,
    });
    this.props.parentProps.seminar.speakerSuggests=[];
    // this.props.callbackParent(this.speakerInformation);
  };

  //修改当前专家信息
  saveExpertInfo = (type, e) => {
    this.speakerInformation[type] = e.target.value;
    this.setState({
      speakerInfo: this.speakerInformation,
    });
    // this.props.callbackParent(this.speakerInformation);
  };

  saveTalkData = () => {
    const state = this.state;
    let talk = {
      title: '',
      speaker: { name: '', position: '', affiliation: '', img: '', aid: '', bio: '' },
      time: { from: '', to: '' },
      location: { city: '', address: '' },
      abstract: ''
    };
    talk.title = this.refs.talkTitle.refs.input.value;
    talk.speaker.name = state.speakerInfo.name;
    talk.speaker.position = state.speakerInfo.position;
    talk.speaker.affiliation = state.speakerInfo.affiliation;
    talk.speaker.img = state.speakerInfo.img;
    talk.speaker.aid = state.speakerInfo.aid;
    talk.speaker.bio = state.speakerInfo.bio;
    if (state.talkStartValue) {
      talk.time.from = state.talkStartValue.toJSON();
    }
    if (state.talkEndValue) {
      talk.time.to = state.talkEndValue.toJSON();
    }
    talk.location.address = this.refs.talkLocation.refs.input.value;
    talk.abstract = this.refs.talkAbstract.refs.input.value;
    this.props.callbackParent(talk);
    this.setState({ modalVisible: false });
  };

  suggestExpert() {
    let data = {};
    data = {
      name: this.refs.name.refs.input.value,
      position: this.refs.pos.refs.input.value,
      affiliation: this.refs.aff.refs.input.value,
      title: '',
    };
    this.props.parentProps.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
  }


  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const { modalVisible, step2, step3, step4, speakerInfo, gender } = this.state;
    const { integral, parentProps } = this.props;
    const { speakerSuggests } = parentProps.seminar;
    return (
      <Modal
        title='添加演讲者'
        visible={modalVisible}
        width={640}
        footer={null}
        wrapClassName={styles.addExpertModal}
        onCancel={this.setModalVisible.bind(this)}
      >
        <div className={!step2 && !step4 ? styles.showStep4 : styles.hideStep4}>
          <FormItem
            {...formItemLayout}
            label="演讲标题"
          >
            <Input placeholder='请输入活动名称。。。' ref='talkTitle'/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>活动时间&nbsp;</span>)}
            hasFeedback>
            <CanlendarInForm callbackParent={this.onChildTalkChanged}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>演讲地点&nbsp;</span>)}>
            <Input placeholder='请输入活动地点。。。' ref='talkLocation'/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>演讲摘要&nbsp;</span>)}>
            <Input type='textarea' rows={4} placeholder='请输入演讲摘要。。。' ref='talkAbstract'/>
          </FormItem>
          <div style={{height:20}}>
            <Button key="submit" type="primary" size="large" style={{float:'right'}} onClick={() => this.setStep('step2', true)}>
              下一步
            </Button>
          </div>
        </div>
        <div className={`ant-form-item ${step2 && !step3 && !step4?styles.showStep4:styles.hideStep4}`}>
          <Col><label>专家信息</label></Col>
          <div className="ant-col-7">
            <Input size='large' placeholder='嘉宾姓名' ref='name'/>
          </div>
          <div className="ant-col-7">
            <Input size='large' placeholder='嘉宾职称' ref='pos'/>
          </div>
          <div className="ant-col-7">
            <Input size='large' placeholder='嘉宾单位' ref='aff'/>
          </div>
          <div className="ant-col-3">
            <Button type='primary' size="large" onClick={this.suggestExpert.bind(this)}>推荐</Button>
          </div>
          {speakerSuggests&&
            <div className={styles.personWrap}>
              {speakerSuggests.map((speaker) => {
                const position = speaker.pos && speaker.pos.length > 0 ? speaker.pos[0].n : null;
                const aff = speaker.payload.aff ? speaker.payload.aff : null;
                return (
                  <li key={speaker.payload.id} className={styles.person}>
                    <div className={styles.left}>
                      <img src={this.getImg(speaker.img)} alt="头像"/>
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
                        <p>{position ? <span className={styles.infoItem}>
                                          <Icon type="idcard"/>
                          { position }
                                        </span> : ''}</p>

                        <p>{aff && <span className={styles.infoItem}>
                                          <Icon type="home"/>
                          { aff }
                                        </span> }</p>
                      </div>
                      <div className={styles.tagWrap}>
                        {speaker.tags.map((tag) => {
                          return (<Link to={`/search/${tag.t}/0/30`} key={Math.random()}><Tag
                            className={styles.tag}>{tag.t}</Tag></Link>);
                        })}
                      </div>
                    </div>
                    <div>
                      <Button type='primary' onClick={this.selectedExpert.bind(this, speaker)}>选中</Button>
                    </div>
                  </li>
                )
              })}
          </div>}

          <div style={{height:20}}>
            <Button key="submit" type="primary" size="large" style={{float:'right', marginTop:10}} onClick={() => this.setStep('step3', true)}>
              未找到，手工填写信息
            </Button>
            <Button type="default" size="large" style={{marginTop:10}}  onClick={() => this.setStep('step2', false)}>
              上一步
            </Button>
          </div>
        </div>

        <div className={`${step3 ? styles.showStep4 : styles.hideStep4}`} style={{height:350}}>
          <Col><label>专家信息</label></Col>

          <Col span={6}>
            <section>
              <div className="people">
                <div className="no-padding shadow-10">
                  <div className={styles.crop}><span className="helper"></span><img src={this.getImg()}
                                                                                    ref='speakerImg'/>
                    <input ref='speakerAid' style={{ display: 'none' }}/>
                  </div>
                </div>
              </div>
            </section>
          </Col>
          <Col span={18} className={styles.expertProfile}>
            <div className='ant-form-item'>
              <label className="ant-col-3">姓名: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='嘉宾姓名' ref='speakerName'
                       onBlur={this.saveExpertInfo.bind(this, 'name')}/>
              </div>
            </div>

            <div className='ant-form-item'>
              <label className="ant-col-3">性别: </label>
              <div className='ant-col-21'>
                <RadioGroup value={gender} onChange={this.onChangeGender.bind()}>
                  <Radio value="male" name="gender">男的</Radio>
                  <Radio value="female" name="gender">女的</Radio>
                </RadioGroup>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">职称: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='嘉宾职称' ref='speakerPos'
                       onBlur={this.saveExpertInfo.bind(this, 'position')}/>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">单位: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='嘉宾单位' ref='speakerAff'
                       onBlur={this.saveExpertInfo.bind(this, 'affiliation')}/>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">电话: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='电话' ref='speakerIphone'/>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">邮箱: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='邮箱' ref='speakerEmail'/>
              </div>
            </div>

            <div className='ant-form-item'>
              <label className="ant-col-3">积分: </label>
              <div className='ant-col-21'>
                <span>{integral}</span>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <label className="ant-col-2">专家简介: </label>
            <div className='ant-col-22'>
              <Input type='textarea' rows={4} size='large' placeholder='专家简介' ref='speakerBio'
                     onBlur={this.saveExpertInfo.bind(this, 'bio')}/>
            </div>
          </Col>

          <Col span={24} style={{marginTop:25}}>
            <Button key="submit" type="primary" size="large" style={{float:'right'}} onClick={this.saveTalkData}>
              提交
            </Button>
          </Col>
        </div>
      </Modal>
    )
  }
}

export default (AddExpertModal);
