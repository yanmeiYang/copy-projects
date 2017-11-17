import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { Checkbox, Row, Col } from 'antd';
import styles from './SearchHelp.less';

const CheckboxGroup = Checkbox.Group;

export default class SearchHelp extends Component {
  state = {
    defaultExpansionChecked: 1,
    currentExpansionChecked: 0,
    currentTranslationChecked: 0,

    /// unused
    labels: [
      {
        id: 1,
        expansion: 'Artificial Intelligence',
        translated: '人工智能',
        superordinateWord: [{ label: 'S1' }, { label: 'S2' }],
        subordinateWord: [{ label: 'D1' }, { label: 'd2' }, { label: 'd2' }],
      },
      {
        id: 2,
        expansion: 'check2',
        translated: '柴可2',
        superordinateWord: [{ label: 'Sff1' }, { label: 'Sff2' }],
        subordinateWord: [{ label: 'D31' }, { label: 'd34' }, { label: 'd32' }],
      },
      {
        id: 3,
        expansion: 'check3',
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
      defaultExpansionChecked: 0,
    });
  };

  onTranslationChange = (id) => {
    this.setState({
      currentTranslationChecked: this.state.currentTranslationChecked === id ? 0 : id,
      currentExpansionChecked: id,
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
    const { labels, currentExpansionChecked, currentTranslationChecked, defaultExpansionChecked } = this.state;

    if (!labels || labels.length <= 0) {
      return false;
    }

    // super&sub
    const curr = labels.filter(item => item.id === (defaultExpansionChecked || currentExpansionChecked));
    const superOW = curr && curr.length > 0 && curr[0];
    const { superordinateWord, subordinateWord } = superOW;

    const hasExpansion = labels.find(label => label.expansion) !== undefined;

    // -----------------------------
    const { knowledgeGraphId } = this.state;
    const { indeterminate } = this.state;
    const { checkAll } = this.state;

    return (
      <div className={styles.searchHelp}>
        <div className={styles.leftBox}>
          <div className={styles.width}>
            {hasExpansion &&
            <div className={styles.leftText}>We automatically expanded it to</div>
            }
            <div className={styles.leftText}>We also search for</div>
          </div>

          <div className={styles.leftBox}>
            {hasExpansion && labels.map(item => (
              <div key={item.id} className={styles.rightBox}>
                <div>
                  <span className={styles.rightbox}>
                    <Checkbox
                      checked={item.id === defaultExpansionChecked || currentExpansionChecked === item.id}
                      onChange={this.onExpandedTermChange.bind(this, item.id)}
                    >{item.expansion}
                    </Checkbox>
                  </span>
                </div>

                <div><span className={styles.rightbox}>
                  <Checkbox
                    checked={currentTranslationChecked === item.id}
                    onChange={this.onTranslationChange.bind(this, item.id)}
                  >{item.translated}
                  </Checkbox>
                 </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className={styles.width}>Expand by knowledge graph</span>
          <Checkbox
            onChange={this.onCheckAllChange}
            indeterminate={indeterminate}
            checked={checkAll} />
          <Checkbox.Group onChange={this.onKGChange}>
            {superordinateWord && superordinateWord.map((opt, index) => {
              const key = `${opt.label}_${index}`;
              return <Checkbox key={key} value={opt.label}><span className={styles.suporordinateWord}>{opt.label}</span></Checkbox>;
            })}
            {subordinateWord && subordinateWord.map((opt, index) => {
              const key = `${opt.label}_${index}`;
              return <Checkbox key={key} value={opt.label}><span
                className={styles.subordinateWord}>{opt.label}
                </span>
              </Checkbox>;
            })}
          </Checkbox.Group>
        </div>
      </div>
    );
  }


};
