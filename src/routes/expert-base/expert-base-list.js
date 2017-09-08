import React from 'react';
import { connect } from 'dva';
import { Icon, Input } from 'antd';
import { routerRedux } from 'dva/router';
import { Spinner } from '../../components';
import { ExpertCard } from '../../components/ExpertShow';
import styles from './expert-base-list.less';

const Search = Input.Search;

class ExpertDetailList extends React.Component {
  state = {
    flag: false,
  };

  componentWillMount() {
    const id = '59a8e5879ed5db1fc4b762ad';
    this.props.dispatch({
      type: 'expertBase/getExpertDetailList',
      payload: { id, offset: 0, size: 100 },
    });
  }

  addExpertDetailInfo = (dataId) => {
    const id = dataId;
    this.props.dispatch(routerRedux.push({ pathname: `/add-expert-detail/${id}` }));
  };
  searchExpertByName = (value) => {
    this.setState({ flag: true });
    const id = '59a8e5879ed5db1fc4b762ad';
    if (value) {
      this.props.dispatch({
        type: 'expertBase/searchExpertItem',
        payload: { id, name: value },
      });
    } else {
      this.props.dispatch({
        type: 'expertBase/getExpertDetailList',
        payload: { id, offset: 0, size: 100 },
      });
    }
    // const id = this.props.routeParams.id;
  };

  render() {
    const { detailResults } = this.props.expertBase;
    const value = '';
    const { flag } = this.state;
    const load = this.props.loading.effects['expertBase/getExpertDetailList'];
    return (
      <div>
        <Search placeholder="input name" className={styles.searchArea}
                onSearch={this.searchExpertByName.bind(value)}/>
        <div className={styles.orgArea}>
          <Spinner loading={load} nomask/>
          {detailResults.result && detailResults.result.length > 0 ?
            <ExpertCard orgs={detailResults.result} /> :
            <div>
              {flag && <div className={styles.noResult}> 没有搜索到该专家 </div>}</div>
          }
        </div>
      </div>
    );
  }
}

export default connect(({ expertBase, loading }) => ({ expertBase, loading }))(ExpertDetailList);
