/**
 * Created by zhanglimin on 17/9/7.
 */
import React from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { Icon, Input, Button } from 'antd';
import styles from './person-comments.less';

export default class PersonComments extends React.PureComponent {
  state = {
    commentAreaShow: false,
  };
  openComment = () => {
    this.setState({ commentAreaShow: !this.state.commentAreaShow });
  };
  addComments = () => {

  };

  render() {
    const { commentAreaShow } = this.state;
    return (
      <footer className={styles.conmentsBar}>
        <Icon type="message" className={styles.message} onClick={this.openComment.bind(this)} />
        <span className={styles.messageTotal}>共0条</span>
        {commentAreaShow ?
          <div className={styles.commentsArea}>
            <Input type="text" />
            <Button onclick={this.addComments.bind(this,)}><FM id="com.bole.CommentsAddButton"
                                                              defaultMessage="添加"></FM></Button>
          </div> : ''
        }
      </footer>
    );
  }
}

