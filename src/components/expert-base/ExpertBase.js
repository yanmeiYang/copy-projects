/**
 * Created by yangyanmei on 18/2/7.
 */
import React, { Component } from 'react';
import { connect, routerRedux, withRouter } from 'engine';
import { Tabs, Button, Modal } from 'antd';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { createURL, queryString } from 'utils';
import * as strings from 'utils/strings';
import hole, { fillFuncs } from 'core/hole';
import { Auth } from 'hoc';
import { isEqual } from 'lodash';
import { KgSearchBox } from 'components/search';
import SearchComponent from 'components/searchpage/SearchComponent';
import styles from './ExpertBase.less';

@connect(({ app, search, expertBase, loading }) => ({ app, search, expertBase, loading }))
@withRouter
@Auth
export default class ExpertBaseExpertsPage extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    key: '1',
    addExpertVisible: false,
  };

  componentWillMount() {
    const { expertBaseId, expertBaseName } = this.props;
    if (expertBaseId && expertBaseId.length > 0) {
      this.updateFilters(expertBaseId, expertBaseName);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expertBaseId !== this.props.expertBaseId) {
      if (nextProps.expertBaseId && nextProps.expertBaseId.length > 0) {
        this.updateFilters(nextProps.expertBaseId, nextProps.expertBaseName);
        this.setState({ key: '1' });
      }
    }
    if (nextProps.search.sortKey !== this.props.search.sortKey) {
      this.props.dispatch({
        type: 'search/updateUrlParams',
        payload: { query: this.props.search.query, offset: 0, size: 20 },
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { search, currentBaseChildIds, expertBaseId, expertBaseName, currentBaseParentId } = this.props;
    const prevSearch = prevProps.search;
    let expertBases = [];
    if (currentBaseChildIds) {
      expertBases = currentBaseChildIds.map((item) => {
        return item.id;
      });
    }
    if (search.filters && search.filters.eb && search.filters.eb.id
      && prevSearch.filters && prevSearch.filters.eb && prevSearch.filters.eb.id
    ) {
      if (search.filters.eb.id !== prevSearch.filters.eb.id && search.filters.eb.id !== 'aminer'
        && search.filters.eb.id !== currentBaseParentId) {
        // TODO 以后是要删除的
        const finalId = this.getResultsIsNullById(expertBaseId);
        const filters = { eb: { id: finalId, name: expertBaseName } };
        expertBases.unshift(expertBaseId);
        this.doSearch(search.query, 0, sysconfig.MainListSize, filters, '', null, null, expertBases);
        window.scrollTo(0, 0); // go top
      }
    }
  }

  onSearchBarSearch = (data) => {
    this.props.dispatch({
      type: 'search/updateUrlParams', payload: { query: data.query, offset: 0, size: 20 },
    });
  };

  updateFilters = (id, name) => {
    const { dispatch } = this.props;
    // TODO 以后是要删除的
    const finalId = this.getResultsIsNullById(id);
    dispatch({
      type: 'search/updateFiltersAndQuery', payload: {
        query: '', filters: { eb: { id: finalId, name: '当前库' } },
      },
    });
    dispatch({ type: 'search/clearSearchAssistant' });
  };

  getResultsIsNullById = (id) => {
    // TODO 临时修改，这3个智库Expert为空，显示父级内容
    const expertIsExpert = ['5a7d43f6d79726e1d4496d39', '5a7d44ccd79726e1d449703a', '5a7d451ed79726e1d4497155'];
    let finalId = id;
    if (expertIsExpert.includes(id)) {
      finalId = '5a7d4160d79726e1d44964a6';
    }
    return finalId;
  };

  doSearch = (query, offset, size, filters, sort, dontRefreshUrl, typesTotals, expertBases) => {
    const { dispatch, fixedExpertBase, expertBaseId, expertBaseName } = this.props;
    if (expertBaseId === null || !expertBaseId) {
      return;
    }
    if (fixedExpertBase && fixedExpertBase.id) {
      filters.eb = fixedExpertBase; // eslint-disable-line no-param-reassign
    }

    // TODO 老旧方式获取total, 当换成新的api的时候删除.
    let filtersLength = 0;
    for (const item of Object.values(filters)) {
      if (typeof item === 'string') {
        // eslint-disable-next-line prefer-destructuring
        filtersLength = item.split('#')[1];
      }
    }
    dispatch({
      type: 'search/searchPerson',
      payload: {
        query, offset, size, filters, sort,
        total: parseInt(filtersLength), typesTotals, expertBaseId, expertBases,
      },
    });

    // TODO remove later. 新的方式获取api的时候，这个方法啥也不干。
    if (!sysconfig.USE_NEXT_EXPERT_BASE_SEARCH || (filters && filters.eb.id === 'aminer')) {
      dispatch({ type: 'search/translateSearch', payload: { query } });
    }

    // Change URL
    if (!dontRefreshUrl) {
      const { match } = this.props;
      const pathname = createURL(match.path, match.params, {
        query: query || '-',
        offset: 0,
        size,
      });
      const params = queryString.stringify({
        id: expertBaseId, name: expertBaseName,
        // offset: (page - 1) * pageSize,
        // size: pageSize,
      });
      dispatch(routerRedux.push({ pathname, search: `?${params}` }));
    }
  };

  onPageChange = (page) => {
    const { dispatch, search } = this.props;
    const { query, pagination } = search;
    const { pageSize } = pagination;
    dispatch({
      type: 'search/updateUrlParams',
      payload: { query, offset: (page - 1) * pageSize, size: pageSize },
    });
  };

  switchTab = (key, offset) => {
    const { currentBaseChildIds, currentBaseParentId } = this.props;
    const { search, expertBaseId, expertBaseName, dispatch } = this.props;
    const finalOffset = offset || 0;
    const size = sysconfig.MainListSize;
    let expertBases = [];
    this.setState({ key });
    if (key === '1') {
      if (currentBaseChildIds) {
        expertBases = currentBaseChildIds.map((item) => {
          return item.id;
        });
      }
      const filters = { eb: { id: expertBaseId, name: '当前库' } };
      dispatch({ type: 'search/updateFilters', payload: { filters } });
    }
    if (key === '2') {
      const filters = { eb: { id: 'aminer', name: '全球专家' } };
      dispatch({ type: 'search/updateFilters', payload: { filters } });
      if (search.query) {
        this.doSearch(search.query, finalOffset, size, filters, '');
      } else {
        dispatch({ type: 'search/emptyResults' });
      }
    }
    if (key === '3') {
      if (currentBaseChildIds) {
        expertBases = currentBaseChildIds.map((item) => {
          return item.id;
        });
      }
      const filters = { eb: { id: currentBaseParentId, name: expertBaseName } };
      dispatch({ type: 'search/updateFilters', payload: { filters } });
      this.doSearch(search.query, finalOffset, size, filters, '', null, null, expertBases);
    }
  };

  onSearch = (data) => {
    const encodedQuery = strings.encodeAdvancedQuery(data.query) || '-';
    const { dispatch, search } = this.props;
    const { pagination } = search;
    dispatch({
      type: 'search/updateUrlParams',
      payload: { query: decodeURIComponent(encodedQuery), offset: 0, size: pagination.pageSize },
    });
  };

  showAddExpertModal = () => {
    this.setState({ addExpertVisible: true });
    this.props.dispatch({ type: 'search/updateFiltersAndQuery', payload: { query: '-' } });
    this.switchTab('2');
  };

  hideAddExpertModal = () => {
    this.setState({ addExpertVisible: false });
    this.props.dispatch({ type: 'search/updateFiltersAndQuery', payload: { query: '' } });
    this.switchTab('1');
  };

  ebSorts = ['h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs', 'time'];

  render() {
    const { query, pagination, sortKey } = this.props.search;
    const { expertBaseName, expertBaseId, currentBaseChildIds, currentBaseParentId } = this.props;
    const { addExpertVisible } = this.state;

    // TODO 104 108 110的智库为空，使用父级智库
    const finalExpertBaseId = this.getResultsIsNullById(expertBaseId);

    const total = pagination && (pagination.total || 0);
    const { term, name, org } = strings.destructQueryString(query);

    // search message
    const zoneData = { total, term, name, org, id: expertBaseId, expertBaseName };
    const searchMessageZone = fillFuncs(theme.ExpertBaseExpertsPage_MessageZone, [], zoneData);

    return (
      <div className={styles.expertBaseBlock}>
        <div className={styles.eb}>

          <div className={styles.tools}>
            <span className={styles.btn} onClick={this.showAddExpertModal}>添加专家</span>
          </div>

          <Modal
            title={expertBaseName ? `添加专家到“${expertBaseName}”` : '添加专家'}
            visible={addExpertVisible}
            onOk={this.hideAddExpertModal}
            onCancel={this.hideAddExpertModal}
            maskClosable={false}
            footer={null}
            width="78vw"
            wrapClassName={styles.addExpertModal}
            bodyStyle={{ padding: '10px 20px 1px 20px', height: '80vh', overflowY: 'scroll' }}
            style={{ height: '80vh', minHeight: '500px', marginTop: '42px' }}
          >

            <KgSearchBox className={styles.searchBox} onSearch={this.onSearch} query={query} />

            <SearchComponent // Example: include all props.
              className={styles.SearchBorder} // additional className
              sorts={sysconfig.Search_SortOptions || (query ? null : this.ebSorts)}
              defaultSortType={sortKey}
              onSearchBarSearch={this.onSearchBarSearch}
              expertBaseId={finalExpertBaseId}
              currentBaseChildIds={currentBaseChildIds}
              PersonList_BottomZone={theme.PersonList_BottomZone}
              PersonList_UpdateHooks={sysconfig.PersonList_UpdateHooks}
              rightZoneFuncs={[]}
              searchMessagesZone={searchMessageZone}
              disableFilter={sysconfig.Search_DisableFilter}
              ExpertBases={[]}
              disableExpertBaseFilter={false}
              disableSearchKnowledge
              hideLocationAndLanguageInFilter
              onPageChange={this.onPageChange}
            />
          </Modal>

        </div>

        <div className={styles.tabAndSearch}>
          <Tabs defaultActiveKey="1" onChange={this.switchTab} activeKey={this.state.key}>
            <Tabs.TabPane tab="当前库" key="1" />
            {currentBaseParentId &&
            <Tabs.TabPane tab="搜索更多专家" key="3" />}
            <Tabs.TabPane tab="全球专家" key="2" />
          </Tabs>
          <KgSearchBox className={styles.searchBox} onSearch={this.onSearch} query={query}
                       showSearchIcon={true} />
        </div>
        <SearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={sysconfig.Search_SortOptions || (query ? null : this.ebSorts)}
          defaultSortType={sortKey}
          onSearchBarSearch={this.onSearchBarSearch}
          expertBaseId={finalExpertBaseId}
          currentBaseChildIds={currentBaseChildIds}
          PersonList_BottomZone={theme.PersonList_BottomZone}
          PersonList_UpdateHooks={sysconfig.PersonList_UpdateHooks}
          rightZoneFuncs={[]}
          searchMessagesZone={searchMessageZone}
          disableFilter={sysconfig.Search_DisableFilter}
          ExpertBases={[]}
          disableExpertBaseFilter={false}
          disableSearchKnowledge
          hideLocationAndLanguageInFilter
          onPageChange={this.onPageChange}
        />
      </div>
    );
  }
}

