import React from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import Autosuggest from 'react-autosuggest';
import { defineMessages, injectIntl } from 'react-intl';
import classnames from 'classnames';
import styles from './KgSearchBox.less';
import * as kgService from '../../services/knoledge-graph-service';
import * as suggestService from '../../services/search-suggest';
import { sysconfig } from '../../systems';

const messages = defineMessages({
  placeholder: {
    id: 'com.KgSearchBox.placeholder',
    defaultMessage: 'Input expert name or query',
  },
  searchBtn: {
    id: 'com.KgSearchBox.searchBtn',
    defaultMessage: 'Search',
  },
});

// TODO 这个文件调用了Service，应该移动到routes里面

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue,
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => {
  const value = sysconfig.Locale === 'zh' ? suggestion.zh : suggestion.name;
  return value.replace('/', ', ');
};

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => {
  const cn = sysconfig.Locale === 'zh';
  return (
    <div>
      {suggestion.type === 'parent' && <span className="label">上位词: </span>}
      {suggestion.type === 'sibling' && <span className="label">推荐词: </span>}
      {suggestion.type === 'child' && <span className="label">下位词: </span>}
      {cn ? suggestion.zh : suggestion.name}
    </div>
  );
};

const renderSectionTitle = (section) => {
  return (
    <div className="title">{section.title}</div>
  );
};

const getSectionSuggestions = (section) => {
  return section.suggestions;
};

@connect()
@injectIntl
export default class KgSearchBox extends React.PureComponent {
  constructor() {
    super();

    // Auto suggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '', // current query
      suggestions: [],
      isLoading: false,
    };

    this.lastRequestId = null;
  }

  componentWillMount = () => {
    this.setState({ value: this.props.query || '' });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.query !== this.state.value) {
      this.setState({ value: nextProps.query || '' });
    }
  };


  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value, reason }) => {
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    this.setState({ isLoading: true });

    // 延时200毫秒再去请求服务器。
    this.lastRequestId = setTimeout(() => {
      const t = new Date().getTime();
      this.latestT = t;

      // TODO first call suggest search function.
      const suggestPromise = suggestService.suggest(value);
      suggestPromise.then(
        (data) => {
          if (t < this.latestT) {
            return false; // out of date, canceled;
          }
          // console.log('suggest find data: ', data);
          if (data.data && data.data.topic && data.data.topic.length > 0) {
            this.makeSuggestion(data.data.topic);
          }
        },
        (err) => {
          console.log('failed', err);
        },
      ).catch((error) => {
        console.error(error);
      });
    }, 200);
  };


  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    // console.log('onSuggestionsClearRequested');
    this.setState({ suggestions: [] });
  };

  // deprecated
  makeSuggestion = (topics, selectedTopic) => {
    // console.log('suggest find data: ', topics);
    if (!topics && topics.length <= 0) {
      return false;
    }

    const querySuggests = [];
    topics.map((topic) => {
      return querySuggests.push({
        name: topic.text,
        zh: topic.text,
        type: 'suggest',
      });
    });

    const topicGraph = topics[0];
    if (topicGraph && topicGraph.graph && topicGraph.graph.hits) {
      //   const parents = [];
      //   topicGraph.graph.hits.map((hit) => {
      //     parents.push(hit.parent);
      //     if (hit.child_nodes && hit.child_nodes) {
      //       childs.push(...hit.child_nodes);
      //     }
      //     return false;
      //   });
      //
      //   console.log(parents, childs);
      // TODO generate kg suggestions json.
      const suggestion = this.kgDataTransferToSuggest(topicGraph.graph);

      // Finally generate suggest json.
      const suggestions = [
        {
          title: 'Related Topics:',
          suggestions: querySuggests,
        },
        {
          title: 'Knowledge Graph Suggestions:',
          suggestions: suggestion,
        },
      ];
      this.setState({
        isLoading: false,
        suggestions,
      });
    }
  };

  // TODO sort parents and childs.
  kgDataTransferToSuggest = (kgData) => {
    const kgindex = kgService.indexingKGData(kgData);
    const kgFetcher = kgService.kgFetcher(kgData, kgindex);
    // console.log('kg', kgindex, kgFetcher);

    const suggestion = [];
    if (kgData) {
      // console.log(kgData);
      if (kgData.hits) {
        const childs = [];
        let maxParent = 3;
        kgData.hits.map((hit) => {
          if (maxParent > 0) {
            this.pushToSuggestion(suggestion, kgFetcher.getNode(hit.parent), 'parent');
            maxParent -= 1;
          }
          if (hit.child_nodes && hit.child_nodes) {
            childs.push(...hit.child_nodes);
          }
          return null;
        });

        childs.slice(0, 5).map((childId) => {
          return this.pushToSuggestion(suggestion, kgFetcher.getNode(childId), 'child');
        });
      }
    }
    return suggestion;
  };

  kgDataTransferToSuggest2 = (kgData) => {
    const suggestion = [];
    if (kgData) {
      // console.log(kgData);
      if (kgData.name !== '_root') {
        this.pushToSuggestion(suggestion, kgData);
      }
      if (kgData.children && kgData.children.length > 0) {
        kgData.children.map((node) => {
          return this.pushToSuggestion(suggestion, node);
        });
        // level 3
        kgData.children.map((node) => {
          if (node.children && node.children.length > 0) {
            node.children.map((node3) => {
              return this.pushToSuggestion(suggestion, node3);
            });
          }
          return null;
        });
      }
    }
    return suggestion;
  };

  pushToSuggestion = (suggestion, node, type) => {
    if (!node) {
      return null;
    }
    suggestion.push({
      name: node.name,
      zh: node.name_zh,
      type,
    });
  };

  // handleSearch = () => {
  //   // 这个不好
  //   const kgs = document.getElementsByClassName('kgsuggest');
  //   const data = {};
  //   if (kgs && kgs.length > 0) {
  //     data.query = kgs[0].firstChild.firstChild.value;
  //   }
  //   // const data = {
  //   //   query: ReactDOM.findDOMNode('.findDOMNode').value,
  //   // };
  //   if (this.props.select) {
  //     data.field = this.state.selectValue;
  //   }
  //   if (this.props.onSearch) this.props.onSearch(data);
  // };
  // onSuggestionSelected=(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method })=>{
  //   console.log(method);
  //   if (method==='enter'){
  //     this.props.onSearch({query:suggestionValue});
  //   }
  // };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.onSearch) {
      this.props.onSearch({ query: this.state.value });
    }
  };

  render() {
    const { value, suggestions } = this.state;
    const { intl } = this.props;
    const { size, className, style, btnText, searchBtnStyle } = this.props;

    // Auto suggest will pass through all these props to the input.
    const inputProps = {
      placeholder: intl.formatMessage(messages.placeholder),
      value, // : query || '',
      onChange: this.onChange,
    };

    // Finally, render it!
    return (
      <form className={classnames(styles.kgSearchBox, className)} onSubmit={this.handleSubmit}>
        <Input.Group
          compact size={size} style={style}
          className={classnames(styles.search, 'kgsuggest')}
        >
          <Autosuggest
            id="kgsuggest"
            suggestions={suggestions}
            multiSection
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSectionTitle={renderSectionTitle}
            getSectionSuggestions={getSectionSuggestions}
            inputProps={inputProps}
            size={size}
          />

          <Button
            className={styles.searchBtn}
            style={searchBtnStyle}
            size={size}
            type="primary"
            onClick={this.handleSubmit}
          >{btnText || intl.formatMessage(messages.searchBtn)}</Button>

        </Input.Group>
      </form>
    );
  }
}

