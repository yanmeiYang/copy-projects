/**
 * Created by yangyanmei on 17/6/15.
 */
import React from 'react';
import { Col, Input, Button } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import styles from './comments.less';

class CommentsByActivity extends React.Component {
  state = {};

  submitComment = () => {
    this.props.dispatch({
      type: 'seminar/addCommentToActivity',
      payload: { id: this.props.activityId, data: {body:this.refs.comment.refs.input.value} }
    })
  };

  render() {
    const comments = this.props.seminar.comments;
    return (
      <Col md={24} lg={{ span: 16, offset: 4 }} className={styles.thumbnail}>
        <ul className={styles.commentList}>
          {comments.map((comment) => {
            return (
              <li key={comment.id}>
                <img src={comment.user.avatar}/>
                {/*<span className={styles.delete}> 删除</span>*/}
                <span className={styles.message}>
                  <Link to='' className={styles.username}>{comment.user.name}</Link>
                  <p className={styles.text}>{comment.body}</p>
                  <p className={styles.time}>{comment.ts}</p>
                </span>

              </li>
            )
          })}
        </ul>
        <div className={styles.comment}>
          <Input type='textarea' rows={4} placeholder='请输入评语。。。' ref='comment'/>
          <Button type="primary" onClick={this.submitComment}>发布</Button>
        </div>
      </Col>
    )
  }
}

export default connect(({ seminar }) => ({ seminar }))(CommentsByActivity);
