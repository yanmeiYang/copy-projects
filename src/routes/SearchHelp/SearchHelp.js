import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { Checkbox, Row, Col } from 'antd';
import { Button } from 'antd';
import styles from './SearchHelp.less';

const CheckboxGroup = Checkbox.Group;

export default class SearchHelp extends Component {
  state = {
    defaultExpansionChecked: 1,
    currentExpansionChecked: 0,
    currentTranslationChecked: 0,
    //
    indeterminate: true,
    checkAll: false,
    checkedList: [],

    // to delete
    knowledgeGraphId: 0,
    KG: [],
  };

  onExpandedTermChange = (index) => {
    this.setState({
      currentExpansionChecked: index + 1,
      currentTranslationChecked: this.state.currentTranslationChecked === 0 ? 0 : index + 1,
      defaultExpansionChecked: null,
    });
    const { intelligenceSuggests } = this.props;
    if (this.props.onIntelligenceSearchMetaChange) {
      this.props.onIntelligenceSearchMetaChange({
        // expansion: intelligenceSuggests.expandedTexts[index],
        // translated: this.state.currentTranslationChecked === 0 ? '' : intelligenceSuggests.expandedTexts_zh[index],
      });
    }
  };

  onTranslationChange = (index) => {
    this.setState({
      currentTranslationChecked: this.state.currentTranslationChecked === index + 1 ? 0 : index + 1,
      currentExpansionChecked: index + 1,
    });
    const { intelligenceSuggests } = this.props.intelligenceSuggests;
    if (this.props.onIntelligenceSearchMetaChange) {
      this.props.onIntelligenceSearchMetaChange({
        // expansion: this.state.currentExpansionChecked === 0 ? '' : intelligenceSuggests.expandedTexts[index],
        // translated: intelligenceSuggests.expandedTexts_zh[index],
      });
    }
  };

  onKGChange = (checkedList) => {
    const { intelligenceSuggests } = this.props;
    const len = intelligenceSuggests.kgHyponym && intelligenceSuggests.kgHyponym.length;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < len),
      checkAll: checkedList.length === len,
    });
  };

  onCheckAllChange = (e) => {
    const kgHyponymArray = [];
    const { intelligenceSuggests } = this.props;
    kgHyponymArray.push(intelligenceSuggests.kgHyponym.map((item) => {
      return item.word;
    }));
    this.setState({
      checkedList: e.target.checked ? kgHyponymArray[0] : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
    if (this.props.onIntelligenceSearchMetaChange) {
      this.props.onIntelligenceSearchMetaChange({
        expansion: this.state.currentExpansionChecked === 0 ? '' : intelligenceSuggests.expandedTexts[index],
        translated: this.state.currentTranslationChecked === 0 ? '' : intelligenceSuggests.expandedTexts_zh[index],
        KG: kgHyponymArray,
      });
    }
  };
  //
  // onToggleClick = (e) => {
  // };

  setDefaultOptions = () => {
    // TODO
  };

  render() {
    const {
      currentExpansionChecked, currentTranslationChecked,
      defaultExpansionChecked, checkedList,
    } = this.state;

    const { intelligenceSuggests } = this.props;
    if (!intelligenceSuggests) {
      return false;
    }
    const { expandedTexts, expandedTexts_zh, expands } = intelligenceSuggests;
    const hasExpansion = expandedTexts && expandedTexts.length > 0;
    const hasTranslation = expandedTexts_zh && expandedTexts_zh.length > 0;

    const { kgHypernym, kgHyponym } = intelligenceSuggests;
    const hasKG = kgHypernym && kgHypernym.length && kgHyponym && kgHyponym.length > 0;

    // -----------------------------
    const { knowledgeGraphId } = this.state;
    const { indeterminate } = this.state;
    const { checkAll } = this.state;

    // const hasKG = this.state.KG && this.state.KG.length > 0;

    return (
      <div className={styles.searchHelp}>
        <div className={styles.box}>
          <div className={styles.w}>
            {hasExpansion &&
            <div className={styles.w}>We automatically expanded it to</div>
            }
            {hasTranslation &&
            <div className={styles.w}>We also search for</div>
            }
          </div>

          <div className={styles.leftBox}>
            {hasExpansion && expands.map((item, index) => {
              const key = `${item}_${index}`;
              return <div key={key}>
                <div>
                  <span className={styles.rightbox}>
                    <Checkbox
                      checked={defaultExpansionChecked === index + 1 ||
                      currentExpansionChecked === index + 1}
                      onChange={this.onExpandedTermChange.bind(this, index)}
                    >{item.word}
                    </Checkbox>
                  </span>
                </div>
                {hasTranslation &&
                <div><span className={styles.rightbox}>
                  <Checkbox
                    checked={currentTranslationChecked === index + 1 ? index + 1 : 0}
                    onChange={this.onTranslationChange.bind(this, index)}
                  >{item.word_zh}
                  </Checkbox>
                </span>
                </div>
                }
              </div>
            })}
          </div>
          {hasExpansion &&
          <div onClick={this.onToggleClick} className={styles.paddingLeftButton}>
            <Button type="primary" size="small">More
            </Button>
          </div>
          }
        </div>

        <div className={styles.box1}>
          <div className={styles.ww}>
            <span>Expand by knowledge graph</span>
            <span className={styles.paddingLeft}>
              <Checkbox
                onChange={this.onCheckAllChange}
                indeterminate={indeterminate}
                checked={checkAll} />
            </span>
          </div>
          <Checkbox.Group onChange={this.onKGChange} value={this.state.checkedList}>
          {kgHypernym && kgHypernym.map((opt, index) => {
            const key = `${opt.word}_${index}`;
            return (<Checkbox key={key} value={this.state.checkedList}
                              checked={checkAll} onChange={this.onKGChange}>
              <span className={styles.suporordinateWord}>{opt.word}</span>
            </Checkbox>);
          })}
          {kgHyponym && kgHyponym.map((opt, index) => {
            const key = `${opt.word}_${index}`;
            return (<Checkbox key={key} value={opt.word} checked={checkAll}>
              <span className={styles.subordinateWord}>{opt.word}</span>
            </Checkbox>);
          })}
          </Checkbox.Group>
        </div>
      </div>
    );
  }
}
SearchHelp.propTypes = {
  // labels: PropTypes.object.isRequired,
  disableSmartSuggest: PropTypes.bool,
};
