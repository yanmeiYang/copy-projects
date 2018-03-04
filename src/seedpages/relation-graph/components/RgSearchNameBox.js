import React from 'react';
import { Input, Button } from 'antd';
import { defineMessages, injectIntl } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import styles from './RgSearchNameBox.less';

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name.n.en}</span>
  );
}

const messages = defineMessages({
  placeholder: {
    id: 'com.RgSearchNameBox.placeholder',
    defaultMessage: 'Input expert name',
  },
  searchBtn: {
    id: 'com.KgSearchBox.searchBtn',
    defaultMessage: 'Search',
  },
});

@injectIntl
export default class RgSearchNameBox extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      finalNode: [],
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  };

  getSuggestionValue = (suggestion) => {
    this.setState({ finalNode: suggestion });
    return suggestion.name.n.en;
  };

  getSuggestions = (value) => {
    const suggestions = [];
    const inputValue = value.toLowerCase().trim();
    const inputLength = inputValue.length;
    for (const node of this.props.suggesition) {
      suggestions.push(node);
    }

    return inputLength === 0 ? [] : suggestions.filter(lang =>
      lang.name.n.en.toLowerCase().trim().includes(inputValue),
    );
  };

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let searchExpert = null;
    if (this.props.onSearch) {
      if (this.state.finalNode.name && this.state.finalNode.name.n.en === this.state.value) {
        searchExpert = this.state.finalNode;
      } else {
        const value = this.state.suggestions.filter(lang =>
          lang.name.n.en.toLowerCase().trim().includes(this.state.value.toLowerCase().trim()),
        );
        searchExpert = value[0];
      }
      this.props.onSearch(searchExpert);
    }
  };

  render() {
    const { value, suggestions } = this.state;
    const { intl } = this.props;
    const { size, style, hideSearchBtn } = this.props;
    this.props.suggesition.slice(0, 10);
    const inputProps = {
      placeholder: intl.formatMessage(messages.placeholder),
      value,
      onChange: this.onChange,
    };

    return (
      <form onSubmit={this.handleSubmit} style={{ display: 'inline-block' }}>
        <Input.Group
          compact
          size={size}
          style={style}
          className={styles.search}
        >
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            size={size}
          />
          {!hideSearchBtn &&
          <Button
            size={size}
            type="primary"
            onClick={this.handleSubmit}
            icon="search"
            float="left"
          />
          }
        </Input.Group>
      </form>
    );
  }
}
