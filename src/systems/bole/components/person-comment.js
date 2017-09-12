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
    // NOTE 使用这种方式来减小之后的代码长度。
    // FIXME ExpertBase属性与model太接近了。
    this.TheOnlyExpertBaseID = '59a8e5879ed5db1fc4b762ad';
    const { person, expertBaseId } = props;
    this.state = {
      isInThisEB: expertBaseId === 'aminer'
        ? true
        : person && person.locks && person.locks.roster,
    };
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
      <div>
        { !this.state.isInThisEB
        && <div className={styles.commentStyles}>
          <div className={styles.iconStyle} onClick={this.putMessage.bind(this)}>
            <Icon type="message" />
            {total ?
              <span>共 {total} 条</span> : <span>共 0 条</span>}
          </div>
          <div>
            {this.state.isComment &&
            <div className={styles.inputStyle}>
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('comment')(
                    <Input type="text" placeholder="comment" />,
                  )}
                </FormItem>
                <FormItem>
                  <Button htmlType="submit"
                          className={styles.addCommentButton}>
                    <FM id="com.bole.personComment" defaultMessage="Comments" /></Button>
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
                    <Button type="danger" size="small"
                            onClick={this.deleteTheComment.bind(this, index)}>
                      删除
                    </Button>
                  </div>
                  }
                </div>
              );
            })
            }
          </div>
          }
        </div>
        }
      </div>
    );
  }
}

export default connect(({ personComments }) => ({ personComments }))(Form.create()(PersonComment));
