/**
 * Created by yangyanmei on 17/10/17.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Button, Pagination, Modal, message } from 'antd';
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
      <div>
        <div className={styles.mergeBtn}>
          <Button type="primary" onClick={this.merge}>
            <FM id="com.profileMerge.button.merge" defaultMessage="Merge" />
          </Button>
        </div>
        <PersonList
          className={styles.personList}
          persons={currentPerson}
          user={user}
          expertBaseId={expertBaseId}
          rightZoneFuncs={[]}
        />
        <Spinner loading={load} />
        <PersonList
          className={styles.personList}
          persons={results.filter(item => item.id !== currentPersonId)}
          user={user}
          expertBaseId={expertBaseId}
          rightZoneFuncs={mergeCheckbox}
        />
        <Pagination
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

