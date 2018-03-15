/**
 * Created by yangyanmei on 18/2/12.
 */
import React, { PureComponent } from 'react';
import { connect, routerRedux } from 'engine';
import { Button, Modal, message, Checkbox, Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';
import styles from './SelectiveAddAndRemove.less';

@connect(({ expertBase, loading }) => ({ expertBase, loading }))
export default class SelectiveAddAndRemove extends PureComponent {
  constructor(props) {
    super(props);
    const { person, expertBaseId } = props;
    this.state = {
      dataIdItem: [expertBaseId],
      isInThisEB: person && person.locks && person.locks.roster,
      visible: false,
      addExpertVisible: false,
      selectedDelIds: [],
      selectedAddIds: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expertBase && this.props.expertBase.addStatus &&
      this.props.expertBase.addStatus !== nextProps.expertBase.addStatus) {
      if (this.props.expertBase.currentPersonId === this.props.person.id) {
        this.setState({ isInThisEB: true });
      }
    }
  }

  add = (id) => {
    const { currentBaseChildIds } = this.props;
    if (currentBaseChildIds && !isEmpty(currentBaseChildIds)) {
      this.setState({ addExpertVisible: true });
    } else {
      this.addExpertFunc(id);
    }

  };

  addExpertFunc = (id) => {
    const { currentBaseChildIds } = this.props;
    const { selectedAddIds, dataIdItem } = this.state;
    let ebid = null;
    if (selectedAddIds.length > 0) {
      ebid = selectedAddIds;
    } else {
      ebid = [this.props.expertBaseId];
    }
    if (currentBaseChildIds && !isEmpty(currentBaseChildIds)) {
      if (selectedAddIds.length <= 0) {
        message.error('选择要添加到哪些智库');
        return true;
      }
    }
    this.props.dispatch({
      type: 'expertBase/addExpertToEB',
      payload: { ebid, id },
    });
  };

  removeExpert = (pid) => {
    // TODO 看一下，这里是标准用法:
    const { currentBaseChildIds } = this.props;
    const { selectedDelIds, dataIdItem } = this.state;

    if (currentBaseChildIds && !isEmpty(currentBaseChildIds)) {
      this.setState({ visible: true });
    } else {
      this.removeExpertConfirmModal(pid);
    }
  };

  removeExpertConfirmModal = (pid) => {
    const { dispatch, expertBaseId, currentBaseChildIds } = this.props;
    const { selectedDelIds, dataIdItem } = this.state;
    let rid = null;
    if (selectedDelIds.length > 0) {
      rid = selectedDelIds;
    } else {
      rid = [this.props.expertBaseId];
    }
    const offset = 0;
    const size = 100;
    const that = this;

    if (currentBaseChildIds && !isEmpty(currentBaseChildIds)) {
      if (selectedDelIds.length <= 0) {
        message.error('选择要删除的智库');
        return true;
      }
    }
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
        that.setState({ isInThisEB: false, visible: false });
      },
      onCancel() {
        // nothing
      },
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, addExpertVisible: false });
  };

  onDelModal = (checkedValues) => {
    this.setState({ selectedDelIds: checkedValues });
  };

  onAddModal = (checkedAddValues) => {
    this.setState({ selectedAddIds: checkedAddValues });
  };

  sortByString = (a, b) => {
    return a[1].localeCompare(b[1]);
  };

  render() {
    const { person, expertBase, currentBaseChildIds } = this.props;
    const { isInThisEB } = this.state;
    if (!person) {
      return null;
    }
    const load = person.id && expertBase && expertBase.currentPersonId === person.id;

    return (
      <div className={styles.buttonArea}>
        {isInThisEB &&
        <Button onClick={this.removeExpert.bind(this, person.id)} className="thin">
          <FM id="com.bole.Remove" defaultMessage="Remove" />
        </Button>}
        {!isInThisEB &&
        <Button onClick={this.add.bind(this, person.id)} loading={load} className="thin">
          <FM id="com.bole.AddButton" defaultMessage="Add" />
        </Button>}
        <Modal
          title="删除专家"
          visible={this.state.visible}
          onOk={this.removeExpertConfirmModal.bind(this, person.id)}
          onCancel={this.handleCancel}
        >
          {currentBaseChildIds && person.dims && person.dims.eb && person.dims.eb.length > 0 &&
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onDelModal}>
            <Row>
              {person.dims.eb.sort((a, b) => {
                return a.localeCompare(b);
              }).map((item) => {
                if (!currentBaseChildIds.get(item)) {
                  return;
                }
                return (
                  <Col key={item}>
                    <Checkbox key={item} value={item}>
                      {currentBaseChildIds.get(item)}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
          }
        </Modal>
        <Modal
          title="添加专家"
          visible={this.state.addExpertVisible}
          onOk={this.addExpertFunc.bind(this, person.id)}
          onCancel={this.handleCancel}
        >
          {currentBaseChildIds &&
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onAddModal}>
            <Row>
              {Object.entries(currentBaseChildIds.toJSON()).sort(this.sortByString).map((item) => {
                return (
                  <Col key={item[0]}>
                    <Checkbox value={item[0]}>{item[1]}</Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
          }
        </Modal>
      </div>
    );
  }
}