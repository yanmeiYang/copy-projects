/**
 * Created by yangyanmei on 17/5/27.
 */
import React from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Upload,
} from 'antd';
import { connect } from 'dva';
import { config } from '../../utils';
import styles from './index.less'
import defaultImg from '../../assets/people/default.jpg';
import CanlendarInForm from '../../components/seminar/calendar';
import AddTags from '../../components/seminar/addTags';
import ExpertBasicInformation from '../../components/seminar/expertBasicInformation/expertBasicInformation';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;

let image = null;

const uploadImage = {
  name: 'file',
  multiple: false,
  showUploadList: true,
  accept: 'image/jpeg,image/png,image/bmp',
  action: config.baseURL + config.api.uploadActivityPosterImgFile,
  listType: 'picture',
  headers: {
    //获得登录用户的token
    'Authorization': localStorage.getItem('token')
  },
  onChange(info){
    const status = info.file.status;
    if (status !== 'uploading') {
      image = info.file.originFileObj;
    }
  },
  onSuccess(response){
    image = response.url;
  }
};

class RegistrationForm extends React.Component {
  state = {
    addNewTalk: false,
    selectedType: '0',
    confirmDirty: false,
    startValue: null,
    endValue: null,
    talkStartValue: null,
    talkEndValue: null,
    searchExperts: false,
    tags: [],
    talks: [],
    suggestSpeakers: [],
    speakerInfo: {},
    integral: 0,
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
          data.speaker = { name: '', position: '', affiliation: '', aid: '', img: '' };
          data.speaker.name = state.speakerInfo.name;
          data.speaker.position = state.speakerInfo.position;
          data.speaker.affiliation = state.speakerInfo.affiliation;
          data.speaker.img = state.speakerInfo.img;
          data.speaker.aid = state.speakerInfo.aid;

        } else {
          data.talk = state.talks;
        }
        data.img = image;
        data.location.address = values.address;
        if (state.startValue) {
          data.time.from = state.startValue.toJSON();
        }
        if (state.endValue) {
          data.time.to = state.endValue.toJSON();
        }
        data.activityTags = state.tags;

        //获取登录用户的uid
        data.uid = '54f5112e45ce1bc6d563b8d9';
        this.props.dispatch({ type: 'seminar/postSeminarActivity', payload: data });
      }
    });
  };
  // 选择活动类型
  handleChange = (value) => {
    this.setState({ selectedType: value });
  };
  handleOrganizerChange = (value, newArray) => {
    console.log(newArray);
    newArray.map((tag) => {
      if (JSON.stringify(value).indexOf(tag) < 0) {
        const data = { key: tag, val: '1' };
        this.props.dispatch({ type: 'seminar/addKeyAndValue', payload: data });
      }
    });


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

  onExpertInfoChanged = (speakerInfo) => {
    this.setState({ speakerInfo: speakerInfo });
  };

  //workshop增加演讲嘉宾
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
    if (state.talkStartValue) {
      talk.time.from = state.talkStartValue.toJSON();
    }
    if (state.talkEndValue) {
      talk.time.to = state.talkEndValue.toJSON();
    }
    talk.location.address = this.refs.talkLocation.refs.input.value;
    talk.abstract = this.refs.talkAbstract.refs.input.value;
    this.setState({ talks: this.state.talks.concat(talk), addNewTalk: false, });
  };

  cancelTalkData = () => {
    this.setState({ addNewTalk: false, });
  };
  onChildTalkChanged = (field, value) => {
    field === 'startValue' ? this.setState({ talkStartValue: value }) : this.setState({ talkEndValue: value });

  };
  activityTypeChange = (value) => {
    this.setState({ integral: value.split('#')[1] })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activity_organizer_options, activity_type } = this.props.seminar;
    let activity_organizer_options_data = {};
    let activity_type_options = {};

    if (activity_organizer_options.data) {
      if (activity_organizer_options.data.data) {
        activity_organizer_options_data = activity_organizer_options.data.data;
      }
    }
    if (activity_type.data) {
      if (activity_type.data.data) {
        activity_type_options = activity_type.data.data;
      }
    }


    let { addNewTalk, selectedType, talks, integral } = this.state;

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
            <FormItem {...formItemLayout} label='承办单位'>
              {getFieldDecorator('OrganizedBy', {
                  rules: [{ required: true, message: '请选择承办单位！' }],
                }
              )(
                <Select mode='tags' onChange={this.handleOrganizerChange.bind(this, activity_organizer_options_data)}>
                  {
                    Object.keys(activity_organizer_options_data).map((item) => {
                      return (<Option key={item} value={item}>{item}</Option>)
                    })
                  }
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
            <FormItem
              {...formItemLayout}
              label="贡献类别"
            >
              {getFieldDecorator('activityType', {})(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择贡献类别"
                  optionFilterProp="children"
                  onChange={this.activityTypeChange}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    Object.keys(activity_type_options).map((item) => {
                      return (<Option key={item}
                                      value={item + '#' + activity_type_options[item]}>{item}</Option>)
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>

          {/*seminar*/}
          {selectedType === '0' ?
            <Col className={styles.thumbnail} span={12} offset={6}>
              <div>
                <FormItem>
                  <Col><label>专家信息</label></Col>
                  <ExpertBasicInformation integral={integral} callbackParent={this.onExpertInfoChanged}/>
                </FormItem>
              </div>
            </Col> : ''}
          {/*workshop*/}
          {selectedType === '1' ?
            <Col className={styles.thumbnail} span={12} offset={6}>
              {talks.length > 0 ? <div>
                <div className={styles.addNewExpert}>
                  <Button type='primary' onClick={this.addTalkData.bind(this, addNewTalk)}>嘉宾信息</Button>
                </div>
                {talks.map((talk) => {
                  return (<div key={Math.random()}>
                    <li className={styles.talks}>
                      <div className={styles.left}>
                        <img src={this.getImg(talk.speaker.img)} alt="头像"/>
                      </div>
                      <div className={styles.right}>
                        <div className={styles.nameWrap}>
                          <span>演讲嘉宾：</span>
                          <span>{talk.speaker.name}</span>
                        </div>
                        <div className={styles.activityWrap}>
                          <p>
                            <span>演讲名称：</span>
                            <span>{talk.title}</span>
                          </p>
                          <p>
                            <span>演讲地点：</span>
                            <span>{talk.location.address}</span>
                          </p>
                        </div>
                      </div>
                      <Button type='danger'>删除</Button>
                    </li>

                  </div>)
                })}
              </div> : ''}
              <div className={styles.addNewExpert}>
                <Button type='primary' onClick={this.addTalkData.bind(this, addNewTalk)}>新增嘉宾</Button>
              </div>

              {addNewTalk ?
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="活动名称"
                  >
                    <Input placeholder='请输入活动名称。。。' ref='talkTitle'/>
                  </FormItem>
                  <FormItem>
                    <Col><label>专家信息</label></Col>
                    <ExpertBasicInformation integral={integral} callbackParent={this.onExpertInfoChanged}/>
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
                  <Button type='primary' className={styles.saveExpert} onClick={this.saveTalkData}>保存</Button>
                  <Button type='danger' onClick={this.cancelTalkData}>取消</Button>
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
