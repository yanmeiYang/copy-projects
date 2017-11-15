/**
 * Created by lizongbao on 2017/11/7.
 */
import { Button } from 'antd';
import { Input, Icon } from 'antd';

import React, { Component } from 'react';
import styles from './SearchBar.less';

const Search = Input.Search;
export default class SearchBar extends Component {
  render() {
    return (
      <Search
          className={this.props.className}
          defaultValue={this.props.homepageURL}
          placeholder="Input the expert's homepage URL:"
          onSearch={this.props.handleSearch}
          size="large"
          prefix={<Icon type="user" />}
        />

    );
  }
}
