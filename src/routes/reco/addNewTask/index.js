import React, { Component } from 'react';
import { connect } from 'dva';
import { getLocalToken } from 'utils/auth';
import {
  Form, Select, Radio,
  Button, Upload, Icon, Divider,
  Tag, Input, Tooltip, Checkbox, Table,
} from 'antd';
import EditMailTemplate from './editMailTemplate/editMailTemplate';
import ChooseNationality from './chooseNationality/chooseNationality'
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Dragger = Upload.Dragger;
const CheckboxGroup = Checkbox.Group;

const plainOptions = ['>100', '10~100', '<10'];

class AddNewTask extends Component {
  state = {
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png',
    }],
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
    inputVisible: false,
    inputValue: '',
    checkedList: plainOptions,
    indeterminate: false,
    checkAll: true,
    urlData: [],
    imgData: [],
    currentImg: '',
    emailData: [],
    selectedRowKeys: [],
    currentUrl: [],
  };


  // TODO @xiaobei: 测试编辑,是否增加isEdit状态?
  componentWillReceiveProps(nextProps) {
    const { isEdit, projData } = this.props;
    const projInfo = nextProps.projData;
    if (isEdit && projData.length === 0 && (this.props.projData !== nextProps.projData)) {
      const url = projInfo.links && projInfo.links.map((urlBox) => {
        return urlBox.url;
      });
      const editemail = {
        mailTitle: projInfo.subject,
        mailEditor: projInfo.from,
        mailBody: projInfo.template,
      }
      this.setState({
        emailData: editemail,
        currentImg: projInfo.track_openimg,
        selectedRowKeys: url,
      });
      if (projInfo.template) {
        this.queryImg(projInfo);
      }
    }
  }

// 编辑状态下加载所有的a和img标签
  queryImg = (data) => {
    const hrefBox = data.template.match(/<a[^>]+?href=["']htt+?([^"']+)["']?[^>].*?<\/a>/g);
    const imgBox = data.template.match(/<img.*?(?:>|\/>)/g);
    const imgArray = [];
    for (const items of imgBox) {
      const item = items.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/);
      imgArray.push(item[1]);
    }
    const taskBox = [];
    for (const href of hrefBox) {
      const content = href.match(/>(.*)<\/a>/);
      const url = href.match(/href=\"([^\"]+)/);
      const task = {
        name: content[1],
        url: url[1],
      };
      taskBox.push(task);
    }
    this.setState({ urlData: taskBox, imgData: imgArray });
  };
// TODO @xiaobei: 上传的所有方法,得调试
  handleChange = (info) => {
    let { fileList } = info;
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    this.setState({ fileList });
  };
  // 关键词所有事件
  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => this.input = input;
// hindex 多选框所有事件
  changeHindex = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
// 表单提交事件
  allDataSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.callbackParent(this.state);
        // TODO @xiaobei:暂时只提交邮件模版部分
      }
    });
  };
// 将邮件模板返回的url,img的src放到checkbox里面,可选,提交到后端
  getUrl = (result, imgGroup, alldata) => {
    this.setState({ urlData: result, imgData: imgGroup, emailData: alldata });
  };
// 处理title数据,logo链接不显示
  titleFilter = (data) => {
    let title;
    if (data.indexOf('<img') !== -1) {
      title = 'logo';
    } else {
      title = data;
    }
    return title;
  };
// 选择统计图片(只能选一张)
  changeImg = (e) => {
    this.setState({
      currentImg: e.target.value,
    });
  };
// 测试table选中
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys: selectedRowKeys, currentUrl: selectedRows });
  }

  render() {
    const {
      tags, inputVisible, inputValue,
      urlData, imgData, emailData, selectedRowKeys,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    // TODO @xiaobei: 上传的API需要修改
    const upload = {
      name: 'file',
      multiple: true,
      showUploadList: false,
      accept: 'pdf',
      action: '/api',
      // listType: 'text',
      headers: {
        // 获得登录用户的token
        Authorization: getLocalToken(),
      },
      onChange: this.handleChange,
    };
    // table 的选择url部分
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const chooseUrl = [{
      title: 'Title',
      dataIndex: 'name',
      render: name => <input defaultValue={this.titleFilter(name)} />,
    }, {
      title: 'Url',
      dataIndex: 'url',
    }];
    return (
      <div className={styles.addNewTask}>
        <Form onSubmit={this.allDataSubmit}>
          <h4>Recommended Content</h4>
          <Divider />
          <FormItem
            {...formItemLayout}
            label="Content Form"
          >
            {getFieldDecorator('radio-group')(
              <RadioGroup>
                <Radio value="a">Paper</Radio>
                <Radio value="b">Keyword</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Upload"
          >
            <Dragger {...upload}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file</p>
              <p className="ant-upload-hint">Support for a single</p>
            </Dragger>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="keywords"
          >
            {tags.map((tag) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag key={tag} color="#108ee9" closable
                     afterClose={() => this.handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (
              <Tag
                onClick={this.showInput}
                style={{ background: '#108ee9', borderStyle: 'solid', color: 'white' }}
              >
                <Icon type="plus" /> New Keyword
              </Tag>
            )}
          </FormItem>
          <h4>Mail</h4>
          <Divider />
          <FormItem
            {...formItemLayout}
            label="Num of recomm"
          >
            {getFieldDecorator('mailGroup')(
              <RadioGroup>
                <Radio value="a">200</Radio>
                <Radio value="b">500</Radio>
                <Radio value="c">1000</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="H-index"
          >

            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              All
            </Checkbox>
            <CheckboxGroup options={plainOptions} className={styles.checkBox}
                           value={this.state.checkedList} onChange={this.changeHindex} />
          </FormItem>
          <FormItem>
            <ChooseNationality />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Mail Template"
          >
            <EditMailTemplate
              callbackParent={this.getUrl}
              emailInfo={emailData}
            />
          </FormItem>

          {imgData.length > 0 &&
          <FormItem
            {...formItemLayout}
            label="请选择需要统计的图片(必选)"
          >
            <RadioGroup onChange={this.changeImg} value={this.state.currentImg}>
              {imgData.map((img) => {
                return (
                  <Radio value={img} key={img}><img src={img} height="80px" alt="img" /></Radio>
                );
              })}
            </RadioGroup>
          </FormItem>
          }
          {urlData.length > 0 &&
          <FormItem
            {...formItemLayout}
            label="请选择需要统计的链接"
          >
            <Table rowKey={record => record.url} pagination={false}
                   rowSelection={rowSelection} columns={chooseUrl} dataSource={urlData} />
          </FormItem>}
          <h4>Recommended Object</h4>
          <Divider />
          <FormItem
            {...formItemLayout}
            label="Recommend Object"
          >
            {getFieldDecorator('recommendGroup')(
              <RadioGroup>
                <Radio value="reader">Reader</Radio>
                <Radio value="reviewer">Reviewer</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="E-mail"
          >
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: false, message: 'Please input your E-mail!',
              }],
            })(
              <Input placeholder="多个邮箱以半角逗号隔开" />
            )}
            <span>自助加入的邮箱,不计入统计</span>
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.allDataSubmit}>保存以上信息</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(AddNewTask)
