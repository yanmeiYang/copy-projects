/**
 * Created by yangyanmei on 17/10/17.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox } from 'antd';
import { routerRedux, Link, withRouter } from 'dva/router';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { hole, createURL } from 'utils';
import { Auth } from 'hoc';
import { query } from 'services/user';
import { PersonList } from 'components/person';
import styles from './ProfileMerge.less';

@connect(({ merge }) => ({ merge }))
export default class ProfileMerge extends Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.merge.checkedPerson);
    console.log('', this.props.merge.checkedPerson);
    if (nextProps.merge.checkedPerson !== this.props.merge.checkedPerson) {
      console.log('COMPARE:', nextProps.merge.checkedPerson, this.props.merge.checkedPerson);
    }
  }

  changePeron = (person, e) => {
    console.log(`checked = ${e.target.checked}`);
    this.props.dispatch({
      type: 'merge/updateCheckedPerson',
      payload: { data: person, checkStatus: e.target.checked },
    });
  };

  render() {
    const { results, expertBaseId, user } = this.props;
    const mergeCheckbox = [
      param => (
        <Checkbox
          key="100"
          onChange={this.changePeron.bind(this, param.person)}>
          Merge
        </Checkbox>
      ),
    ];
    return (
      <div>
        <PersonList
          className={styles.personList}
          persons={results}
          user={user}
          expertBaseId={expertBaseId}
          rightZoneFuncs={mergeCheckbox}
        />

      </div>
    );
  }
}

