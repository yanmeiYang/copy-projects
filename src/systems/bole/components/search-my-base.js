/**
 * Created by yangyanmei on 17/9/27.
 */
/**
 * Created by zlm on 2017/9/13.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, message } from 'antd';
import styles from './search-my-base.less';

@connect()
export default class SearchExpertBase extends PureComponent {
  searchMessage = () => {
    message.warning('请输入搜索关键字！',1);
  };

  render() {
    const { query, sysconfig } = this.props;
    return (
      <div>{query !== '' ?
        <Link to={`/${sysconfig.SearchPagePrefix}/${query}/0/20`} className={styles.link}>
          <Button type="primary" className={styles.searchButton}>Search</Button>
        </Link> :
        <Button type="primary" className={styles.searchButton} onClick={this.searchMessage.bind()}>Search</Button>
      }</div>);
  }
}
