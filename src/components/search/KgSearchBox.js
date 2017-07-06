import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, Icon } from 'antd';
import Autosuggest from 'react-autosuggest';
import styles from './KgSearchBox.less';
import * as kgService from '../../services/knoledge-graph-service';
import { classnames } from '../../utils';
import { sysconfig } from '../../systems';

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
      { cn ? suggestion.zh : suggestion.name}
    </div>
  );
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
      value: '',
      suggestions: [],
      isLoading: false,
    };

    this.lastRequestId = null;
  }

  componentWillMount = () => {
    this.setState({ value: this.props.keyword || '' });
  }

  onChange = (event, { newValue, method }) => {
    // console.log('onChange', event, newValue, method);
    if (method === 'enter') {
      console.log(newValue);
    }
    this.setState({
      value: newValue,
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    // Cancel the previous request
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }

    this.setState({
      isLoading: true,
    });

    // 延时200毫秒再去请求服务器。
    this.lastRequestId = setTimeout(() => {
      kgService.getKGSuggest(value, (result) => {
        // TODO transfer result json.
        const suggestion = this.kgDataTransferToSuggest(result);
        // console.log('suggest matches : ', result, suggestion);
        this.setState({
          isLoading: false,
          suggestions: suggestion,
        });
      });
    }, 200);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    console.log('onSuggestionsClearRequested');
    this.setState({ suggestions: [] });
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

  handleSearch = () => {
    // 这个不好
    const kgs = document.getElementsByClassName('kgsuggest');
    const data = {};
    if (kgs && kgs.length > 0) {
      data.query = kgs[0].firstChild.firstChild.value;
    }
    // const data = {
    //   query: ReactDOM.findDOMNode('.findDOMNode').value,
    // };
    if (this.props.select) {
      data.field = this.state.selectValue;
    }
    if (this.props.onSearch) this.props.onSearch(data);
  };

  render() {
    const { value, suggestions } = this.state;
    const { size, select, selectOptions, selectProps, style, btnText } = this.props;

    // Auto suggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a query',
      value, // : keyword || '',
      onChange: this.onChange,
    };

    // Finally, render it!
    return (
      <Input.Group
        compact
        size={size}
        className={classnames(styles.search, 'kgsuggest')}
        style={style}
      >
        <Autosuggest
          id="kgsuggest"
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          size={size}
        />
        <Button
          size={size}
          type="primary"
          onClick={this.handleSearch}
        >{btnText || '搜索'}</Button>
      </Input.Group>
    );
  }
}

export default KgSearchBox;
