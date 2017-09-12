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

  state = {};
  putMessage = () => {
    this.setState({ isComment: !this.state.isComment });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { person, user } = this.props;
        this.props.dispatch({
          type: 'personComments/createComment',
          payload: {
            comment: values.comment, person,
            uid: user.id, user_name: user.display_name,
          },
        });
      }
    });
  };

  deleteTheComment = (index) => {
    this.props.dispatch({
      type: 'personComments/deleteTheComment',
      payload: { aid: this.props.person.id, index },
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
          <span><i className="fa fa-comments-o" /> {total
          && <span>{total || 0}</span>}</span>
        </div>
        {(comments && comments.extra && comments.extra.comments) &&
        <div className={styles.commentArea}>
          <div className={styles.title}>View previous comments</div>
          {comments.extra.comments.map((comment, index) => {
            return (
              <div key={index}>
                {(comment && comment.create_user) &&
                <div className={styles.userInfo}>
                  <span className={styles.name}>{comment.create_user.name}</span>
                  <span className={styles.comments}>{comment.comment}
                    <Icon type="close-circle-o" className={styles.userInfoClose}
                          onClick={this.deleteTheComment.bind(this, index)} /></span>
                </div>
                }
              </div>
            );
          })
          }
        </div>
        }
        <div>
          <div className={styles.inputStyle}>
            <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
              <FormItem>
                {getFieldDecorator('comment')(
                  <Input type="text" placeholder="Write a comment..."
                         suffix={<i className="fa fa-send-o" />} />,
                )}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ personComments }) => ({ personComments }))(Form.create()(PersonComment));
