import React from 'react';
import { connect } from 'dva';
import { Button, Input } from 'antd';
import { routerRedux } from 'dva/router';
import { ExpertList } from '../../components/ExpertShow';
import styles from './expert-base-list.less';

const Search = Input.Search;

class ExpertDetailList extends React.Component {
  state = {
  };
  componentDidMount() {
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
    // const id = this.props.routeParams.id;
    const id = '59a8e5879ed5db1fc4b762ad';
    this.props.dispatch({
      type: 'expertBase/searchExpertItem',
      payload: { id, name: value },
    });
  };

  render() {
    const { detailResults } = this.props.expertBase;
    const dataId = this.props.routeParams.id;
    const value = '';
    return (
      <div>
        {/*<Button onClick={this.addExpertDetailInfo.bind(this, dataId)}*/}
        {/*className={styles.addButton}>添加专家</Button>*/}
        <Search placeholder="input name" className={styles.searchArea}
                onSearch={this.searchExpertByName.bind(value)} />
        <ExpertList orgs={detailResults.result} />
      </div>
    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(ExpertDetailList);
