import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { Auth } from 'hoc';
import classnames from 'classnames';
import { Spinner } from 'components';
import { ExpertCard } from 'components/ExpertShow';
import SearchComponent from 'routes/search/SearchComponent';
import styles from './ExpertBaseExpertsPage.less';

@connect(({ app, search, expertBase, loading }) => ({ app, search, expertBase, loading }))
@Auth
export default class ExpertBaseExpertsPage extends Component {
  constructor(props) {
    super(props);
    this.TheOnlyExpertBaseID = sysconfig.ExpertBase;
  }

  state = {
    // flag: false, // TODO 名字太common了，改掉。
  };

  componentWillMount() {
    // TODO 需要翻页，默认不要显示200人这么多。会很慢的。每页用30条记录。
    // this.props.dispatch({
    //   type: 'expertBase/getExpertDetailList',
    //   payload: { id: this.TheOnlyExpertBaseID, offset: 0, size: 200 },
    // });
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
    // const { detailResults } = this.props.expertBase;
    // const value = '';
    // const { flag } = this.state;
    // const load = this.props.loading.effects['expertBase/getExpertDetailList'];

    // console.log('nnmn^O^ $ ^O^nMn...... ', sysconfig.Search_SortOptions);

    return (
      <div className={classnames('content-inner', styles.page)}>
        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={sysconfig.Search_SortOptions}
          onSearchBarSearch={this.onSearchBarSearch}
          showSearchBox={this.props.app.headerSearchBox ? false : true}
          disableFilter disableExpertBaseFilter
        />
      </div>

      // <div>
      //   <Search placeholder="input name" className={styles.searchArea}
      //           onSearch={this.searchExpertByName.bind(value)} />
      //   <div className={styles.orgArea}>
      //     <Spinner loading={load} nomask />
      //     {detailResults.result && detailResults.result.length > 0 ?
      //       <ExpertCard orgs={detailResults.result} /> :
      //       <div>
      //         {flag && <div className={styles.noResult}> 没有搜索到该专家 </div>}</div>
      //     }
      //   </div>
      // </div>
    );
  }
}

