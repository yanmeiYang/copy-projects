import React, { Component } from 'react';
import { connect } from 'engine';
import { Modal, Button, Popconfirm } from 'antd';
import { compareDeep } from 'utils/compare';
import { PersonList } from 'components/person/index';
import ChangePerson from './ChangePerson';
import styles from './index.less';

@connect(({ conflicts }) => ({ conflicts }))
export default class NewPersonList extends Component {
  state = {
    // personInfo: null,
    selectPersonIndex: null,
    deletePersonIndex: null,
    name: null,
    org: null,
  };
  personInfo = null;
  personList = null;

  componentWillMount() {
    const { cId, conflicts } = this.props;
    if (cId === 'left') {
      this.personInfo = conflicts.get('personInfoLeft');
      this.personList = conflicts.get('personListLeft');
    } else {
      this.personInfo = conflicts.get('personInfoRight');
      this.personList = conflicts.get('personListRight');
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (compareDeep(nextProps, this.props, 'conflicts') ||
      (nextState.selectPersonIndex !== this.state.selectPersonIndex)) {
      const { cId, conflicts } = nextProps;
      if (cId === 'left') {
        this.personInfo = conflicts.get('personInfoLeft');
        this.personList = conflicts.get('personListLeft');
      } else {
        this.personInfo = conflicts.get('personInfoRight');
        this.personList = conflicts.get('personListRight');
      }
    }
  }

  replacePerson = (index, name, org) => {
    this.setState({ selectPersonIndex: index, name, org });
  };
  deletePerson = (index) => {
    const { cId } = this.props;
    this.props.dispatch({
      type: 'conflicts/deletePerson',
      payload: { index, cId },
    });
    this.setState({ deletePersonIndex: index });
  };
  // 关闭modal方法，callback
  closeModal = () => {
    this.setState({ selectPersonIndex: null });
  };

  render() {
    const { selectPersonIndex, name, org } = this.state;
    const { showTitle } = this.props;
    return (
      <div className={styles.newPersonList}>
        {this.personInfo && this.personInfo.map((person, index) => {
          const name = this.personList[index] ? this.personList[index].name : '';
          const org = this.personList[index] ? this.personList[index].org : '';
          return (
            <div key={Math.random()}>
              {showTitle &&
              <div className={styles.replaceBox}>
                <span>
                  <span className={styles.expertIndex}>{index + 1} </span>
                  {name}, {org}
                </span>
                <div>
                  <Popconfirm title="你确定要删除数据么？"
                              onConfirm={this.deletePerson.bind(this, index)}
                              okText="确定" cancelText="取消">
                    <Button type="primary" size="small" ghost style={{ marginRight: 5 }}>
                      删除
                    </Button>
                  </Popconfirm>
                  <Button type="primary" size="small" ghost
                          onClick={this.replacePerson.bind(this, index, name, org)}>
                    替换
                  </Button>
                </div>
              </div>}
              <PersonList
                className={styles.overwriteAffStyle}
                persons={person}
                type="tiny"
                PersonList_PersonLink_NewTab
                rightZoneFuncs={[]}
                showIndices={['h_index', 'citations', 'num_pubs']}
              />
            </div>
          );
        })}
        {(selectPersonIndex !== null) &&
        <ChangePerson
          selectPersonIndex={selectPersonIndex} cId={this.props.cId} name={name} org={org}
          callbackParent={this.closeModal} />}
      </div>
    );
  }
}
