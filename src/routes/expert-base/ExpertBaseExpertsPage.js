import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { sysconfig } from 'systems';
import { Auth } from 'hoc';
import classnames from 'classnames';
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
    // Set query to null, and set eb to the only eb.
    this.props.dispatch({
      type: 'search/updateFiltersAndQuery', payload: {
        query: '', filters: { eb: { id: sysconfig.ExpertBase, name: '我的专家库' } },
      },
    });
  }

  // addExpertDetailInfo = (dataId) => {
  //   const id = dataId;
  //   this.props.dispatch(routerRedux.push({ pathname: `/add-expert-detail/${id}` })); // TODO
  // };

  onSearch = (data) => {
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    this.props.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}?`, // eb=${filters.eb}TODO
    }));
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

  ebSorts = ['time', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

  render() {
    return (
      <div className={classnames('content-inner', styles.page)}>
        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={this.ebSorts}
          defaultSortType="time"
          onSearchBarSearch={this.onSearchBarSearch}
          showSearchBox={this.props.app.headerSearchBox ? false : true}
          disableFilter disableExpertBaseFilter disableSearchKnowledge
        />
      </div>

    );
  }
}

