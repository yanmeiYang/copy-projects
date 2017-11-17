import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { Checkbox, Row, Col } from 'antd';
import styles from './SearchHelp.less';

const CheckboxGroup = Checkbox.Group;


export default class SearchHelp extends Component {
  state = {
    currentExpansionChecked: 0,
    currentTranslationChecked: 0,

    /// unused
    labels: [
      {
        id: 1,
        expansion: 'check1',
        translated: '柴可1',
        superordinateWord: [{ label: 'S1' }, { label: 'S2' }],
        subordinateWord: [{ label: 'D1' }, { label: 'd2' }, { label: 'd2' }],
      },
      {
        id: 2,
        // expansion: 'check2',
        translated: '柴可2',
        superordinateWord: [{ label: 'Sff1' }, { label: 'Sff2' }],
        subordinateWord: [{ label: 'D31' }, { label: 'd32' }, { label: 'd32' }],
      },
      {
        id: 3,
        // expansion: 'check3',
        translated: '柴可3',
        superordinateWord: [{ label: 'S1' }, { label: 'S2' }],
        subordinateWord: [{ label: 'D1' }, { label: 'd2' }, { label: 'd2' }, { label: 'Dx1' }, { label: 'dx2' }, { label: 'dx2' }],
      },
    ],
    ///
    indeterminate: true,
    checkAll: false,
    plainOptions: [],
    checkedList: [],

    // to delete
    knowledgeGraphId: 0,
  };

  onExpandedTermChange = (id) => {
    this.setState({
      currentExpansionChecked: id,
      currentTranslationChecked: this.state.currentTranslationChecked === 0 ? 0 : id,
    });
  };

  onTranslationChange = (id) => {
    this.setState({
      currentTranslationChecked: this.state.currentTranslationChecked === id ? 0 : id,
    });
  };

  onKGChange = (checkedList) => {
    console.log('>> ', checkedList);
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  setDefaultOptions = () => {
    // TODO
  };

  render() {
    const { labels, currentExpansionChecked, currentTranslationChecked } = this.state;

    if (!labels || labels.length <= 0) {
      return false;
    }

    // super&sub
    const curr = labels.filter(item => item.id === currentExpansionChecked);
    const superOW = curr && curr.length > 0 && curr[0];
    const { superordinateWord, subordinateWord } = superOW;

    const hasExpansion = labels.find(label => label.expansion) !== undefined;

    // -----------------------------
    const { knowledgeGraphId } = this.state;
    const { indeterminate } = this.state;
    const { checkAll } = this.state;

    return (
      <div className={styles.searchHelp}>
        {hasExpansion &&
        <div>
          <span>We automatically expanded it to:</span>
          {labels.map(item => (
            <Checkbox
              key={item.id} checked={currentExpansionChecked === item.id}
              onChange={this.onExpandedTermChange.bind(this, item.id)}
            >{item.expansion}
            </Checkbox>
          ))}
        </div>
        }

        <div>
          <span>We also search for:</span>
          {this.state.labels.map(item => (
            <Checkbox
              key={item.id} checked={currentTranslationChecked === item.id}
              onChange={this.onTranslationChange.bind(this, item.id)}
            >{item.translated}
            </Checkbox>
          ))}
        </div>

        <div>
          <span>Expand by knowledge graph:</span>
          <Checkbox
            onChange={this.onCheckAllChange}
            indeterminate={indeterminate}
            checked={checkAll} />
          <Checkbox.Group onChange={this.onKGChange}>
            {superordinateWord && superordinateWord.map((opt, index) => {
              const key = `${opt.label}_${index}`;
              return <Checkbox key={key} value={opt.label}
                               style={{ border: "solid 1px red" }}>{opt.label}</Checkbox>;
            })}
            {subordinateWord && subordinateWord.map((opt, index) => {
              const key = `${opt.label}_${index}`;
              return <Checkbox key={key} value={opt.label}>{opt.label}</Checkbox>;
            })}
          </Checkbox.Group>
        </div>
      </div>
    );
  }


};
