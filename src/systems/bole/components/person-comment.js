/**
 * Created by yangyanmei on 17/9/5.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Modal, Button } from 'antd';
import { F } from 'utils/next-api-builder';
import { compare } from 'utils/compare';
import { Labels } from 'routes/common';
import CKEditor from './ckeditor-config';
import styles from './person-comment.less';

class PersonComment extends React.Component {
  state = {
    isComment: false,
    content: '',
    flag: false,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ flag: false });
    if (nextProps.personComments.createComment) {
      this.setState({ content: '' });
      this.props.dispatch({ type: 'personComments/createFlagFun' });
    }
  }

  // TODO chnage to compare utils.
  shouldComponentUpdate(nextProps, nextStates) {
    if (compare(
        nextProps, this.props,
        'personComments', 'tags',
      )) {
      return true;
    }
    if (compare(
        nextStates, this.state,
        'isComment', 'content', 'flag',
      )) {
      return true;
    }
    return false;
  }

  // 存储活动标签
  // onTagsChanged = (value) => {
  //   this.setState({ tags: value });
  // };


  getContent(newContent) {
    this.setState({
      content: newContent,
    });
  }

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
    const props = this.props;
    Modal.confirm({
      title: '删除',
      content: '确定删除该条备注？',
      onOk() {
        props.dispatch({
          type: 'personComments/deleteTheComment',
          payload: { aid: props.person.id, index },
        });
      },
      onCancel() {
      },
    });
  };

  updateContent(newContent) {
    this.setState({
      content: newContent,
    });
    const { person, user } = this.props;
    if (this.state.content) {
      this.props.dispatch({
        type: 'personComments/createComment',
        payload: {
          comment: this.state.content, person,
          uid: user.id, user_name: user.display_name,
        },
      });
    }
    this.setState({ flag: true });
  }

  render() {
    const { personComments, person, expertBaseId, app, tags } = this.props;
    const { user } = app;
    if (expertBaseId === 'aminer' || !expertBaseId) {
      return false;
    }
    const comments = personComments && personComments.tobProfileMap.size !== undefined
      && personComments.tobProfileMap.get(person.id);
    let commentsData;
    if (comments && comments.extra && comments.extra.comments) {
      if (comments.extra.comments.length > 10) {
        const newData = comments.extra.comments;
        commentsData = newData.splice(0, 10);
      } else {
        commentsData = comments.extra.comments;
      }
    }
    const total = comments && comments.extra && comments.extra.comments.length;
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.commentStyles}>
        <div className={styles.commentAndTags}>
          <div className={styles.iconStyle} onClick={this.putMessage.bind(this)}>
            <Icon type="message" />
            <span className={styles.total}>备注</span>
            {total && <span>{total || 0}</span>}
          </div>
          <div className={styles.tags}>
            <Labels
              tags={tags}
              targetId={person.id}
              targetEntity={F.Entities.Person}
            />
          </div>
        </div>

        <div className={styles.commentArea}>
          {this.state.isComment &&
          <div>
            <div className={styles.inputStyle}>
              <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                <FormItem>
                  <div>
                    {getFieldDecorator('comment')(
                      <div>
                        <CKEditor
                          ref="editor" flag={this.state.flag}
                          activeClass="CKeidtorStyle"
                          content={this.state.content}
                          onChange={this.getContent.bind(this)}
                          scriptUrl="/lib/ckeditor/ckeditor.js"
                        />
                        <div className={styles.ckEditorSubmitBtn}>
                          <Button
                            type="primary"
                            onClick={this.updateContent.bind(this, this.state.content)}
                          > 备注
                          </Button>
                        </div>

                      </div>)}
                  </div>
                </FormItem>
              </Form>
            </div>

            {/*----评论列表----*/}
            {(comments && comments.extra && comments.extra.comments) &&
            <div className={styles.commentList}>
              {commentsData.map((comment, index) => {
                return (
                  <div key={index}>
                    {(comment && comment.create_user) &&
                    <div className={styles.userInfo}>
                      <span className={styles.name}>{comment.create_user.name}: </span>
                      <div className={styles.commentBlock}>
                        <span dangerouslySetInnerHTML={{ __html: comment.comment }}
                              className={styles.commentsChildren} />
                        <div>
                          {new Date(comment.create_user.time).format('yyyy年MM月dd日 HH:mm')}
                          {(user.id === comment.create_user.uid) &&
                          <Icon type="close-circle-o" className={styles.delCommentBtn}
                                onClick={this.deleteTheComment.bind(this, index)} />
                          }
                        </div>
                      </div>
                    </div>
                    }
                  </div>
                );
              })
              }
              {/*<div className={styles.cardMore}>*/}
              {/*查看更多*/}
              {/*</div>*/}
            </div>
            }
          </div>
          }
        </div>

      </div>
    );
  }
}

const mapStateToProps = ({ app, personComments, commonLabels }, { person }) => ({
  personComments,
  app: {
    user: app.user,
    roles: app.roles,
  },
  tags: commonLabels.tagsMap && person && commonLabels.tagsMap.get(person.id),
});

export default connect(mapStateToProps)(Form.create()(PersonComment));
