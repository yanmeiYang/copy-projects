/**
 * Created by yangyanmei on 17/9/5.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { sysconfig } from '../../../systems';
import styles from './person-comment.less';

class PersonComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.TheOnlyExpertBaseID = '59a8e5879ed5db1fc4b762ad';
  }

  state = {
    isComment: false,
  };
  putMessage = () => {
    this.setState({ isComment: !this.state.isComment });
  };
  handleSubmit = () => {
    const id = this.TheOnlyExpertBaseID;
    console.log('这里=======');
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'expertBase/sendComments', payload: { values, id, aids } });
      }
    });
  };

  render() {
    const per = this.props.expertBase;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.commentStyles}>
        <span onClick={this.putMessage.bind(this)}>
         <Icon type="message" />
        </span>
        {this.state.isComment ?
          <div className={styles.inputStyle}>
            <Form layout="inline" onSubmit={this.handleSubmit.bind()}>
              <FormItem>
                {getFieldDecorator('comment')(
                  <Input type="text" placeholder="comment" />,
                )}
              </FormItem>
              <FormItem>
                <Button onSubmit={this.handleSubmit.bind()}
                        className={styles.addCommentButton}>
                  <FM id="com.bole.personComment" defaultMessage="Comments" /></Button>
              </FormItem>
            </Form>
          </div> : false}
      </div>
    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(Form.create()(PersonComment));

