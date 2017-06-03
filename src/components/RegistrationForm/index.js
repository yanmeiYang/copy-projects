/**
 * Created by yangyanmei on 17/5/27.
 */
import React from 'react';
import {
  Form,
  Input,
  Icon,
  Select,
  Row,
  Col,
  Button,
  AutoComplete,
  Upload,
  Modal,
  Tag,
} from 'antd';
import fetch from 'dva/fetch';
import { routerRedux, Link } from 'dva/router';
import { request, config } from '../../utils';
import styles from './index.less'
import defaultImg from '../../assets/people/default.jpg';
import CanlendarInForm from '../../components/seminar/calendar';
import AddTags from '../../components/seminar/addTags';
import { connect } from 'dva';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const { api } = config;

let image = null;

const uploadImage = {
  name: 'file',
  multiple: false,
  showUploadList: false,
  accept: 'image/jpeg,image/png,image/bmp',
  // action: '/upload.do',
  onChange(info){
    const status = info.file.status;
    if (status !== 'uploading') {
      image = info.file.originFileObj;
    }
    // if (status === 'done') {
    //   message.success(`$(info.file.name) file uploaded successfully.`);
    // } else if (status === 'error') {
    //   message.error(`$(info.file.name) file upload failed.`);
    // }
  }
};

class RegistrationForm extends React.Component {
  state = {
    addNewTalk: false,
    selectedType: '0',
    confirmDirty: false,
    startValue: null,
    endValue: null,
    searchExperts: false,
    tags: [],
    talk: [],
    suggestSpeakers: [],
  };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const state = this.state;
        let data = values;
        data.location = { city: '', address: '' };
        data.time = { from: '', to: '' };
        data.type = parseInt(values.type);
        if (data.type === 0) {
          data.speaker = { name: '', position: '', affiliation: '', aid: '', img:''};
          data.speaker.name = this.refs.speakerName.refs.input.value;
          data.speaker.position = this.refs.speakerPos.refs.input.value;
          data.speaker.affiliation = this.refs.speakerAff.refs.input.value;
          data.speaker.img = this.refs.speakerImg.src;

        }
        // data.img = image;
        data.location.address = values.address;
        if (state.startValue) {
          data.time.from = state.startValue.toJSON();
        }
        if (state.endValue) {
          data.time.to = state.endValue.toJSON();
        }

        data.activityTags = state.tags;
        data.uid = '54f5112e45ce1bc6d563b8d9';
        this.props.dispatch({type:'seminar/postSeminarActivity', payload:data});
      }
    });
  };
  // 选择活动类型
  handleChange = (value) => {
    this.setState({ selectedType: value });
  };

  //增加嘉宾
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };
  addTalkData = (state) => {
    this.setState({ addNewTalk: !state });
  };

  onChildChanged = (field, value) => {
    this.setState({ [field]: value });
  };
  onTagsChanged = (value) => {
    this.setState({ tags: value });
  };

  //search experts
  showModal = () => {
    const t = this;
    const payload = {
      name: this.refs.speakerName.refs.input.value,
      position: this.refs.speakerPos.refs.input.value,
      affiliation: this.refs.speakerAff.refs.input.value,
      title: '',
    };
    // this.props.dispatch({type:'seminar/getSpeakerSuggest',payload:payload});

    fetch(config.baseURL + config.api.speakerSuggest, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(payload),
    }).then(function (response) {
      return response.json().then(function (json) {
        return json;
      }).then(function (json) {
        t.setState({
          suggestSpeakers: json,
          searchExperts: true,
        });

      });
    });
  };
  handleOk = (e) => {
    this.setState({
      searchExperts: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      searchExperts: false,
    });
  };

  selectedExpert = (speaker) => {
    this.refs.speakerName.refs.input.value = speaker.payload.name;
    this.refs.speakerAff.refs.input.value = speaker.payload.org;
    speaker.pos.length > 0 ? this.refs.speakerPos.refs.input.value = speaker.pos[0].n : this.refs.speakerPos.refs.input.value = ' ';
    this.refs.speakerAid.value = speaker.payload.id;
    this.refs.speakerImg.src = speaker.img;
    this.setState({
      searchExperts: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let { addNewTalk, selectedType, suggestSpeakers } = this.state;

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
    return (
      <Row>
        <Form onSubmit={this.handleSubmit}>
          <Col className={styles.thumbnail} span={12} offset={6}>

            <FormItem {...formItemLayout} label='活动类型' hasFeedback>
              {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择活动类型！' }],
                  initialValue: '0'
                }
              )(
                <Select onChange={this.handleChange.bind(this)}>
                  <Option value='0'>Seminar</Option>
                  <Option value='1'>WorkShop</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="活动名称"
              hasFeedback
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '请输入活动名称',
                }],
              })(
                <Input placeholder='请输入活动名称'/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="活动时间"
              hasFeedback
            >
              {getFieldDecorator('time', {
                rules: [{
                  message: '请输入活动时间',
                }],
              })(
                <CanlendarInForm callbackParent={this.onChildChanged}/>
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label="活动地点"
            >
              {getFieldDecorator('address', {
                rules: [{
                  message: '请输入活动地点',
                }],
              })(
                <Input placeholder='请输入活动地点。。。'/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="活动简介"
            >
              {getFieldDecorator('abstract', {
                rules: [{
                  message: '请输入活动简介',
                }],
              })(
                <Input type='textarea' rows={4} placeholder='请输入活动简介。。。'/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="活动海报"
            >
              <Dragger {...uploadImage}>
                <p className="ant-upload-drag-icon">
                  <i className="anticon anticon-inbox"></i>
                </p>
                <p className="ant-upload-text">点击或将图片拖拽到此区域上传</p>
                <p className="ant-upload-hint">支持上传JPG/PNG/BMP文件</p>
              </Dragger>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="活动标签"
            >
              {getFieldDecorator('activityTags', {})(<AddTags callbackParent={this.onTagsChanged}/>)}

            </FormItem>
          </Col>

          {/*seminar*/}
          {selectedType === '0' ?
            <Col className={styles.thumbnail} span={12} offset={6}>
              <div>
                <FormItem>
                  <Col><label>专家信息</label></Col>
                  <Col span={6}>
                    <section>
                      <div className="people">
                        <div className="no-padding shadow-10">
                          <div className={styles.crop}><span className="helper"></span><img src={this.getImg()} ref='speakerImg'/>
                            <input ref='speakerAid' style={{display:'none'}}/>
                          </div>
                        </div>
                      </div>
                      {/*<Button size='small'>*/}
                      {/*<Icon type="cloud-upload"/>&nbsp;Upload*/}
                      {/*</Button>*/}
                    </section>
                  </Col>
                  <Col span={14}>
                    <div className={styles.expertProfile}>
                      <Input size='large' placeholder='嘉宾姓名' ref='speakerName'/>
                      <Input size='large' placeholder='嘉宾职位' ref='speakerPos'/>
                      <Input size='large' placeholder='嘉宾单位' ref='speakerAff'/>
                      <Button type='primary' className={styles.recommendation}
                              onClick={this.showModal.bind(this)}>相关嘉宾推荐</Button>
                      <Modal
                        title="Search Experts"
                        width="880px"
                        visible={this.state.searchExperts}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                      >
                        <div className={styles.personWrap}>
                          {suggestSpeakers.map((speaker) => {
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
                                    <p>{position ? <p className={styles.infoItem}>
                                      <Icon type="idcard"/>
                                      { position }
                                    </p> : ''}</p>

                                    <p>{aff ? <p className={styles.infoItem}>
                                      <Icon type="home"/>
                                      { aff }
                                    </p> : ''}</p>
                                  </div>
                                  <div className={styles.tagWrap}>
                                    {speaker.tags.map((tag) => {
                                      return (<Link to={`/search/${tag.t}/0/30`} key={Math.random()}><Tag
                                        className={styles.tag}>{tag.t}</Tag></Link>);
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <Button type='primary'
                                          onClick={this.selectedExpert.bind(this, speaker)}>submit</Button>
                                </div>
                              </li>
                            )
                          })}
                        </div>
                      </Modal>
                    </div>
                  </Col>
                </FormItem>
              </div>
            </Col> : ''}
          {/*workshop*/}
          {selectedType === '1' ?
            <Col className={styles.thumbnail} span={12} offset={6}>
              <div className={styles.addNewExpert}>
                <Button type='primary' onClick={this.addTalkData.bind(this, addNewTalk)}>新增嘉宾</Button>
              </div>

              {addNewTalk ?
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="活动名称"
                  >
                    <Input placeholder='请输入活动名称。。。'/>
                  </FormItem>
                  <FormItem>
                    <Col><label>专家信息</label></Col>
                    <Col span={6}>
                      <section>
                        <div className="people">
                          <div className="no-padding shadow-10">
                            <div className={styles.crop}><span className="helper"></span><img src={this.getImg()}/>
                            </div>
                          </div>
                        </div>
                        <Button size='small'>
                          <Icon type="cloud-upload"/>&nbsp;Upload
                        </Button>
                      </section>
                    </Col>
                    <Col span={14}>
                      <div className={styles.expertProfile}>
                        <Input size='large' placeholder='嘉宾姓名'/>
                        <Input size='large' placeholder='嘉宾职位'/>
                        <Input size='large' placeholder='嘉宾单位'/>
                        <Button type='primary' className={styles.recommendation}>相关嘉宾推荐</Button>
                      </div>
                    </Col>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={(
                      <span>
              活动时间&nbsp;
            </span>
                    )}
                    hasFeedback
                  >
                    <CanlendarInForm />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={(
                      <span>
             演讲地点&nbsp;
            </span>
                    )}
                  >
                    <Input placeholder='请输入活动地点。。。'/>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={(
                      <span>
             演讲摘要&nbsp;
            </span>
                    )}
                  >
                    <Input type='textarea' rows={4} placeholder='请输入演讲摘要。。。'/>
                  </FormItem>
                  <Button type='primary' className={styles.saveExpert}>保存</Button>
                  <Button type='danger'>取消</Button>
                </div> : ''}
            </Col> : ''}

          <Col className={styles.formFooter} span={12} offset={6}>
            <FormItem
              wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" onClick={this.handleSubmit}>确定</Button>
              &nbsp;&nbsp;&nbsp;
              <Button type="ghost" onClick={this.handleReset}>重置</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default connect(({ seminar }) => ({ seminar }))(WrappedRegistrationForm);

// export default RegistrationForm;
