import React from 'react';
import { connect } from 'dva';
import { Icon, Input } from 'antd';
import { routerRedux } from 'dva/router';
import { sysconfig } from 'systems';
import { Auth } from 'hoc';
import { Spinner } from 'components';
import { ExpertCard } from 'components/ExpertShow';
import styles from './ExpertBaseExpertsPage.less';

const Search = Input.Search;
@connect(({ expertBase, loading }) => ({ expertBase, loading }))
@Auth
export default class ExpertBaseExpertsPage extends React.Component {
  constructor(props) {
    super(props);
    this.TheOnlyExpertBaseID = sysconfig.ExpertBase;
  }

  state = {
    flag: false, // TODO 名字太common了，改掉。
  };

  componentWillMount() {
    // TODO 需要翻页，默认不要显示200人这么多。会很慢的。每页用30条记录。
    this.props.dispatch({
      type: 'expertBase/getExpertDetailList',
      payload: { id: this.TheOnlyExpertBaseID, offset: 0, size: 200 },
    });
    this.props.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query: '', onSearch: this.onSearch },
        showFooter: false,
      },
    });
  }

  // addExpertDetailInfo = (dataId) => {
  //   const id = dataId;
  //   this.props.dispatch(routerRedux.push({ pathname: `/add-expert-detail/${id}` })); // TODO
  // };
  onSearch = () => {
    console.log('search:', '');
  };

  searchExpertByName = (value) => {
    this.setState({ flag: true });
    const id = this.TheOnlyExpertBaseID;
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
  };

  render() {
    const { detailResults } = this.props.expertBase;
    const value = '';
    const { flag } = this.state;
    const load = this.props.loading.effects['expertBase/getExpertDetailList'];
    return (
      <div>111
        <Search placeholder="input name" className={styles.searchArea}
                onSearch={this.searchExpertByName.bind(value)} />
        <div className={styles.orgArea}>
          <Spinner loading={load} nomask />
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

