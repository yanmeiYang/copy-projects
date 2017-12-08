import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Checkbox, Button } from 'antd';
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

  onExpandedTermChange = (index) => {
    this.setState({
      currentExpansionChecked: index + 1,
      currentTranslationChecked: this.state.currentTranslationChecked === 0 ? 0 : index + 1,
      defaultExpansionChecked: null,
    });
    this.callSearch();
  };

  onTranslationChange = (index) => {
    this.setState({
      currentTranslationChecked: this.state.currentTranslationChecked === index + 1 ? 0 : index + 1,
      currentExpansionChecked: index + 1,
    });
    this.callSearch();
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
    const { kgHypernym, kgHyponym } = assistantData;

    const hasExpansion = expandedTexts && expandedTexts.length > 0;
    const hasTranslation = expandedTexts_zh && expandedTexts_zh.length > 0;
    const hasKG = kgHypernym && kgHypernym.length > 0 && kgHyponym && kgHyponym.length > 0;

    const { checkAll, indeterminate, knowledgeGraphId } = this.state;

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
            <span className={styles.paddingRight}>Expand by knowledge graph</span>
            <span>
              <Checkbox
                onChange={this.onCheckAllChange}
                indeterminate={indeterminate}
                checked={checkAll} />
            </span>
          </div>
          <Checkbox.Group onChange={this.onKGChange} value={this.state.checkedList}>
            {kgHypernym && kgHypernym.map((opt, index) => {
              const key = `${opt.word}_${index}`;
              return (<Checkbox key={key} value={opt.word} checked={checkAll}>
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

        <div className={styles.boxButton}>
          <Button size="small" type="ghost" onClick={this.callSearch}>
            Search with Knowledge Graph
          </Button>
        </div>

      </div>
    );
  }
}
