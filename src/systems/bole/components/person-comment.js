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
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'personComments/createComment',
          // TODO 需要获取用户uid，和 display_name
          payload: { comment: values, person: this.props.person, uid: '', user_name: 'yym' },
        });
      }
    });
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
            <span>共 {total} 条</span> : <span>共 0 条</span>}
        </div>
        <div>
          {this.state.isComment &&
          <div className={styles.inputStyle}>
            <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
              <FormItem>
                {getFieldDecorator('comment')(
                  <Input type="text" placeholder="comment" />,
                )}
              </FormItem>
              <FormItem>
                <Button htmlType="submit" className={styles.addCommentButton}>
                  <FM id="com.bole.personComment" defaultMessage="Comments" />
                </Button>
              </FormItem>
            </Form>
          </div>}
        </div>
        {(comments && comments.extra && comments.extra.comments) &&
        <div className={styles.commentArea}>
          {comments.extra.comments.map((comment, index) => {
            return (
              <div key={index}>
                {(comment && comment.create_user) &&
                <div>
                  <span className={styles.name}>{comment.create_user.name}：</span>
                  <span className={styles.comments}>{comment.comment}</span>
                </div>
                }
              </div>
            );
          })
          }
        </div>
        }
      </div>
    );
  }
}

export default connect(({ personComments }) => ({ personComments }))(Form.create()(PersonComment));
