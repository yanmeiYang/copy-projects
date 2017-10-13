import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Modal, message } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { routerRedux } from 'dva/router';
import styles from './AddToEBButton.less';

@connect(({ expertBase, loading }) => ({ expertBase, loading }))
export default class AddToEBButton extends PureComponent {
  constructor(props) {
    super(props);
    const { person, targetExpertBase, expertBaseId } = props;
    this.state = {
      // visible: false,
      dataIdItem: targetExpertBase,
      // value: 1,
      // personData: '',
      // load: false,
      isInThisEB: expertBaseId === 'aminer'
        ? person && person.locks && person.locks.roster
        : true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expertBase.addStatus &&
      this.props.expertBase.addStatus !== nextProps.expertBase.addStatus) {
      if (this.props.expertBase.currentPersonId === this.props.person.id) {
        // message.success('添加成功！');
        this.setState({ isInThisEB: true });
      }
    }
  }

  add = (id) => {
    const ebid = this.state.dataIdItem;
    this.props.dispatch({
      type: 'expertBase/addExpertToEB',
      payload: { ebid, id },
    });
    // this.setState({ personData: this.props.person.id });
  };

  removeExpert = (pid) => {
    // TODO 看一下，这里是标准用法:
    const { dispatch, expertBaseId } = this.props;
    const rid = this.state.dataIdItem;
    const offset = 0;
    const size = 100;
    const that = this;
    Modal.confirm({
      title: '删除', // TODO i18n
      content: '确定删除吗？',
      onOk() {
        dispatch({ type: 'expertBase/removeExpertFromEB', payload: { pid, rid, offset, size } })
          .then(() => {
            if (!expertBaseId || expertBaseId !== 'aminer') { // 全球人才删除时不从列表移除.
              dispatch({ type: 'search/removePersonFromSearchResultsById', payload: { pid } });
            }
            message.success('Experts Removed!');
          });
        that.setState({ isInThisEB: false });
      },
      onCancel() {
        // nothing
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
  };

  render() {
    const { person } = this.props;
    if (!person) {
      return null;
    }
    const load = person.id && this.props.expertBase.currentPersonId === person.id;
    return (
      <div className={styles.buttonArea}>
        {this.state.isInThisEB ? (
          <Button onClick={this.removeExpert.bind(this, person.id)}>
            <FM id="com.bole.Remove" defaultMessage="Remove" />
          </Button>
        ) : (
          <Button onClick={this.add.bind(this, person.id)} loading={load}>
            <FM id="com.bole.AddButton" defaultMessage="Add" />
          </Button>
        )}
      </div>
    );
  }
}
