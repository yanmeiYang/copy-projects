/* eslint-disable no-param-reassign,camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Checkbox, Button, Tooltip } from 'antd';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import styles from './SearchAssistant.less';
import { compare } from "utils";

@connect(({ search, loading }) => ({
  query: search.query,
  assistantData: search.assistantData,
  assistantDataMeta: search.assistantDataMeta,
  loading,
}))
export default class SearchAssistant extends Component {
  static propTypes = {
    // disableSmartSuggest: PropTypes.bool,
  };

  static defaultProps = {};

  state = {
    currentExpansionChecked: 1,
    currentTranslationChecked: 0,
    keywordTranslationChecked: 0, // 不是扩展的选择，而是单词翻译的状态.

    indeterminate: false,
    checkAll: false,
    checkedList: [],

    // status control
    // kgLoading: false,
  };

  componentWillMount() {
    // TODO restore selected?
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({ currentExpansionChecked: 1, currentTranslationChecked: 0 });
    }
    if (nextProps.assistantData !== this.props.assistantData) {
      this.setState({ kgLoading: false });
      //   console.log('=============== set kgLoading to false', nextProps.assistantData, this.props.assistantData);
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  // if (nextProps.currentExpansionChecked !== this.state.currentExpansionChecked) {
  //
  // }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentExpansionChecked !== this.state.currentExpansionChecked ||
      prevState.currentTranslationChecked !== this.state.currentTranslationChecked ||
      prevState.keywordTranslationChecked !== this.state.keywordTranslationChecked) {
      this.callSearch();
    }
  }

  componentWillUnmount() {
    // TODO clear meta; // TODO should be in other place.
    this.props.dispatch({ type: 'search/clearAssistantDataMeta' });
  }

  onExpandedTermChange = (index) => {
    this.setState({
      currentExpansionChecked: index + 1,
      currentTranslationChecked: this.state.currentTranslationChecked === 0 ? 0 : index + 1,
      kgLoading: true,
    });
    // console.log('=============== set kgLoading to true',);
  };

  onTermTranslationChange = (e) => {
    this.setState({
      keywordTranslationChecked: e.target.checked ? 1 : 0,
    });
    console.log('=============== set kgLoading to true', e.target.checked);
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

    // construct 'texts' used in call api.
    // const changeType = 'nothing'; // [nothing|expansion|kg]
    const texts = [];
    if (assistantData) {
      const {
        currentExpansionChecked,
        currentTranslationChecked,
        keywordTranslationChecked,
        checkedList,
      } = this.state;
      const { expands, kgHypernym, kgHyponym, transText, transLang } = assistantData;

      // 添加扩展词
      if (currentExpansionChecked > 0 && expands && expands.length >= currentExpansionChecked) {
        const exp = expands[currentExpansionChecked - 1];
        if (exp) {
          texts.push({ text: exp.word, source: 'expands' });
        }
      }
      // 添加扩展词翻译
      if (currentTranslationChecked > 0 && expands && expands.length >= currentTranslationChecked) {
        const exp = expands[currentTranslationChecked - 1];
        if (exp) {
          texts.push({ text: exp.word_zh, source: 'translated' });
        }
      }
      // 添加搜索词翻译
      if (keywordTranslationChecked > 0 && transText) {
        texts.push({ text: transText, source: 'translated' });
      }
      // 添加KG
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
    }

    // call parent on change event.
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
    const { currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked } = this.state;
    const assistantLoading = this.props.loading.effects['search/searchPerson']; // when is new api.

    const { assistantData, assistantDataMeta } = this.props;
    if (!assistantData) {
      return false;
    }
    // const { expandedTexts, expandedTexts_zh, expands } = assistantData;
    const { expands, transText, transLang } = assistantData;

    console.log('9999999:::: ------------------------------------------- ',);
    console.log('9999999::::  ', currentExpansionChecked, currentTranslationChecked, keywordTranslationChecked);
    console.log('9999999:::: assistantData ', assistantData);
    console.log('9999999:::: assistantDataMeta ', assistantDataMeta);


    // if has value.
    const hasExpansion = expands && expands.length > 0;
    const hasTranslation = expands && expands.filter(item => item.word_zh).length > 0;
    const hasTermTranslation = Boolean(transText);
    const { hasKG, kgData } = this.combineKG();

    const { checkAll, indeterminate, kgLoading } = this.state;

    if (!hasExpansion && !hasTranslation && !hasKG) {
      return false;
    }

    return (
      <div className={styles.searchAssistant}>

        {/*<Spinner loading={assistantLoading} type="dark" />*/}

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
                        checked={currentExpansionChecked === index + 1}
                        onChange={this.onExpandedTermChange.bind(this, index)}
                      >{item.word}
                      </Checkbox>
                    </span>
                  </div>
                  {hasTranslation && item.word_zh &&
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

        {!expands && hasTermTranslation &&
        <div className={styles.box}>
          <div className={styles.w}>
            {hasTermTranslation && <div className={styles.w}>We also search for</div>}
          </div>
          <div className={styles.leftBox}>
            <div>
              <div>
                <span className={styles.rightbox}>
                  <Checkbox
                    checked={keywordTranslationChecked === 1}
                    onChange={this.onTermTranslationChange.bind(this)}
                  >{transText}
                  </Checkbox>
                </span>
              </div>
            </div>
          </div>
        </div>
        }

        {(hasExpansion || hasTermTranslation) && (hasKG || kgLoading) &&
        <div className={styles.spliter} />
        }

        {/*{!kgLoading && <div> not Loading </div>}*/}
        {(hasKG || kgLoading) &&
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

          {kgLoading && <div style={{ marginLeft: 8 }}> Loading... </div>}
          {hasKG && !kgLoading &&
          <Checkbox.Group onChange={this.onKGChange} value={this.state.checkedList}>
            {kgData && kgData.map((term, index) => {
              const key = `${term.word}_${index}`;
              const checkbox = (
                <Checkbox key={key} value={term.word} checked={checkAll}>
                  <span className={styles[term.type]}>{term.word}</span>
                </Checkbox>
              );
              return (term.word_zh && sysconfig.Locale === 'zh')
                ? (
                  <Tooltip placement="top" title={term.word_zh} key={key}>
                    {checkbox}
                  </Tooltip>)
                : checkbox;
            })}
          </Checkbox.Group>
          }
        </div>
        }

        {hasKG && !kgLoading &&
        <div className={styles.boxButton}>
          <Button size="small" ghost onClick={this.callSearch}>
            Search with Knowledge Graph
          </Button>
        </div>
        }

      </div>
    );
  }
}

export const AssistantUtils = {
  smartClear: ({ prevTexts, texts, dispatch, assistantData }) => {
    if (!assistantData) {
      console.error('Error! assistantData Can not be null.');
      return;
    }
    if (!prevTexts) {
      // can't be null.
    }
    if (!texts || texts.length <= 0) {
      // TODO no results?
    }
    const expandWordItem = texts && texts.find(term => term.source === 'expands');
    const expandWord = expandWordItem && expandWordItem.text;
    if (expandWord) {
      let prevExpandWord;
      const prevExpandWordItem = prevTexts && prevTexts.find(term => term.source === 'expands');
      if (!prevExpandWordItem) {
        prevExpandWord = assistantData.expands && assistantData.expands.length > 0
          && assistantData.expands[0].word;
      } else {
        prevExpandWord = prevExpandWordItem && prevExpandWordItem.text;
      }
      console.log('====== ExpandWord is ', expandWord, prevExpandWord);
      if (expandWord !== prevExpandWord) {
        // here we clear kg data.
        if (dispatch) {
          // TODO don;t call this. just hide.
          dispatch({ type: 'search/clearSearchAssistantKG' });
        }
      }
    }
  },
};
