import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Select, Button, Icon } from 'antd';
import styles from './index.less';

class SearchBox extends React.Component {
  state = {
    clearVisible: false,
    selectValue: (this.props.select && this.props.selectProps) ? this.props.selectProps.defaultValue : '',
  };

  handleSearch = () => {
    const data = {
      query: ReactDOM.findDOMNode(this.refs.searchInput).value,
    };
    console.log(data);
    if (this.props.select) {
      data.field = this.state.selectValue;
    }
    if (this.props.onSearch) this.props.onSearch(data);
  };

  handleInputChange = (e) => {
    this.setState({
      ...this.state,
      clearVisible: e.target.value !== '',
    });
  };

  handleSelectChange = (value) => {
    this.setState({
      ...this.state,
      selectValue: value,
    });
  };

  handleClearInput = () => {
    ReactDOM.findDOMNode(this.refs.searchInput).value = '';
    this.setState({
      clearVisible: false,
    });
    this.handleSearch();
  };
  render() {
    const { size, select, selectOptions, selectProps, style, keyword, btnText } = this.props;
    const { clearVisible } = this.state;
    return (
      <Input.Group compact size={size} className={styles.search} style={style}>
        {select && <Select ref="searchSelect" onChange={this.handleSelectChange} size={size} {...selectProps}>
          {selectOptions && selectOptions.map(
            (item, key) =>
              <Select.Option value={item.value} key={key}>{item.name || item.value}</Select.Option>
          )}
        </Select>}
        <Input ref="searchInput" size={size} onChange={this.handleInputChange} onPressEnter={this.handleSearch} defaultValue={keyword} />
        <Button size={size} type="primary" onClick={this.handleSearch}>{btnText && '搜索'}</Button>
        {clearVisible && <Icon type="cross" onClick={this.handleClearInput} />}
      </Input.Group>
    );
  }
}


export default SearchBox;
