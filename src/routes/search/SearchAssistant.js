/* eslint-disable no-param-reassign,camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Checkbox, Button, Tooltip } from 'antd';
import { sysconfig } from 'systems';
import styles from './SearchAssistant.less';

@connect(({ search }) => ({
  assistantData: search.assistantData,
  assistantDataMeta: search.assistantDataMeta,
}))
export default class SearchAssistant extends Component {
  static propTypes = {
    // disableSmartSuggest: PropTypes.bool,
  };

  static defaultProps = {};

  state = {
    defaultExpansionChecked: 1,
    currentExpansionChecked: 0,
    currentTranslationChecked: 0,

    indeterminate: true,
    checkAll: false,
    checkedList: [],
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentExpansionChecked !== this.state.currentExpansionChecked ||
      prevState.currentTranslationChecked !== this.state.currentTranslationChecked
    ) {
      this.callSearch();
    }
  }

  onExpandedTermChange = (index) => {
    this.setState({
      currentExpansionChecked: index + 1,
      currentTranslationChecked: this.state.currentTranslationChecked === 0 ? 0 : index + 1,
      defaultExpansionChecked: null,
    });
    // this.callSearch(); call in did update.
  };

  onTranslationChange = (index) => {
    this.setState({
      currentTranslationChecked: this.state.currentTranslationChecked === index + 1 ? 0 : index + 1,
      currentExpansionChecked: index + 1,
    });
    // this.callSearch(); call in did update.
  };

  onKGChange = (checkedList) => {
    const { assistantData } = this.props;
    const len = assistantData.kgHyponym && assistantData.kgHyponym.length;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < len),
      checkAll: checkedList.length === len,
    });
  };

  onCheckAllChange = (e) => {
    const kgHyponymArray = [];
    const kgHypernymArray = [];
    const { assistantData, onAssistantChanged } = this.props;
    const kgHyponym = assistantData && assistantData.kgHyponym;
    const kgHypernym = assistantData && assistantData.kgHypernym;
    kgHyponymArray.push(kgHyponym.map((item) => {
      return item.word;
    }));
    kgHypernymArray.push(kgHypernym.map((item) => {
      return item.word;
    }));
    const checkedList = kgHyponymArray[0].concat(kgHypernymArray[0]);
    this.setState({
      checkedList: e.target.checked ? checkedList : [],
      // checkedList: e.target.checked ? kgHypernymArray[0] : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  // intelligenceSuggests
  callSearch = () => {
    const { assistantData, onAssistantChanged } = this.props;
    const texts = [];
    const { currentExpansionChecked, currentTranslationChecked, checkedList } = this.state;
    const { expands, kgHypernym, kgHyponym } = assistantData;

    if (currentExpansionChecked > 0 && expands && expands.length >= currentExpansionChecked) {
      const exp = expands[currentExpansionChecked - 1];
      if (exp) {
        texts.push({ text: exp.word, source: 'expands', });
      }
    }
    if (currentTranslationChecked > 0 && expands && expands.length >= currentTranslationChecked) {
      const exp = expands[currentTranslationChecked - 1];
      if (exp) {
        texts.push({ text: exp.word_zh, source: 'translated' });
      }
    }
    if (checkedList && checkedList.length > 0) {
      for (const kg of checkedList) {
        if (kgHypernym) {
          const found = kgHypernym.find(word => word.word === kg);
          if (found) {
            texts.push({ text: found.word, source: 'kgHypernym', id: '0' });
          }
        }
        if (kgHyponym) {
          const found = kgHyponym.find(word => word.word === kg);
          if (found) {
            texts.push({ text: found.word, source: 'kgHyponym', id: '0' });
          }
        }
      }
    }
    if (onAssistantChanged) {
      onAssistantChanged(texts);
    }
  };

  combineKG = () => {
    const { kgHypernym, kgHyponym } = this.props.assistantData;
    // merge kg into one.
    const kgData = [];
    if (kgHypernym && kgHypernym.length > 0) {
      for (const term of kgHypernym) {
        if (term) {
          term.type = 'hypernym';
        }
        kgData.push(term);
      }
    }
    if (kgHyponym && kgHyponym.length > 0) {
      for (const term of kgHyponym) {
        if (term) {
          term.type = 'hyponym';
        }
        kgData.push(term);
      }
    }
    const hasKG = kgData && kgData.length > 0;
    return { kgData, hasKG };
  };

  render() {
    const {
      currentExpansionChecked, currentTranslationChecked,
      defaultExpansionChecked, checkedList,
    } = this.state;

    const { assistantData } = this.props;
    if (!assistantData) {
      return false;
    }
    const { expandedTexts, expandedTexts_zh, expands } = assistantData;

    // if has value.
    const hasExpansion = expandedTexts && expandedTexts.length > 0;
    const hasTranslation = expandedTexts_zh && expandedTexts_zh.length > 0;
    const { hasKG, kgData } = this.combineKG();

    const { checkAll, indeterminate } = this.state;

    return (
      <div className={styles.searchAssistant}>
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
              return (
                <div key={key}>
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
                  <div>
                    <span className={styles.rightbox}>
                      <Checkbox
                        checked={currentTranslationChecked === index + 1 ? index + 1 : 0}
                        onChange={this.onTranslationChange.bind(this, index)}
                      >{item.word_zh}
                      </Checkbox>
                    </span>
                  </div>
                  }
                </div>
              );
            })}
          </div>

          {hasExpansion && false && // TODO temp disable more button.
          <div onClick={this.onToggleClick} className={styles.paddingLeftButton}>
            <Button type="primary" size="small">More</Button>
          </div>
          }

        </div>

        {hasKG &&
        <div className={styles.box1}>
          <div className={styles.ww}>
            <span className={styles.paddingRight}>Expand by knowledge graph</span>
            <span>
              <Checkbox
                onChange={this.onCheckAllChange}
                indeterminate={indeterminate}
                checked={checkAll} />
            </span>
          </div>
          <Checkbox.Group onChange={this.onKGChange} value={this.state.checkedList}>
            {kgData && kgData.map((term, index) => {
              const key = `${term.word}_${index}`;
              const checkbox = (
                <Checkbox key={key} value={term.word} checked={checkAll}>
                  <span className={styles[term.type]}>{term.word}</span>
                </Checkbox>
              );
              return (term.word_zh && sysconfig.Locale === 'zh')
                ? <Tooltip placement="top" title={term.word_zh} key={key}>
                  {checkbox}
                </Tooltip>
                : checkbox;
            })}
          </Checkbox.Group>
        </div>
        }

        {hasKG &&
        <div className={styles.boxButton}>
          <Button size="small" type="ghost" onClick={this.callSearch}>
            Search with Knowledge Graph
          </Button>
        </div>
        }

      </div>
    );
  }
}
