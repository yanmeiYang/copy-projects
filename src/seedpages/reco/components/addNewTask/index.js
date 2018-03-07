import React, { Component } from 'react';
import {
  Form, Radio, Upload, Icon, Divider,
  Tag, Input, Tooltip, Checkbox, Modal,
} from 'antd';
import { config } from 'utils';
import EditMailTemplate from './editMailTemplate/editMailTemplate';
import ChooseNationality from './chooseNationality/chooseNationality';
import styles from './index.less';

const FormItem = Form.Item;
const { RadioButton } = Radio;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;
const CheckboxGroup = Checkbox.Group;

const plainOptions = ['>100', '10~100', '<10'];

class AddNewTask extends Component {
  state = {
    fileList: [],
    tags: [],
    inputVisible: false,
    inputValue: '',
    checkedList: plainOptions,
    contentType: 1,
    indeterminate: false,
    checkAll: true,
    emailData: [],
    tagArray: [],
    range: ['all'], // 发给父组件
    // fileName: [],
  };
  fileName = [];
  attachmentIds = [];
  attachmentGroup = [];

  // test add defultvalue init
  componentDidMount() {
    // TODO @xiaobei: 查看状态下，数据初始化不一样，需要判断
    this.props.form.setFieldsValue({
      recommNum: 200,
      Recommended: 'reader',
    });
  }

  // TODO @xiaobei: 测试编辑,是否增加isEdit状态? 更新钩子里需要加上setfilevalue!!!
  componentWillReceiveProps(nextProps) {
    const { isEdit, projData, isView } = this.props;
    const projInfo = nextProps.projData;
    if ((isEdit || isView) &&
      projData.length === 0 && (this.props.projData !== nextProps.projData)) {
      const editemail = {
        mailTitle: projInfo.subject,
        mailEditor: projInfo.from,
        mailBody: projInfo.template,
      };
      if (projInfo.query) {
        const query = JSON.parse(projInfo.query);
        const hindex = query.parameters.filters.ranges.h_index;
        let hIndex = [];
        if (hindex.length === 2) {
          if (hindex[0] === '100') {
            hIndex = ['>100'];
          } else {
            hIndex = ['<10'];
          }
        } else if (hindex.length > 3) {
          hIndex = ['10~100'];
        } else {
          hIndex = ['>100', '10~100', '<10'];
        }
        const { nation } = query.parameters.filters.terms;
        this.setState({
          range: nation,
          checkedList: hIndex,
        });
        this.props.form.setFieldsValue({
          recommNum: query.parameters.size,
        });
      }

      if (projInfo.pdfs) {
        const { pdfs } = projInfo;
        const file = pdfs.map((pdf) => {
          const data = {
            name: pdf.name,
            url: pdf.url,
            uid: pdf.id,
            id: pdf.id,
          };
          return data;
        });
        this.fileName = pdfs.map((pdf) => {
          const data = {
            label: pdf.name,
            value: pdf.id,
          };
          return data;
        });
        const tagArray = [];
        pdfs.map((pdf) => {
          if (pdf.keywords) {
            pdf.keywords.forEach((keyword) => {
              tagArray.push(keyword);
            });
            return tagArray;
          }
          return [];
        });
        this.setState({
          fileList: file,
          tags: tagArray,
        });
      }
      if (projInfo.attachment_ids) {
        this.attachmentIds = projInfo.attachment_ids;
      }
      this.setState({
        emailData: editemail,
        contentType: projInfo.content_from || 1,
      });
      this.props.form.setFieldsValue({
        Recommended: projInfo.recommend_object || '',
        email: projInfo.private_mail || '',
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.allDataSubmit();
    }
  }


// 上传pdf。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
  handleChange = (info) => {
    const { status } = info.file;
    const { fileList } = info;
    if (status === 'uploading') {
      const fileGroup = fileList.map((file) => {
        const files = {
          uid: file.uid,
          name: file.name,
          url: file.url ? file.url : '',
          status: file.status,
          id: file.id ? file.id : '',
        };
        return files;
      });
      this.setState({ fileList: fileGroup });
    }
    if (status === 'done') {
      const fileGroup = fileList.map((file) => {
        const files = {
          uid: file.uid,
          name: file.name,
          url: file.response ? file.response.data[0].items[0].url : file.url,
          status: file.status,
          id: file.response ? file.response.data[0].items[0].id : file.id,
        };
        return files;
      });
      const keyWords = fileList.map((file) => {
        return (file.response && file.response.data[0].items[0].keywords) ?
          file.response.data[0].items[0].keywords : [];
      });
      const { tagArray } = this.state;
      if (keyWords.length > 0) {
        for (const tags of keyWords) {
          tags.forEach((tag) => {
            tagArray.push(tag);
          });
        }
      }
      this.fileName = fileGroup.map((file) => {
        const data = {
          label: file.name,
          value: file.id,
        };
        return data;
      });
      this.setState({ fileList: fileGroup, tags: tagArray, tagArray });
    } else if (status === 'error') {
      Modal.error({
        content: '上传失败，请重新上传',
      });
    }
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
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
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
  chooseHindex = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  // 选择附件，默认不选中
  chooseAppendix = (checkedValues) => {
    this.attachmentIds = checkedValues;
    this.allDataSubmit();
  };

// 选择推送范围的callback
  chooseRange = (data) => {
    this.setState({ range: data });
  };

// 表单提交事件onchage 多次调用，回传数据，每次调用，都要回传所有方法
  allDataSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { fileList, emailData, range, tags, contentType, checkedList } = this.state;
        const tasks = [];
        fileList.forEach((file) => {
          const taskid = {
            id: file.id,
          };
          tasks.push(taskid);
        });
        let hindex = [];
        switch (checkedList) {
          case '>100':
            hindex = ['100', ''];
            break;
          case '10-100':
            hindex = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
            break;
          case '<10':
            hindex = ['', '10'];
            break;
          default:
            hindex = [];
        }
        const allData = {
          fileid: tasks,
          email: emailData,
          recommNum: values.recommNum,
          Recommended: values.Recommended,
          testmail: values.email,
          content: contentType,
          attachmentGroup: this.attachmentIds || [],
          search: {
            action: 'search',
            parameters: {
              query: tags,
              size: values.recommNum,
              filters: {
                ranges: {
                  h_index: hindex,
                },
                terms: {
                  nation: range,
                },
              },
            },
          },
        };
        this.props.callbackParent(allData);
      }
    });
  };
// 将邮件模板返回
  saveEmailTemp = (allData) => {
    this.setState({ emailData: allData });
  };
  // 选择contentType方法
  contentType = (e) => {
    this.setState({ contentType: e.target.value });
  };

  render() {
    const { tags, inputVisible, inputValue, emailData, contentType, range } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const upload = {
      name: 'files',
      multiple: true,
      showUploadList: true,
      data: {
        action: 'reviewer.UploadPDF',
        parameters: JSON.stringify({ ids: [], files: ['files'] }),
      },
      accept: 'application/pdf',
      action: `${config.nextAPIURL}/magic`,
      onChange: this.handleChange,
    };
    return (
      <div className={styles.addNewTask}>
        <Form onSubmit={this.allDataSubmit}>
          <h3>推荐内容</h3>
          <Divider />
          <FormItem
            {...formItemLayout}
            label="推荐内容形式"
            className={styles.item}
          >
            <RadioGroup onChange={this.contentType} value={contentType}>
              <Radio value={1}>上传论文</Radio>
              <Radio value={2}>输入关键词</Radio>
            </RadioGroup>
          </FormItem>
          {contentType === 1 &&
          <FormItem
            {...formItemLayout}
            label="上传"
          >
            <Dragger {...upload} fileList={this.state.fileList}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或拖拽上传</p>
              <p className="ant-upload-hint">一次只支持上传一个文件</p>
            </Dragger>
          </FormItem>}
          {(tags.length > 0 || contentType === 2) &&
          <FormItem
            {...formItemLayout}
            label="关键词"
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
                style={{ background: '#1890ff', borderStyle: 'solid', color: 'white' }}
              >
                <Icon type="plus" />补充关键词
              </Tag>
            )}
          </FormItem>}
          {this.fileName.length !== 0 &&
          <FormItem
            {...formItemLayout}
            label="是否将文件作为邮件附件一并发送"
          >
            <CheckboxGroup options={this.fileName} onChange={this.chooseAppendix}
                           value={this.attachmentIds} />
          </FormItem>}
          <h3>邮件信息</h3>
          <Divider />
          <FormItem
            {...formItemLayout}
            label="推荐数量"
          >
            {getFieldDecorator('recommNum')(
              <RadioGroup>
                <Radio value={200}>200</Radio>
                <Radio value={500}>500</Radio>
                <Radio value={1000}>1000</Radio>
              </RadioGroup>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="H-index"
          >

            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.chooseHindex}
              checked={this.state.checkAll}
            >
              All
            </Checkbox>
            <CheckboxGroup options={plainOptions} className={styles.checkBox}
                           value={this.state.checkedList} onChange={this.changeHindex} />
          </FormItem>
          <FormItem>
            <ChooseNationality callbackParent={this.chooseRange} national={range} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮件模板"
          >
            <EditMailTemplate
              callbackParent={this.saveEmailTemp}
              emailInfo={emailData}
            />
          </FormItem>
          <h3>推荐对象</h3>
          <Divider />
          <FormItem
            {...formItemLayout}
            label="推荐对象"
          >
            {getFieldDecorator('Recommended')(
              <RadioGroup onChange={this.allDataSubmit}>
                <Radio value="reader">期刊读者</Radio>
                <Radio value="reviewer">论文审稿人</Radio>
              </RadioGroup>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="电子邮箱"
          >
            {getFieldDecorator('email')(<Input onChange={this.allDataSubmit}
                                               placeholder="多个邮箱以半角分号隔开,自助加入的邮箱,不计入统计" />)}
          </FormItem>

        </Form>
      </div>
    );
  }
}

export default Form.create()(AddNewTask);
