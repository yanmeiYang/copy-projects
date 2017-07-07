/**
 * Created by yangyanmei on 17/6/8.
 */
import React from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import styles from './search-seminar.less'

class SearchSeminar extends React.Component {
  handlesearch = () => {
    this.searchSeminar()
  };
  searchSeminar = () => {
    let query = this.refs.query.refs.input.value;
    const category = this.refs.category.refs.input.value;
    const organizer = this.refs.organize.refs.input.value;
    this.props.seminar.offset = 0;
    this.props.seminar.results = [];
    let size = this.props.seminar.sizePerPage;
    if (query||category||organizer) {
      let params = { query: query,category:category,organizer:organizer, offset: 0, size: size,src:'ccf' };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      let params = { offset: 0, size: size, filter: { src: 'ccf' } };
      this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
    }
  };

  render() {
    return (
      <div className={styles.searchWrap}>
        <Input placeholder='请输入关键词。。。' ref='query' onPressEnter={this.handlesearch}/>
        <Input placeholder='请输入活动类型' ref='category' onPressEnter={this.handlesearch}/>
        <Input placeholder='请输入承办单位' ref='organize' onPressEnter={this.handlesearch}/>
        <Button type="primary" onClick={this.searchSeminar}>搜索</Button>
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(SearchSeminar);
