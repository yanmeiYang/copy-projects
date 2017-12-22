import React, { Component } from 'react';
import { routerRedux, withRouter } from 'dva/router';
import { connect } from 'dva';
import * as strings from 'utils/strings';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import classnames from 'classnames';
import { Auth } from 'hoc';
import TalentSearch from 'routes/talentHR/talentSearch/talentSearch'
import TalentSearchComponent from 'routes/search/TalentSearchComponent';
import TalentFollow from './talentFollow'
import styles from './talentSearchPage.less';
import { Form } from "antd/lib/index";

const tc = applyTheme(styles);
// TODO Combine search and uniSearch into one.
@connect(({ app, search, loading, commonFollow }) => ({ app, search, loading, commonFollow }))
// @Auth
@withRouter
export default class TalentSearchPage extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    // Select default Expert Base.
    const { filters } = props.search;
    if (filters && !filters.eb) {
      filters.eb = {
        id: sysconfig.DEFAULT_EXPERT_BASE,
        name: sysconfig.DEFAULT_EXPERT_BASE_NAME,
      };
    }
  }

  state = {
    sortType: 'relevance',
    visible: false,
    test: [],
  };

  componentDidMount() {
    console.log('...........>>>>', this.props.search)
    // this.props.dispatch({
    //   type: 'commonFollow/fetchFollowStatus',
    //   payload: {
    //     targetId:this.props.search
    //   },
    // });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.query !== this.props.search.query) {
      console.log('COMPARE:', nextProps.search.query, this.props.search.query);
    }
  }

  // hook
  onSearchBarSearch = (data) => {
    console.log('Enter query is ', data);
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    const encodedQuery = strings.encodeAdvancedQuery(data.query) || '-';
    const pathname = `/${sysconfig.SearchPagePrefix}/${encodedQuery}/${newOffset}/${newSize}`;
    console.log('=========== encode query is: ', pathname);
    this.dispatch(routerRedux.push({ pathname }));
    // ?eb=${filters.eb}TODO
    // this.doSearchUseProps(); // another approach;
  };

  render() {
    const { filters } = this.props.search;
    const { query } = this.props.match.params;
    const expertBaseId = filters && filters.eb && filters.eb.id;

    // follow 按钮传入SearchComponent,再传入personList
    const follow = [
      (person) => {
        return (
          <TalentFollow key={Math.random()} person={person} />
        )
      }
    ];
    return (
      <Layout contentClass={tc(['searchPage'])}
              showNavigator={false} searchZone={[]} onSearch={this.onSearchBarSearch}>
        <TalentSearch query={query} />
        <TalentSearchComponent // Example: include all props.
          className={styles.SearchBorder} // additional className
          sorts={[]}
          expertBaseId={expertBaseId}
          onSearchBarSearch={this.onSearchBarSearch}
          showSearchBox={false}
          disableFilter={true}
          disableExpertBaseFilter={true}
          disableSmartSuggest={!sysconfig.Search_EnableSmartSuggest}
          rightZone={follow}
          // disableSearchKnowledge={sysconfig.Search_DisableSearchKnowledge}
          // rightZoneFuncs={theme.SearchComponent_RightZone}
          fixedExpertBase={sysconfig.Search_FixedExpertBase}
        />
      </Layout>
    );
  }
}

