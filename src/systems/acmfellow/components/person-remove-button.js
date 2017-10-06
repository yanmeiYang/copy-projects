/**
 * Created by zlm on 2017/09/07.
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import styles from './AddToEBButton.less';
import * as Const from '../const-acmfellow';

class PersonRemoveButton extends React.PureComponent {
  state = {};
  removeItem = (pid) => {
    const rid = Const.ExpertBase;
    const props = this.props;
    const offset = 0;
    const size = 100;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        props.dispatch({
          type: 'expertBase/removeExpertItem',
          payload: { pid, rid, offset, size },
        });
      },
      onCancel() {
      },
    });
  };

  render() {
    const per = this.props.person;
    return (
      <div className={styles.buttonArea}>
        <Button onClick={this.removeItem.bind(this, per.id)}>
          <FM id="com.bole.PersonRemoveButton" defaultMessage="移除" />
        </Button>

      </div>
    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(PersonRemoveButton);
