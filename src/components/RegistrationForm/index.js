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
// import ExpertBasicInformation from '../../components/seminar/expertBasicInformation/expertBasicInformation';
import AddExpertModal from '../../components/seminar/addExpertModal';
import ShowExpertList from '../../routes/seminar/addSeminar/workshop/showExpertList';
import { sysconfig } from '../../systems';
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
    // selectedType: '0',
    confirmDirty: false,
    startValue: null,
    endValue: null,
    talkStartValue: null,
    talkEndValue: null,
    // searchExperts: false,
    tags: [],
    talks: [],
    // suggestSpeakers: [],
    // speakerInfo: {},
    // integral: 0,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const state = this.state;
        if (state.startValue === null) {
          this.setState({ startValue: '' })
        }
        if (state.endValue === null) {
          this.setState({ endValue: '' })
        }
        if (state.startValue !== null && state.startValue !== '' && state.endValue !== null && state.endValue !== '') {
          let data = values;
          if (data.state) {
            data.state = data.state.split('#')[0];
          }
          //用于跟aminer的活动区分。默认是aminer
          data.src = 'ccf';
          data.location = { city: '', address: '' };
          data.time = { from: '', to: '' };
          data.type = 1;
          // if (data.type === 0) {
          //   data.speaker = { name: '', position: '', affiliation: '', aid: '', img: '' };
          //   data.speaker.name = state.speakerInfo.name;
          //   data.speaker.position = state.speakerInfo.position;
          //   data.speaker.affiliation = state.speakerInfo.affiliation;
          //   data.speaker.img = state.speakerInfo.img;
          //   data.speaker.aid = state.speakerInfo.aid;
          //   data.speaker.bio = state.speakerInfo.bio;
          //   data.speaker.gender = parse(state.speakerInfo.gender);
          //   data.speaker.phone = state.speakerInfo.phone;
          //   data.speaker.email = state.speakerInfo.email;
          // } else {
          data.talk = state.talks;
          // }
          data.img = image;
          data.location.city = values.city;
          data.location.address = values.address;
          if (state.startValue) {
            data.time.from = state.startValue.toJSON();
          }
          if (state.endValue) {
            data.time.to = state.endValue.toJSON();
          }
          data.activityTags = state.tags;
          //获取登录用户的uid
          data.uid = this.props.uid;
          this.props.dispatch({ type: 'seminar/postSeminarActivity', payload: data });
        }

      }
    });
  };
  // 选择活动类型
  // handleChange = (value) => {
  //   this.setState({ selectedType: value });
  // };
  handleOrganizerChange = (value, newArray) => {
    newArray.map((tag) => {
      if (JSON.stringify(value).indexOf(tag) < 0) {
        const data = { key: tag, val: '1' };
        this.props.dispatch({ type: 'seminar/addKeyAndValue', payload: data });
      }
    });


  };

  //增加专家
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

  // onExpertInfoChanged = (speakerInfo) => {
  //   this.setState({ speakerInfo: speakerInfo });
  // };

  //workshop增加演讲专家
  addTheNewTalk = (talk) => {
    this.setState({ talks: this.state.talks.concat(talk), addNewTalk: false, });
  };

  //删除专家
  delTheExpert = (i) => {
    this.state.talks.splice(i, 1);
    this.setState({ talks: this.state.talks });
  };

  // cancelTalkData = () => {
  //   this.setState({ addNewTalk: false, });
  // };
  // activityTypeChange = (value) => {
  //   this.setState({ integral: value.split('#')[1] })
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activity_organizer_options,activity_type } = this.props.seminar;
    const activityTypes = sysconfig.CCF_activityTypes;
    let activity_organizer_options_data = {};
    let activity_type_options_data = {};
    // let activity_type_options = {};

    if (activity_organizer_options.data) {
        activity_organizer_options_data = activity_organizer_options.data;
    }
    if (activity_type.data){
      activity_type_options_data=activity_type.data;
    }
    // if (activity_type.data) {
    //   if (activity_type.data.data) {
    //     activity_type_options = activity_type.data.data;
    //   }
    // }


    let { addNewTalk, talks, integral, startValue, endValue } = this.state;

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
          <Col className={styles.thumbnail} md={24} lg={{ span: 16, offset: 4 }}>
            <FormItem {...formItemLayout} label='活动类型' hasFeedback>
              {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请选择活动类型！' }],
                }
              )(
                <Select>
                  {
                    Object.keys(activity_type_options_data).map((item) => {
                      return (<Option key={Math.random()} value={item}>{item}</Option>)
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='承办单位'>
              {getFieldDecorator('organizer', {
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
              validateStatus={(startValue !== '' || endValue !== '') ? '' : 'error'}
              help={(startValue !== '' || endValue !== '') ? '' : '请选择时间'}
              hasFeedback
              required
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
              label="活动城市"
            >
              {getFieldDecorator('city', {
                rules: [{
                  message: '请输入活动城市',
                }],
              })(
                <Input placeholder='请输入活动地点。。。'/>
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
              hasFeedback
            >
              {getFieldDecorator('abstract', {
                rules: [{
                  required: true,
                  message: '请输入活动简介',
                }, { type: 'string', max: 150, message: '最多150个字符' }],
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
            {/*<FormItem*/}
            {/*{...formItemLayout}*/}
            {/*label="贡献类别"*/}
            {/*>*/}
            {/*{getFieldDecorator('state', {})(*/}
            {/*<Select*/}
            {/*showSearch*/}
            {/*style={{ width: 200 }}*/}
            {/*placeholder="请选择贡献类别"*/}
            {/*optionFilterProp="children"*/}
            {/*onChange={this.activityTypeChange}*/}
            {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
            {/*>*/}
            {/*{*/}
            {/*Object.keys(activity_type_options).map((item) => {*/}
            {/*return (<Option key={item}*/}
            {/*value={item + '#' + activity_type_options[item]}>{item}</Option>)*/}
            {/*})*/}
            {/*}*/}
            {/*</Select>*/}
            {/*)}*/}
            {/*</FormItem>*/}
          </Col>

          {/*seminar*/}
          {/*{selectedType === '0' ?*/}
          {/*<Col className={styles.thumbnail} md={24} lg={{ span: 16, offset: 4 }}>*/}
          {/*<div>*/}
          {/*<FormItem>*/}
          {/*<Col><label>专家信息</label></Col>*/}
          {/*<ExpertBasicInformation integral={integral} callbackParent={this.onExpertInfoChanged}/>*/}
          {/*</FormItem>*/}
          {/*</div>*/}
          {/*</Col> : ''}*/}
          {/*workshop*/}

          <Col className={styles.thumbnail} md={24} lg={{ span: 16, offset: 4 }}>
            {talks.length > 0 ? <div>
              {talks.map((talk, index) => {
                return (<div key={Math.random()}>
                  <ShowExpertList talk={talk} index={index} getImg={this.getImg} delTheExpert={this.delTheExpert}/>
                </div>)
              })}
            </div> : ''}
            <div className={styles.addNewExpert}>
              <Button type='primary' onClick={this.addTalkData.bind(this, addNewTalk)}>新增专家</Button>
            </div>

            {addNewTalk &&
            <AddExpertModal integral={integral} parentProps={this.props} callbackParent={this.addTheNewTalk}/>}
          </Col>

          <Col className={styles.formFooter} md={24} lg={{ span: 16, offset: 4 }}>
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
