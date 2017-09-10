/**
 * Created by zlm on 2017/8/31.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { routerRedux } from 'dva/router';
import styles from './AddToEBButton.less';

@connect(({ expertBase }) => ({ expertBase }))
export default class AddToEBButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIdItem: props.ExpertBase,
      value: 1,
      personData: '',
      isInThisEB: props.person && props.person.locks && props.person.locks.roster,
  };
  }

  add = (id) => {
    const that = this;
    const ebid = this.state.dataIdItem;
    const aids = id.split(';');

    this.props.dispatch({
      type: 'expertBase/addExpertToEB',
      payload: { ebid, aids },
    });
    this.setState({ loading: true });
    if (this.props.expertBase.addStatus) {
      Modal.success({
        content: '添加成功',
      });
      setTimeout(() => {
        this.setState({ isInThisEB: true});
      }, 400);
    }
    this.setState({ personData: this.props.person.id });
  };
  removeItem = (pid) => {
    const rid = this.state.dataIdItem;
    const props = this.props;
    const offset = 0;
    const size = 100;
    const that = this;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        props.dispatch({
          type: 'expertBase/removeExpertItem',
          payload: { pid, rid, offset, size },
        });
        that.setState({ isInThisEB: false });

      },
      onCancel() {
      },
  });
  };

  handleOk = (id) => {
    const ebid = this.state.dataIdItem;
    const aids = id.split(';');
    this.props.dispatch({
      type: 'expertBase/addExpertToEB',
      payload: { ebid, aids },
    });

    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  selectTitleArea = (id, e) => {
    this.setState({
      value: e.target.value,
    });
    this.setState({ dataIdItem: id });
  };

  render() {
    const per = this.props.person;
    // const { results } = this.props.expertBase;
    // const orgData = results.data;
    return (
      <div className={styles.buttonArea}>
        {this.state.isInThisEB ?
          <Button onClick={this.removeItem.bind(this, per.id)}>
            <FM id="com.bole.Remove" defaultMessage="Remove" />
          </Button> :
          <Button onClick={this.add.bind(this, per.id)}>
            <FM id="com.bole.AddButton" defaultMessage="Add" />
          </Button>
        }
      </div>
    );
  }
}
