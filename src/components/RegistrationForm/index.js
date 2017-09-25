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
  Cascader,
  Icon,
} from 'antd';
import { connect } from 'dva';
import { config } from '../../utils';
import { sysconfig } from '../../systems';
import styles from './index.less';
import defaultImg from '../../assets/people/default.jpg';
import CanlendarInForm from '../../components/seminar/calendar';
import AddTags from '../../components/seminar/addTags';
import AddCoOrgModal from '../../components/seminar/addCoOrgModal';
import AddExpertModal from '../../components/seminar/addExpertModal';
import ShowExpertList from '../../routes/seminar/addSeminar/workshop/showExpertList';

const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const OrgListGroupCategoryKey = 'orgcategory';
const OrgListPrefix = 'orglist_';
const OrgJoiner = '---'; // 拆分的两个变量都要

// TODO 这个不可以变成pureComponent
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
    editTheTalk: {},
    editTheTalkIndex: -1,
    editStatus: false, // 是否是编辑状态
    organizer: '',
    previewVisible: false,
    image: null,
    currentOrg: [],
    addCoOrgModalVisible: false,
    // suggestSpeakers: [],
    // speakerInfo: {},
    // integral: 0,
  };
  expertExtendAddress = null;
  componentWillMount = () => {
    this.props.dispatch({
      type: 'seminar/getCategoryGroup',
      payload: {
        groupCategory: OrgListGroupCategoryKey,
        categoryTemplate: `${OrgListPrefix}{id}`,
        coOrgCategory: 'activity_organizer_options',
      },
    });
    // 编辑状态调用的请求
    if (this.props.seminarId) {
      this.props.dispatch({
        type: 'seminar/getSeminarByID',
        payload: { id: this.props.seminarId },
      });
      this.setState({ editStatus: true });
    }
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'activity_type' } });
    this.props.dispatch({
      type: 'seminar/getCategory',
      payload: { category: 'contribution_type' },
    });
  };

  componentDidMount() {
    this.initializationForm(this.props.seminar.summaryById);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.seminar.summaryById === this.props.seminar.summaryById) {
      return false;
    }
    if (nextProps.seminar.summaryById.title) {
      const currentSeminar = nextProps.seminar.summaryById;
      this.setState({
        talkStartValue: currentSeminar.time.from,
        talkEndValue: currentSeminar.time.to,
        startValue: currentSeminar.time.from,
        endValue: currentSeminar.time.to,
        tags: currentSeminar.tags,
        talks: currentSeminar.talk,
        editStatus: true,
        organizer: currentSeminar.organizer[0].split(OrgJoiner),
        currentOrg: currentSeminar.organizer.slice(1),
        image: currentSeminar.img || '',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.seminar.summaryById === this.props.seminar.summaryById) {
      return false;
    }
    this.initializationForm(this.props.seminar.summaryById);
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
          data.src = sysconfig.SOURCE;
          data.location = { city: '', address: '' };
          data.time = { from: '', to: '' };
          data.type = 1;
          data.talk = state.talks;
          data.talk.map((item) => {
            item.speaker.gender = item.speaker.gender.i || (item.speaker.gender || 0);
            return item.speaker.gender;
          });
          data.img = state.image;
          data.location.city = values.city;
          data.location.address = values.address;
          if (state.startValue) {
            data.time.from = typeof state.startValue === 'string' ? state.startValue : state.startValue;
          }
          if (state.endValue) {
            data.time.to = typeof state.endValue === 'string' ? state.endValue : state.endValue;
          }
          data.tags = state.tags;
          data.organizer = data.organizer.join(OrgJoiner);
          // data.organizer.shift();
          if (state.currentOrg !== undefined && state.currentOrg.length > 0) {
            data.organizer = [data.organizer].concat(state.currentOrg);
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
  // 存储活动开始、结束时间
  onChildChanged = (field, value) => {
    this.setState({ [field]: value });
  };
  // 存储活动标签
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
  // 修改专家信息
  editTheExpert = (i) => {
    this.setState({ editTheTalk: this.state.talks[i], addNewTalk: true, editTheTalkIndex: i });
  };
  // 根据title和abstract获取tag
  getKeywords = () => {
    const form = this.props.form;
    const data = {
      title: form.getFieldValue('title'),
      content: form.getFieldValue('abstract'),
      num: '3',
    };
    this.props.dispatch({ type: 'seminar/keywordExtraction', payload: data });
  };

  // 初始化form表单
  initializationForm = (currentSeminar) => {
    if (this.state.editStatus && currentSeminar.title) {
      const data = {
        category: currentSeminar.category,
        organizer: currentSeminar.organizer[0].split(OrgJoiner),
        co_org: currentSeminar.organizer.slice(1, currentSeminar.organizer.length),
        title: currentSeminar.title,
        city: currentSeminar.location.city || '',
        address: currentSeminar.location.address || '',
        abstract: currentSeminar.abstract,
      };
      this.expertExtendAddress = currentSeminar.location.address || '';
      this.props.form.setFieldsValue(data);
    }
  };
  /* 更新删除海报开始 */
  uploadImgSuccess = (img) => {
    this.setState({ image: img });
  };
  delCurrentImg = () => {
    this.setState({ image: '' });
  };
  /* 更新删除海报结束 */

  // 存储协办单位
  addNewCoOrg = (value) => {
    this.setState({ currentOrg: value });
  };

  // 存储活动地点，新增专家需要继承
  saveAddress = (e) => {
    this.expertExtendAddress = e.target.value;
  };

  // 活动简介字数提示
  countChar = (maxLength, textareaName, spanName) => {
    document.getElementById(spanName).innerHTML =
      `${maxLength - document.getElementById(textareaName).value.length} / ${maxLength}`;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const load = this.props.loading.effects['seminar/postSeminarActivity'];
    const {
      activity_organizer_options, postSeminarOrganizer, activity_type, summaryById
    } = this.props.seminar;
    const {
      addNewTalk, talks, startValue, endValue, editTheTalk, image, currentOrg,
      editStatus, organizer, tags,
    } = this.state;
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
    const activityType = activity_type.data
    && ((editStatus && summaryById.category) || !editStatus)
      ? activity_type.data : [];
    const psOrganizer = postSeminarOrganizer.length > 0
    && ((editStatus && organizer.length > 0) || !editStatus)
      ? postSeminarOrganizer : [];
    const psActivity = activity_organizer_options.length > 0
    && ((editStatus && currentOrg.length > 0) || !editStatus)
      ? activity_organizer_options : [];
    return (
      <Row className={styles.add_seminar_block}>
        <Form horizontal onSubmit={this.handleSubmit} className={styles.add_seminar_form}>
          <Col className={styles.thumbnail}>
            <FormItem {...formItemLayout} label="活动类型" hasFeedback>
              {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请选择活动类型！' }],
                },
              )(
                <Select placeholder="请选择活动类型">
                  {
                    activityType.map((item) => {
                      return (
                        <Option key={`activity_${Math.random()}`}
                                value={item.key}>{item.key}</Option>
                      );
                    })
                  }
                </Select>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="承办单位">
              {getFieldDecorator('organizer', {
                  initialValue: organizer,
                  rules: [{ required: true, message: '请选择承办单位' }],
                },
              )(
                <Cascader options={psOrganizer} showSearch placeholder="键入搜索承办单位"
                          popupClassName={styles.menu} />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="协办单位">
              {getFieldDecorator('co_org', {},
              )(
                <AddCoOrgModal orgList={psActivity} dispatch={this.props.dispatch}
                               callbackParent={this.addNewCoOrg} coOrg={currentOrg} />,
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
                <Input placeholder="请输入活动名称" autoComplete="off" />,
              )}
            </FormItem>

            <Row>
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
                    <Input placeholder="请输入活动城市" />,
                  )}
                </FormItem>
              </Col>
            </Row>

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
                <Input placeholder="请输入活动地点" onBlur={this.saveAddress} />,
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
                }, { type: 'string', max: 1500, message: '最多1500个字符' }],
              })(
                <Input type="textarea" rows={4} placeholder="请输入活动简介"
                       onBlur={this.getKeywords}
                       onKeyDown={this.countChar.bind(this, 1500, 'abstract', 'counter')}
                       onKeyUp={this.countChar.bind(this, 1500, 'abstract', 'counter')} />,
              )}
            </FormItem>
            <div className={styles.countChar}>可以输入<span id="counter">1500</span>字</div>
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

            {addNewTalk &&
            <AddExpertModal editTheTalk={editTheTalk} parentProps={this.props}
                            startValue={this.state.startValue} endValue={this.state.endValue}
                            address={this.expertExtendAddress}
                            callbackParent={this.addTheNewTalk}
                            callbackParentSetAddNewTalk={this.setAddNewTalk} />}
          </Col>

          <Col className={styles.formFooter}>
            <FormItem
              wrapperCol={{ span: 12, offset: 6 }} style={{ marginBottom: 6 }}>
              <Button type="primary" onClick={this.handleSubmit}
                      loading={load}
                      style={{ width: '50%', height: 40 }}>确定</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default connect(({ seminar, person, loading }) => ({ seminar, person, loading }))(WrappedRegistrationForm);
