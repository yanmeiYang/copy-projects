/**
 * Created by yangyanmei on 17/10/17.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Button, Pagination, Modal, message, Alert } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { PersonList } from 'components/person';
import { Spinner } from 'components';
import styles from './ProfileMerge.less';

@connect(({ merge }) => ({ merge }))
export default class ProfileMerge extends Component {
  componentWillMount() {
    const { dispatch, currentPersonId } = this.props;
    dispatch({
      type: 'merge/getCurrentPerson',
      payload: { personId: currentPersonId },
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.merge.mergeStatus !== this.props.merge.mergeStatus) {
      if (nextProps.merge.mergeStatus) {
        // message.success('合并成功');
        window.location.reload();
      }
    }
  };

  changePerson = (person, e) => {
    this.props.dispatch({
      type: 'merge/updateCheckedPerson',
      payload: { data: person, checkStatus: e.target.checked },
    });
  };

  merge = () => {
    const { currentPersonId, merge, dispatch } = this.props;
    const { checkedPersonIds } = merge;
    Modal.confirm({
      title: '合并',
      content: `确定合并 ${checkedPersonIds.length} 位专家吗？`,
      onOk() {
        dispatch({
          type: 'merge/tryToDoMerge',
          payload: { id: currentPersonId, checkedPersonIds },
        });
      },
      onCancel() {
      },
    });
  };

  render() {
    const { results, expertBaseId, user, currentPersonId } = this.props;
    const { current, pageSize, total, load } = this.props;
    const { onPageChange } = this.props;
    const { currentPerson, checkedPersonIds } = this.props.merge;
    const mergeCheckbox = [
      param => {
        return (
          <div key={100}>
            {param.person && param.person.locks && param.person.locks.merge ?
              <span className={styles.mergeStatus}>
                <FM id="com.profileMerge.label.pending" defaultMessage="In pending" />
              </span> :
              <Checkbox
                key="100" defaultChecked={checkedPersonIds.includes(param.person.id)}
                onChange={this.changePerson.bind(this, param.person)}>
                <FM id="com.profileMerge.button.merge" defaultMessage="Merge" />
              </Checkbox>
            }
          </div>
        );
      },
    ];

    return (
      <div className={styles.profileMerge}>
        <PersonList
          className={styles.majorExpert}
          persons={currentPerson}
          user={user}
          expertBaseId={expertBaseId}
          rightZoneFuncs={[]}
        />
        <div className={styles.mergeBtnAndNote}>
          <Alert className={styles.note} message="请从以下专家中选择合并对象，合并操作需要后台管理员人员审核，请耐心等待。"
                 type="info" showIcon />
          <Button type="primary" onClick={this.merge} size="large">
            <FM id="com.profileMerge.button.merge" defaultMessage="Merge" />
          </Button>
        </div>
        <Spinner loading={load} />
        <PersonList
          className={styles.personList}
          persons={results.filter(item => item.id !== currentPersonId)}
          user={user}
          expertBaseId={expertBaseId}
          rightZoneFuncs={mergeCheckbox}
        />
        <Pagination
          className={styles.pagination}
          showQuickJumper
          current={current}
          defaultCurrent={1}
          defaultPageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      </div>
    );
  }
}

