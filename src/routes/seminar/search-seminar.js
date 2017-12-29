/**
 * Created by yangyanmei on 17/6/8.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Button } from 'antd';
import styles from './search-seminar.less';

class SearchSeminar extends React.Component {
  handlesearch = () => {
    this.searchSeminar();
  };
  searchSeminar = () => {
    const query = ReactDOM.findDOMNode(this.refs.query).value ? ReactDOM.findDOMNode(this.refs.query).value : '';
    this.props.onSearch(query);
  };

  render() {
    return (
      <div className={styles.searchWrap}>
        <Input placeholder="搜索活动" ref="query" onPressEnter={this.handlesearch} />
        <Button type="primary" onClick={this.searchSeminar}>搜索</Button>
      </div>
    );
  }
}

export default (SearchSeminar);
