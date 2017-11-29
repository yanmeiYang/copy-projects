/**
 * Created by yangyanmei on 17/11/23.
 */
import React from 'react';
import { Affix, Button, Popover, Form, Input } from 'antd';
import { connect } from 'dva';
import { compare } from 'utils/compare';
import styles from './Feedback.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class Feedback extends React.Component {
  state = {
    visible: false,
  };

// componentDidUpdate(prevProps) {
//   console.log('===========', prevProps.feedbackStatus);
//   console.log('>>>>>>>>>>>>>>>>====', this.props.feedbackStatus);
//   if (prevProps.feedbackStatus && prevProps.feedbackStatus !== this.props.feedbackStatus) {
//     this.props.form.resetFields();
//   }
// }

  componentWillReceiveProps(nextProps) {
    if (nextProps.feedbackStatus && this.props.feedbackStatus !== nextProps.feedbackStatus) {
      this.props.form.resetFields();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log('d>>>>>>>>>>>>', values)
      if (!err) {
        const data = values;
        this.props.dispatch({
          type: 'app/setFeedback',
          payload: { ...data, user: this.props.user, url: window.location.href },
        });
      }
    });
  };
  closePopover = () => {
    this.setState({
      visible: false,
    });
  };
  openPopover = () => {
    this.setState({
      visible: true,
    });
  };
  mouseLeave = () => {
    let values = this.props.form.getFieldsValue();
    if (!values.email && !values.content) {
      this.setState({
        visible: false,
      })
    }
  };

  render() {
    const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;

    const load = this.props.loading.effects['app/setFeedback'];

    const content = (
      <Form onSubmit={this.handleSubmit} className={styles.feedbackForm}
            onMouseLeave={this.mouseLeave}>
        <span>请输入您的email和问题或建议,我们会及时的处理你的宝贵意见：</span>
        <FormItem
        >
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: '邮箱格式错误!' }],
          })(
            <Input placeholder="请输入您的email!" className={styles.inputBox} />,
          )}
        </FormItem>
        <FormItem
        >
          {getFieldDecorator('content', {
            rules: [{ required: true, message: 'Please input your content' }],
          })(
            <TextArea rows={4} placeholder="请输入您的宝贵意见和建议!" />,
          )}
        </FormItem>
        <FormItem className={styles.submitBtn}>
          <Button
            type="primary"
            htmlType="submit"
            size="small"
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    );
    const title = (
      <div className={styles.titleBox}>
        <span>Feedback</span>
        <i class="fa fa-times" onClick={this.closePopover} />
      </div>
    );
    return (
      <Affix offsetBottom={20} className={styles.affixFeedback}>
        <Popover placement="topRight" content={content}
                 title={title} visible={this.state.visible}>
          <Button icon="fa-smile-o" type="primary" loading={load} size="large"
                  onMouseOver={this.openPopover}>
            {!load &&
            <span>
              <i className="fa fa-smile-o" style={{ fontWeight: 'bold' }} /> &nbsp;
            </span>}
            Feedback
          </Button>
        </Popover>
      </Affix>
    );
  }
}

export default connect(({ app, loading }) => ({
  user: app.user, feedbackStatus: app.feedbackStatus, loading,
}))(Form.create()(Feedback));
