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
    // const id = this.TheOnlyExpertBaseID;F
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     this.props.dispatch({
    //       type: 'personComments/sendComments',
    //       payload: { values, id, aids }
    //     });
    //   }
    // });
  };

  render() {
    const { personComments, person } = this.props;
    const comments = personComments && personComments.tobProfileMap.size !== undefined
      && personComments.tobProfileMap.get(person.id);
    const total = comments && comments.extra && comments.extra.comments.length;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.commentStyles}>
        <div className={styles.iconStyle} onClick={this.putMessage.bind(this)}>
          <Icon type="message" />
          {total ?
            <span >共 {total} 条</span>:<span >共 0 条</span>}
        </div>
        <div>
          {this.state.isComment &&
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
          </div>}
        </div>
        {comments && comments.extra && comments.extra.comments &&
        <div className={styles.commentArea}>
          {comments.extra.comments.map((comment) => {
            return (
              <div key={comment.create_user.time}>
                <span className={styles.name}>{comment.create_user.name}：</span>
                <span className={styles.comments}>{comment.comment}</span>
              </div>);
          })}</div>
        }

      </div>
    );
  }
}

export default connect(({ personComments }) => ({ personComments }))(Form.create()(PersonComment));
