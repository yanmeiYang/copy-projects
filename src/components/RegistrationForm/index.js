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
  Modal
} from 'antd';
import { request, config } from '../../utils';
import styles from './index.less'
import defaultImg from '../../assets/people/default.jpg';
import CanlendarInForm from '../../components/seminar/calendar';
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
    speaker: {
      name: '', position: '', affiliation: ''
    }
  };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let data = values;
        data.location = { city: '', address: '' };
        data.time = { from: '', to: '' };
        // data.img = image;
        data.type = parseInt(values.type);
        data.location.address = values.address;
        data.time.from = this.state.startValue.toJSON();
        data.time.to = this.state.endValue.toJSON();
        data.uid = '54f5112e45ce1bc6d563b8d9';
        fetch(config.baseURL + config.api.postActivity, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
          },
          body: JSON.stringify(data),
        });
        // $http.post api.postActivity,
        // $scope.seminar
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

  //search experts
  showModal = (name) => {
    console.log(name);
    // dispatch({type:'seminar/getSpeakerSuggest',payload:''});
    this.setState({
      searchExperts: true,
    });
  };
  handleOk = (e) => {
    console.log(e);
    this.setState({
      searchExperts: false,
    });
  };
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      searchExperts: false,
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    let { addNewTalk, selectedType } = this.state;

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
              {getFieldDecorator('activityTags', {})(<Input placeholder='活动标签'/>)}

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
                          <div className={styles.crop}><span className="helper"></span><img src={this.getImg()}/>
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
                      {getFieldDecorator('speaker.name', {})(
                        <Input size='large' placeholder='嘉宾姓名'/>
                      )}
                      {getFieldDecorator('speaker.affiliation', {})(
                        <Input size='large' placeholder='嘉宾职位'/>
                      )}
                      {getFieldDecorator('speaker.position', {})(
                        <Input size='large' placeholder='嘉宾单位'/>
                      )}
                      {/*<Button type='primary' className={styles.recommendation}*/}
                      {/*onClick={this.showModal.bind(this)}>相关嘉宾推荐</Button>*/}
                      <Modal
                        title="Search Experts"
                        visible={this.state.searchExperts}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                      >
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                      </Modal>
                    </div>
                  </Col>
                </FormItem>
              </div>
            </Col> : ''}
          {/*workshop*/}
          {selectedType === '1' ?
            <Col className={styles.thumbnail} span={12} offset={6}>
              <Button type='default' onClick={this.addTalkData.bind(this, addNewTalk)}>新增嘉宾</Button>
              {addNewTalk ?
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="Title"
                  >
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '请输入活动名称',
                      }],
                    })(
                      <Input placeholder='title。。。'/>
                    )}
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
                        <Button type='primary' className={styles.recommendation}>相关嘉宾推荐</Button>
                        <Input size='large' placeholder='嘉宾姓名'/>
                        <Input size='large' placeholder='嘉宾职位'/>
                        <Input size='large' placeholder='嘉宾单位'/>
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

export default WrappedRegistrationForm;

// export default RegistrationForm;
