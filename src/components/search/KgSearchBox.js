import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button, message, Form } from 'antd';
import * as strings from 'utils/strings';
import Autosuggest from 'react-autosuggest';
import { defineMessages, injectIntl } from 'react-intl';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import * as kgService from 'services/knoledge-graph-service';
import * as suggestService from 'services/search-suggest';
import styles from './KgSearchBox.less';

const FormItem = Form.Item;

const messages = defineMessages({
  placeholder: {
    id: 'com.KgSearchBox.placeholder',
    defaultMessage: 'Input expert name or query',
  },
  placeholderTerm: {
    id: 'com.KgSearchBox.placeholderTerm',
    defaultMessage: 'Term',
  },
  placeholderName: {
    id: 'com.KgSearchBox.placeholderName',
    defaultMessage: 'Name',
  },
  placeholderOrg: {
    id: 'com.KgSearchBox.placeholderOrg',
    defaultMessage: 'Org',
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
    lang.name.toLowerCase().slice(0, inputLength) === inputValue);
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

// ==================================================================================

class KgSearchBox extends PureComponent {
  static propTypes = {
    // logoZone: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.advanced = this.getRealAdvancedSearchStatus(props);
    // Auto suggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '', // current query, term in advanced.
      suggestions: [],
    };

    this.lastRequestId = null;
  }

  componentWillMount = () => {
    const { query } = this.props;
    const { term, name, org } = strings.destructQueryString(query);
    const newQuery = this.advanced ? term : strings.firstNonEmpty(term, name, org);
    this.setState({ value: newQuery || '' });
  };

  componentDidMount() {
    const { form, query } = this.props;
    if (this.advanced) {
      const { _, name, org } = strings.destructQueryString(query);
      form.setFieldsValue({ name, org });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { form, query } = this.props;
    this.advanced = this.getRealAdvancedSearchStatus(nextProps);
    if (nextProps.query !== query) {
      const { term, name, org } = strings.destructQueryString(nextProps.query);
      const newQuery = this.advanced ? term : strings.firstNonEmpty(term, name, org);
      this.setState({ value: newQuery || '' });
      if (this.advanced) {
        form.setFieldsValue({ name, org });
      }
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
      this.setState({ suggestions });
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

  getRealAdvancedSearchStatus = (props) => {
    const { fixAdvancedSearch, isAdvancedSearch } = props;
    return fixAdvancedSearch ? true : isAdvancedSearch;
  };

  /**
   * Handle Submit
   * @param event
   */
  handleSubmit = (advanced, event) => {
    event.preventDefault();

    // pin query
    const { form } = this.props;
    let query = this.state.value; // term
    if (advanced) {
      const name = form.getFieldValue('name');
      const org = form.getFieldValue('org');
      query = strings.constructQueryString(this.state.value, name, org);
    }
    query = query || '-';

    if (this.props.onSearch) {
      this.props.onSearch({ advanced, query });
    }
    // 阻止搜索后再弹出窗口。
    if (this.lastRequestId !== null) {
      clearTimeout(this.lastRequestId);
    }
  };

  switchAdvanced = () => {
    this.props.dispatch({ type: 'app/toggleAdvancedSearch' });
  };

  render() {
    const { value, suggestions } = this.state;
    const { intl } = this.props;
    const { size, className, style, btnText, searchPlaceholder, searchBtnStyle } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { fixAdvancedSearch } = this.props;
    // const { isAdvancedSearch } = this.props; // from app model.
    // fixAdvancedSearch ? true : isAdvancedSearch;

    // Auto suggest will pass through all these props to the input.
    const inputProps = {
      placeholder: this.advanced
        ? intl.formatMessage(messages.placeholderTerm)
        : searchPlaceholder || intl.formatMessage(messages.placeholder),
      value, // : query || '',
      onChange: this.onChange,
    };
    const btnSize = size === 'huge' ? 'large' : size;
    // Finally, render it!
    return (
      <Form
        className={classnames(
          styles.kgSearchBox,
          className,
          styles[size],
          this.advanced ? styles.adv : '',
        )}
        onSubmit={this.handleSubmit.bind(this, this.advanced)}>

        <Input.Group
          compact size={btnSize} style={style}
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
            size={btnSize}
          />

          {this.advanced &&
          <FormItem>
            {getFieldDecorator('name', {
              // rules: [{ required: true, message: 'Please input your username!' }],
            })(<Input className={classnames(styles.inputBox, styles.name)}
                      placeholder={intl.formatMessage(messages.placeholderName)} />)}
          </FormItem>
          }

          {this.advanced &&
          <FormItem className={styles.orgFormItem}>
            {getFieldDecorator('org', {
              // rules: [{ required: true, message: 'Please input your username!' }],
            })(<Input className={classnames(styles.inputBox, styles.org)}
                      placeholder={intl.formatMessage(messages.placeholderOrg)} />)}
          </FormItem>
          }

          <Button
            className={styles.searchBtn} style={searchBtnStyle} htmlType="submit"
            type="primary" size={btnSize} onClick={this.handleSubmit.bind(this, this.advanced)}
          >{btnText || intl.formatMessage(messages.searchBtn)}
          </Button>

          {!fixAdvancedSearch &&
          <Button
            className={styles.switchBtn} style={searchBtnStyle}
            type="primary" size={btnSize} onClick={this.switchAdvanced.bind(this, this.advanced)}
          ><i className="fa fa-fw fa-retweet fa-md" />
          </Button>
          }
        </Input.Group>
      </Form>
    );
  }
}

const mapStateToProps = state => ({ isAdvancedSearch: state.app.isAdvancedSearch });
export default injectIntl(connect(mapStateToProps)(Form.create()(KgSearchBox)));
