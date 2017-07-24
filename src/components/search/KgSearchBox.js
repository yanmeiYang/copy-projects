import React from 'react';
import { connect } from 'dva';
import { Input, Button, Icon } from 'antd';
import Autosuggest from 'react-autosuggest';
import styles from './KgSearchBox.less';
import * as kgService from '../../services/knoledge-graph-service';
import * as suggestService from '../../services/search-suggest';
import { classnames } from '../../utils';
import { sysconfig } from '../../systems';

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
  const value = sysconfig.Language === 'cn' ? suggestion.zh : suggestion.name;
  return value.replace('/', ', ');
}

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => {
  const cn = sysconfig.Language === 'cn';
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

class KgSearchBox extends React.PureComponent {
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
  }

  onChange = (event, { newValue, method }) => {
    // console.log('onChange', event, newValue, method);
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
      // TODO first call suggest search function.
      const suggestPromise = suggestService.suggest(value);
      suggestPromise.then(
        (data) => {
          console.log('suggest find data: ',data);
          if (data.data && data.data.topic && data.data.topic.length > 0) {
            const topics = data.data.topic;
            const stringTopics = [];
            topics.map((topic) => {
              return stringTopics.push(topic.text);
            });
            this.makeSuggestion(stringTopics);
          }
        },
        (err) => {
          console.log('failed', err);
        },
      ).catch((error) => {
        console.error(error);
      });

    }, 120);
  };


  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    // console.log('onSuggestionsClearRequested');
    this.setState({ suggestions: [] });
  };

  makeSuggestion = (stringTopics, selectedTopic) => {
    const querySuggests = [];
    stringTopics.map((topic) => {
      return querySuggests.push({
        name: topic,
        zh: topic,
        type: 'suggest',
      });
    });

    // call KG search with first suggested topic.
    const kgtopic = selectedTopic || stringTopics[0];
    if (kgtopic) {
      console.log('search kgsuggest with ', kgtopic);
      kgService.getKGSuggest(kgtopic, (result) => {
        // TODO transfer result json.
        const suggestion = this.kgDataTransferToSuggest(result);

        // TODO combine suggestions.
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

        // console.log('suggest matches : ', result, JSON.stringify(suggestions));
        this.setState({
          isLoading: false,
          suggestions,
        });
      });
    }
  };

  kgDataTransferToSuggest = (kgData) => {
    const suggestion = [];
    if (kgData) {
      console.log(kgData);
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

  pushToSuggestion = (suggestion, node) => {
    if (node.type === 'current') {
      return null;
    }
    suggestion.push({
      name: node.name,
      zh: node.zh,
      type: node.type,
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
    const { size, select, selectOptions, selectProps, style, btnText } = this.props;

    // Auto suggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search',
      value, // : query || '',
      onChange: this.onChange,
    };

    // Finally, render it!
    return (
      <form onSubmit={this.handleSubmit}>
        <Input.Group
          compact
          size={size}
          className={classnames(styles.search, 'kgsuggest')}
          style={style}
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
            size={size}
            type="primary"
            onClick={this.handleSubmit}
          >{btnText || '搜索'}</Button>
        </Input.Group>
      </form>
    );
  }
}

export default KgSearchBox;
