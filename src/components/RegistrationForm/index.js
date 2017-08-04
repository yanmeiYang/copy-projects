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
  Modal,
} from 'antd';
import { connect } from 'dva';
import { config } from '../../utils';
import styles from './index.less';
import defaultImg from '../../assets/people/default.jpg';
import CanlendarInForm from '../../components/seminar/calendar';
import AddTags from '../../components/seminar/addTags';
// import ExpertBasicInformation from '../../components/seminar/expertBasicInformation/expertBasicInformation';
import AddExpertModal from '../../components/seminar/addExpertModal';
import ShowExpertList from '../../routes/seminar/addSeminar/workshop/showExpertList';

const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
// let image = null;
// const uploadImage = {
//   name: 'file',
//   multiple: false,
//   showUploadList: true,
//   accept: 'image/jpeg,image/png,image/bmp',
//   action: config.baseURL + config.api.uploadActivityPosterImgFile,
//   listType: 'picture',
//   headers: {
//     // 获得登录用户的token
//     Authorization: localStorage.getItem('token'),
//   },
//   onChange(info) {
//     const status = info.file.status;
//     if (status !== 'uploading') {
//       image = info.file.originFileObj;
//     }
//   },
//   onSuccess(response) {
//     image = response.url;
//   },
// };

class RegistrationForm extends React.PureComponent {
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
    editTheTalk: {},
    editTheTalkIndex: -1,
    editStatus: false, // 是否是编辑状态
    organizer: '', // componentWillUpdate设置organizer不起作用
    previewVisible: false,
    image: null,
    // suggestSpeakers: [],
    // speakerInfo: {},
    // integral: 0,
  };
  componentWillMount = () => {
    this.props.dispatch({
      type: 'seminar/getCategoriesHint',
      payload: { category: 'orglist_' },
    });
    this.props.dispatch({
      type: 'seminar/getCategory',
      payload: { category: 'activity_organizer_options' },
    });
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'orgcategory' } });
    this.props.dispatch({
      type: 'seminar/getCategory',
      payload: { category: 'contribution_type' },
    });
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.editTheSeminar === this.props.editTheSeminar) {
      return false;
    }
    if (nextProps.editTheSeminar.title) {
      const currentSeminar = nextProps.editTheSeminar;
      const data = {
        category: currentSeminar.category,
        organizer: currentSeminar.organizer[0],
        co_org: currentSeminar.organizer.slice(1, currentSeminar.organizer.length),
        title: currentSeminar.title,
        city: currentSeminar.location.city ? currentSeminar.location.city : '',
        address: currentSeminar.location.address ? currentSeminar.location.address : '',
        abstract: currentSeminar.abstract,
      };
      this.setState({
        talkStartValue: currentSeminar.time.from,
        talkEndValue: currentSeminar.time.to,
        startValue: currentSeminar.time.from,
        endValue: currentSeminar.time.to,
        tags: currentSeminar.tags,
        talks: currentSeminar.talk,
        editStatus: true,
        organizer: currentSeminar.organizer[0],
        image: currentSeminar.img ? currentSeminar.img : '',
      });
      this.props.form.setFieldsValue(data);
    }
    return true;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const state = this.state;
        if (state.startValue === null) {
          this.setState({ startValue: '' });
        }
        if (state.endValue === null) {
          this.setState({ endValue: '' });
        }
        if (state.startValue !== null && state.startValue !== '' && state.endValue !== null && state.endValue !== '') {
          const data = values;
          if (data.state) {
            data.state = data.state.split('#')[0];
          }
          // 用于跟aminer的活动区分。默认是aminer
          data.src = config.source;
          data.location = { city: '', address: '' };
          data.time = { from: '', to: '' };
          data.type = 1;
          data.talk = state.talks;
          data.talk.map((item) => {
            if (item.speaker.gender) {
              return item.speaker.gender = item.speaker.gender.i ? item.speaker.gender.i : 0;
            } else {
              return item.speaker.gender = 0;
            }
          });
          data.img = state.image;
          data.location.city = values.city;
          data.location.address = values.address;
          if (state.startValue) {
            data.time.from = typeof state.startValue === 'string' ? state.startValue : state.startValue.toJSON();
          }
          if (state.endValue) {
            data.time.to = typeof state.endValue === 'string' ? state.endValue : state.endValue.toJSON();
          }
          data.tags = state.tags;
          if (data.co_org !== undefined && data.co_org.length > 0) {
            data.organizer = [data.organizer].concat(data.co_org);
          } else {
            data.organizer = [data.organizer];
          }

          delete data.co_org;
          // 获取登录用户的uid
          data.uid = this.props.uid;
          if (state.editStatus) {
            data.id = this.props.seminarId;
            this.props.dispatch({ type: 'seminar/updateSeminarActivity', payload: data });
          } else {
            this.props.dispatch({ type: 'seminar/postSeminarActivity', payload: data });
          }
        }
      }
    });
  };
  // 选择活动类型 orglist_5976bb068ef7a2e824adca67
  // handleChange = (value) => {
  //   this.setState({ selectedType: value });
  // };
  handleOrganizerChange = (value, newArray) => {
    newArray.map((tag) => {
      if (JSON.stringify(value).indexOf(tag) < 0) {
        const data = { key: tag, val: ' ' };
        this.props.dispatch({ type: 'seminar/addKeyAndValue', payload: data });
      }
    });
  };

  // 增加专家
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };
  addTalkData = (state) => {
    this.setState({ editTheTalk: [], addNewTalk: !state });
  };
  setAddNewTalk = () => {
    this.setState({ addNewTalk: false });
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

  // workshop增加演讲专家
  addTheNewTalk = (talk, isEdit) => {
    if (isEdit) {
      this.state.talks.splice(this.state.editTheTalkIndex, 1, talk);
      this.setState({ talks: this.state.talks, addNewTalk: false });
    } else {
      this.setState({ talks: this.state.talks.concat(talk), addNewTalk: false });
    }
  };

  // 删除专家
  delTheExpert = (i) => {
    const outerThis = this;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        outerThis.state.talks.splice(i, 1);
        outerThis.setState({ talks: outerThis.state.talks });
      },
      onCancel() {
      },
    });
  };
  editTheExpert = (i) => {
    this.setState({ editTheTalk: this.state.talks[i], addNewTalk: true, editTheTalkIndex: i });
  };

  getKeywords = () => {
    const form = this.props.form;
    const data = {
      title: form.getFieldValue('title'),
      content: form.getFieldValue('abstract'),
      num: '3',
    };
    this.props.dispatch({ type: 'seminar/keywordExtraction', payload: data });
  };

  uploadImgSuccess = (img) => {
    this.setState({ image: img });
  };
  delCurrentImg = () => {
    this.setState({ image: '' });
  };

  // cancelTalkData = () => {
  //   this.setState({ addNewTalk: false, });
  // };
  // activityTypeChange = (value) => {
  //   this.setState({ integral: value.split('#')[1] })
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      activity_organizer_options, orgcategory, tags,
      postSeminarOrganizer,
    } = this.props.seminar;
    let activity_organizer_options_data = {};
    if (activity_organizer_options.data) {
      activity_organizer_options_data = activity_organizer_options.data.concat(postSeminarOrganizer);
    }
    const { addNewTalk, talks, startValue, endValue, editTheTalk, image } = this.state;
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
    const outerThis = this;
    const uploadImage = {
      name: 'file',
      multiple: false,
      showUploadList: false,
      accept: 'image/jpeg,image/png,image/bmp',
      action: config.baseURL + config.api.uploadActivityPosterImgFile,
      // listType: 'text',
      headers: {
        // 获得登录用户的token
        Authorization: localStorage.getItem('token'),
      },
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file.originFileOb);
        }
      },
      onSuccess(response) {
        outerThis.uploadImgSuccess(response.url);
      },
    };

    return (
      <Row className={styles.add_seminar_block}>
        <Form horizontal onSubmit={this.handleSubmit} className={styles.add_seminar_form}>
          <Col className={styles.thumbnail}>
            {orgcategory.data &&
            <FormItem {...formItemLayout} label="活动类型" hasFeedback>
              {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请选择活动类型！' }],
                },
              )(
                <Select>
                  {
                    orgcategory.data.map((item) => {
                      return (<Option key={`activity_${Math.random()}`}
                                      value={item.key}>{item.key}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>}
            {postSeminarOrganizer.length > 0 &&
            <FormItem {...formItemLayout} label="承办单位">
              {getFieldDecorator('organizer', {
                  initialValue: this.state.organizer,
                  rules: [{ required: true, message: '请选择承办单位！' }],
                },
              )(
                <Select showSearch>
                  {
                    postSeminarOrganizer.map((item) => {
                      return (<Option key={`org_${Math.random()}`}
                                      value={item.key}>{item.key}</Option>);
                    })
                  }
                </Select>,
              )}
            </FormItem>}
            <FormItem {...formItemLayout} label="协办单位">
              {getFieldDecorator('co_org', {
                  // rules: [{ required: true, message: '请选择承办单位！' }],
                },
              )(
                <Select mode="tags"
                        onChange={this.handleOrganizerChange.bind(this, activity_organizer_options_data)}>
                  {
                    Object.values(activity_organizer_options_data).map((item) => {
                      return (
                        <Option key={`co_${item.key}_${Math.random(10)}`}
                                value={item.key}>{item.key}</Option>);
                    })
                  }
                </Select>,
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
                <Input placeholder="请输入活动名称" />,
              )}
            </FormItem>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <FormItem
                label="活动时间"
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
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
                  <CanlendarInForm callbackParent={this.onChildChanged}
                                   startValue={this.state.talkStartValue}
                                   endValue={this.state.talkEndValue} />,
                )}
              </FormItem>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }}>
              <FormItem
                label="活动城市"
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
              >
                {getFieldDecorator('city', {
                  rules: [{
                    message: '请输入活动城市',
                  }],
                })(
                  <Input placeholder="请输入活动地点。。。" />,
                )}
              </FormItem>
            </Col>
            <FormItem
              {...formItemLayout}
              label="活动地点"
              style={{ position: 'inherit' }}
            >
              {getFieldDecorator('address', {
                rules: [{
                  message: '请输入活动地点',
                }],
              })(
                <Input placeholder="请输入活动地点。。。" />,
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
                <Input type="textarea" rows={4} placeholder="请输入活动简介。。。"
                       onBlur={this.getKeywords} />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="活动海报"
            >
              {image === null || image === '' ?
                <Dragger {...uploadImage}>
                  <p className="ant-upload-drag-icon">
                    <i className="anticon anticon-inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将图片拖拽到此区域上传</p>
                  <p className="ant-upload-hint">支持上传JPG/PNG/BMP文件</p>
                </Dragger> :
                <div className={styles.uploadImgSuccess}>
                  <img src={image} style={{ height: '150px' }} />
                  <Dragger {...uploadImage}
                           style={{
                             width: '76',
                             border: '1px solid #428bca',
                           }}>
                    <p className="ant-upload-text">更换图片</p>
                  </Dragger> <Button onClick={this.delCurrentImg}>删除图片</Button></div>}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="活动标签"
            >
              {getFieldDecorator('activityTags', {})(<AddTags callbackParent={this.onTagsChanged}
                                                              tags={tags} />)}

            </FormItem>
            {/* <FormItem */}
            {/* {...formItemLayout} */}
            {/* label="贡献类别" */}
            {/* > */}
            {/* {getFieldDecorator('state', {})( */}
            {/* <Select */}
            {/* showSearch */}
            {/* style={{ width: 200 }} */}
            {/* placeholder="请选择贡献类别" */}
            {/* optionFilterProp="children" */}
            {/* onChange={this.activityTypeChange} */}
            {/* filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} */}
            {/* > */}
            {/* { */}
            {/* Object.keys(activity_type_options).map((item) => { */}
            {/* return (<Option key={item} */}
            {/* value={item + '#' + activity_type_options[item]}>{item}</Option>) */}
            {/* }) */}
            {/* } */}
            {/* </Select> */}
            {/* )} */}
            {/* </FormItem> */}
          </Col>

          {/* seminar */}
          {/* {selectedType === '0' ? */}
          {/* <Col className={styles.thumbnail} md={24} lg={{ span: 16, offset: 4 }}> */}
          {/* <div> */}
          {/* <FormItem> */}
          {/* <Col><label>专家信息</label></Col> */}
          {/* <ExpertBasicInformation integral={integral} callbackParent={this.onExpertInfoChanged}/> */}
          {/* </FormItem> */}
          {/* </div> */}
          {/* </Col> : ''} */}
          {/* workshop */}

          <Col className={styles.thumbnail}>
            {talks.length > 0 && <div>
              {talks.map((talk, index) => {
                return (
                  <div key={Math.random()}>
                    <ShowExpertList talk={talk} index={index} getImg={this.getImg}
                                    delTheExpert={this.delTheExpert}
                                    editTheExpert={this.editTheExpert} />
                  </div>
                );
              })}
            </div>}
            <div className={styles.addNewExpert}>
              <a type="primary" onClick={this.addTalkData.bind(this, addNewTalk)}>新增专家</a>
            </div>

            {addNewTalk && <AddExpertModal editTheTalk={editTheTalk} parentProps={this.props}
                                           callbackParent={this.addTheNewTalk}
                                           callbackParentSetAddNewTalk={this.setAddNewTalk} />}
          </Col>

          <Col className={styles.formFooter}>
            <FormItem
              wrapperCol={{ span: 12, offset: 6 }} style={{ marginBottom: 6 }}>
              <Button type="primary" onClick={this.handleSubmit}
                      style={{ width: '50%', height: 40 }}>确定</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default connect(({ seminar, person }) => ({ seminar, person }))(WrappedRegistrationForm);
