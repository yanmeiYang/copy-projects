import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux, Link, withRouter } from 'dva/router';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import classnames from 'classnames';
import { Pagination } from 'antd';
import { Spinner } from 'components';
import { Hole } from 'components/core';
import { PersonList, ExportExperts } from 'components/person';
import { SearchFilter, SearchSorts, KgSearchBox } from 'components/search';
import { SearchKnowledge, TranslateSearchMessage } from 'components/search';

import { sysconfig } from 'systems';
import { theme } from 'themes';
import { createURL, hole } from 'utils';
import { Auth } from 'hoc';
import SearchAssistant, { AssistantUtils } from './SearchAssistant';
import styles from './SearchComponent.less';

@connect(({ app, search, loading }) => ({ app, search, loading }))
@withRouter
@Auth
export default class SearchComponent extends Component {
  static displayName = 'SearchComponent';

  static contextTypes = {};

  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    disableFilter: PropTypes.bool,
    disableExpertBaseFilter: PropTypes.bool,
    disableSearchKnowledge: PropTypes.bool,
    disableSmartSuggest: PropTypes.bool,
    sorts: PropTypes.array, // pass through
    defaultSortType: PropTypes.string,
    onSearchBarSearch: PropTypes.func,
    showSearchBox: PropTypes.bool, // has search box?
    fixedExpertBase: PropTypes.object,
    // zones
    searchMessagesZone: PropTypes.array,
    rightZoneFuncs: PropTypes.array,
  };

  static defaultProps = {
    disableFilter: false,
    disableExpertBaseFilter: false,
    defaultSortType: 'relevance',
    disableSmartSuggest: false, //TODO back to true
  };

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;// TODO remove
    // Select default Expert Base.
    const { filters } = props.search;
    if (filters && !filters.eb) {
      filters.eb = {
        id: sysconfig.DEFAULT_EXPERT_BASE,
        name: sysconfig.DEFAULT_EXPERT_BASE_NAME,
      };
    }
  }

  componentWillMount() {
    this.doSearchUseProps(); // Init search.
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.search.query !== this.props.search.query) {
  //     console.log('COMPARE:', nextProps.search.query, this.props.search.query);
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  // }

  // URL改变引起的props变化，在这里刷新搜索。其余的action导致的数据更新都在action后面调用了search方法。

  componentDidUpdate(prevProps, prevState) {
    const { search } = this.props;
    const prevSearch = prevProps.search;
    if (search.query !== prevSearch.query
      || search.offset !== prevSearch.offset
      || !isEqual(search.pagination.pageSize, prevSearch.pagination.pageSize)
    ) {
      this.doSearchUseProps();
      window.scrollTo(0, 0); // go top
    }
  }

  // will reset pager and sort.
  onFilterChange = (key, value, checked, total) => {
    const { filters, query } = this.props.search;

    // if onExpertBaseChanged, all filters is cleared.
    if (checked) {
      filters[key] = total ? `${value}#${total}` : value;
    } else if (filters[key]) {
      delete filters[key];
    }
    this.doSearch(query, 0, sysconfig.MainListSize, filters, '');
  };

  onOrderChange = (e) => {
    const { filters, query } = this.props.search;
    this.doSearch(query, 0, sysconfig.MainListSize, filters, e, false);
    // this.dispatch({ type: 'search/updateSortKey', payload: { key: e } });
    // this.dispatch({
    //   type: 'search/searchPerson',
    //   payload: { query, offset: 0, size: sysconfig.MainListSize, filters, sort: e },
    // });
  };

  // 保留一些，只换URL和页码。
  onPageChange = (page) => {
    const { match, dispatch, search } = this.props;
    const { query, pagination } = search;
    const { pageSize } = pagination;
    const pathname = createURL(match.path, match.params, {
      query: query || '-',
      offset: (page - 1) * pageSize,
      size: pageSize,
    });
    dispatch(routerRedux.push({ pathname }));
  };

  // ExpertBase filter 'eb' is a special filter.
  // On expert base changed, all other filters should be cleared.
  // sort method is not cleared.
  onExpertBaseChange = (id, name) => {
    const { filters } = this.props.search;
    // delete all other filters.
    Object.keys(filters).forEach((f) => {
      delete filters[f];
    });
    this.onFilterChange('eb', { id, name }, true);// Special Filter;
  };

  onAssistantChanged = (texts) => {
    // NOTE: query keep unchanged. Change type: [nothing|expansion|kg]
    // advanced clear assistant value.
    const { dispatch } = this.props;
    const { query, assistantDataMeta, assistantData } = this.props.search;
    const prevTexts = assistantDataMeta && assistantDataMeta.advquery && assistantDataMeta.advquery.texts;
    // on expansion change, only clear kg data.
    AssistantUtils.smartClear({ assistantData, prevTexts, texts, dispatch });

    this.dispatch({ type: 'search/setAssistantDataMeta', payload: { texts } });
    this.doSearchUseProps();
  };

  // keep every thing, just call search;
  doSearchUseProps = () => {
    const { query, offset, pagination, filters, sortKey } = this.props.search;
    const { pageSize } = pagination;
    if (query !== '-') {
      this.doSearch(query, offset, pageSize, filters, sortKey, true);
    }
  };

  doTranslateSearch = (useTranslate) => {
    this.dispatch({ type: 'search/setTranslateSearch', payload: { useTranslate } });
    this.doSearchUseProps();
  };

  doSearch = (query, offset, size, filters, sort, dontRefreshUrl) => {
    const { dispatch, fixedExpertBase } = this.props;
    // 如果是fixed，那么限制EB为指定值。
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
      payload: { query, offset, size, filters, sort, total: parseInt(filtersLength) },
    });

    // TODO remove later. 新的方式获取api的时候，这个方法啥也不干。
    if (!sysconfig.USE_NEXT_EXPERT_BASE_SEARCH || (filters && filters.eb.id === 'aminer')) {
      dispatch({ type: 'search/translateSearch', payload: { query } });
      dispatch({
        type: 'search/searchPersonAgg',
        payload: { query, offset, size, filters, sort },
      });
    }

    // Change URL
    if (!dontRefreshUrl) {
      const { match } = this.props;
      const pathname = createURL(match.path, match.params, {
        query: query || '-',
        offset: 0,
        size,
      });
      dispatch(routerRedux.push({ pathname }));
    }
  };


  defaultZone = {
    rightZone: [
      param => <SearchKnowledge key={1} query={param.query} />,
    ],
  };


  render() {
    const {
      disableExpertBaseFilter, disableFilter, disableSearchKnowledge,
      rightZoneFuncs, disableSmartSuggest, searchMessagesZone,
    } = this.props;

    const { search, loading } = this.props;

    const { className, sorts, expertBaseId } = this.props;
    const { results, pagination, query, aggs, filters, topic, sortKey: sortType } = search;
    const { pageSize, total, current } = pagination;
    // console.log('>>>---', query);
    const load = loading.effects['search/searchPerson'];
    const isPagination = !load;
    // const expertBase = (filters && filters.eb && filters.eb.id) || 'aminer';

    const rightZoneData = { expertBaseId, query, pageSize, current, filters, sortType };

    const SearchSortsRightZone = !sysconfig.Enable_Export ? null :
      hole.fillFuncs(theme.SearchSorts_RightZone, [
        () => () => (
          <ExportExperts
            key="0" expertBaseId={expertBaseId}
            query={query} pageSize={pageSize} current={current} filters={filters} sort={sortType}
          />
        ),
      ], rightZoneData);

    // Search Assistant // TODO move translate search out.
    const { useTranslateSearch, translatedLanguage, translatedText } = search;
    const transMsgProps = { query, useTranslateSearch, translatedLanguage, translatedText };

    return (
      <div className={classnames(styles.searchComponent, className)}>

        <div className={styles.topZone}>
          <div className={styles.searchZone}>

            {/* 搜索框 */}
            {this.props.showSearchBox &&
            <div className={styles.top}>
              <div className={styles.searchWrap}>
                <KgSearchBox
                  size="large" style={{ width: 500 }}
                  query={query} onSearch={this.props.onSearchBarSearch}
                />
              </div>
            </div>
            }

            {/* Translate Search // old translate message. */}

            {sysconfig.Search_EnableTranslateSearch && !sysconfig.Search_EnableSmartSuggest &&
            <TranslateSearchMessage
              {...transMsgProps}
              doTranslateSearch={this.doTranslateSearch}
            />}

            {/* Search Help */}
            {!disableSmartSuggest &&
            <SearchAssistant
              onAssistantChanged={this.onAssistantChanged}
            />}

            {/* Search Message Zone TODO not good.*/}
            {/*<Hole fill={searchMessagesZone} />;*/}
            {searchMessagesZone && searchMessagesZone.length > 0 &&
            <div className={styles.message}>
              {searchMessagesZone}
            </div>
            }

            {/* ---- Filter ---- */}

            {!disableFilter &&
            <SearchFilter
              title={Math.random()}
              filters={filters}
              aggs={aggs}
              onFilterChange={this.onFilterChange}
              onExpertBaseChange={this.onExpertBaseChange}
              disableExpertBaseFilter={disableExpertBaseFilter}
            />}

          </div>

        </div>

        <div className={styles.view}>

          {/* Sort */}
          <SearchSorts
            sorts={sorts}
            sortType={sortType}
            rightZone={SearchSortsRightZone}
            onOrderChange={this.onOrderChange}
          />

          <Spinner loading={load} />
          <div className={styles.searchContent}>
            <div className={styles.leftRight}>
              <PersonList
                className={styles.personList}
                persons={results}
                user={this.props.app.user}
                expertBaseId={expertBaseId}
                afterTitleBlock={theme.PersonList_AfterTitleBlock}
                titleRightBlock={theme.PersonList_TitleRightBlock}
                rightZoneFuncs={theme.PersonList_RightZone}
                bottomZoneFuncs={this.props.PersonList_BottomZone}
                didMountHooks={sysconfig.PersonList_DidMountHooks}
                UpdateHooks={this.props.PersonList_UpdateHooks}
                tagsLinkFuncs={this.props.onSearchBarSearch}
              />

              <Hole
                name="search.rightZoneFuncs"
                fill={rightZoneFuncs}
                defaults={this.defaultZone.rightZone}
                param={{ query, topic }}
                config={{ containerClass: styles.searchKgContent }}
              />

              {/*{hole.fillFuncs(*/}
              {/*rightZoneFuncs, // theme from config.*/}
              {/*DefaultRightZoneFuncs, // default block.*/}
              {/*{ query, topic }, // parameters passed to block.*/}
              {/*{ containerClass: styles.searchKgContent }, // configs.*/}
              {/*)}*/}
            </div>
            {isPagination &&
            <div className={styles.paginationWrap}>
              <Pagination
                showQuickJumper
                current={current}
                defaultCurrent={1}
                defaultPageSize={pageSize}
                total={total}
                onChange={this.onPageChange}
              />
            </div>
            }
          </div>
        </div>

      </div>
    );
  }
}
