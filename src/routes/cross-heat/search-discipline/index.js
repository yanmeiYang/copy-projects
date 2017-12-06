/**
 * Created by ranyanchuan on 2017/9/11.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Button } from 'antd';
import styles from './index.less';

class SearchDiscipline extends React.Component {
  search = () => {
    const query = ReactDOM.findDOMNode(this.refs.query).value ? ReactDOM.findDOMNode(this.refs.query).value : null;
    this.props.onSearch(query);
  };

  handlesearch = () => {
    this.search();
  };

  render() {
    return (
      <div className={styles.searchWrap}>
        <Input placeholder={this.props.placeValue} ref="query"
               onPressEnter={this.handlesearch} />
        <Button type="primary" onClick={this.search}>智能生成</Button>
      </div>
    );
  }
}

export default (SearchDiscipline);
