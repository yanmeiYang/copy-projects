/**
 *  Created by BoGao on 2017-12-19;
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router';
import { Tag, Pagination } from 'antd';
import hole from 'core/hole';
import { Layout } from 'routes';
import { Auth } from 'hoc';
import { PersonList } from 'components/person';
import { Spinner } from 'components';
import ACMForecastLabel from './ACMFellowForecast/ACMForecastLabel';
import styles from './ACMFellowForecast.less';

@connect(({ app, acmforecast, loading }) => ({
  app: { user: app.user, roles: app.roles },
  acmforecast,
  loading,
}))
@Auth
@withRouter
export default class ACMFellowForecast extends Component {
  state = {
    page: 1,
    pageSize: 20,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'acmforecast/getACMFellowForecast' });
  }

  componentWillReceiveProps(nextProps) {
  }

  // // hook
  onSearchBarSearch = (data) => {
    //   console.log('Enter query is ', data);
    //   const newOffset = data.offset || 0;
    //   const newSize = data.size || sysconfig.MainListSize;
    //   const encodedQuery = strings.encodeAdvancedQuery(data.query) || '-';
    //   const pathname = `/${sysconfig.SearchPagePrefix}/${encodedQuery}/${newOffset}/${newSize}`;
    //   console.log('=========== encode query is: ', pathname);
    //   this.dispatch(routerRedux.push({ pathname }));
    //   // ?eb=${filters.eb}TODO
    //   // this.doSearchUseProps(); // another approach;
  };

  onPageChange = (page) => {
    this.setState({ page });
    const { pageSize } = this.state;
    const offset = (page - 1) * pageSize;
    // console.log('>>> ', offset, pageSize);
    this.props.dispatch({
      type: 'acmforecast/getACMFellowForecast',
      payload: { offset, size: pageSize },
    });
  };

  afterTitleFunc = ({ param: { person } }) => {
    const score = person && person.attached && person.attached.score;
    const result = [];
    if (score.score_h >= 2) {
      result.push(<div key={0}>Hindex高</div>);
    }
    if (score.score_c >= 3) {
      result.push(<div key={1}>引用高</div>);
    }
    if (score.score_t >= 2) {
      result.push(<div key={2}>引用引领论文</div>);
    }
    return (
      <div className={styles.labels}>
        {/*person:{score.score_sum}*/}
        {result.map((x, idx) => {
          const index = idx;
          return <Tag key={index} className={styles.label}>{x}</Tag>;
        })}
      </div>
    );
  };

  render() {
    const { acmforecast } = this.props;
    const { persons, total } = acmforecast;
    const { page, pageSize } = this.state;
    const loading = this.props.loading.global;

    const contentBottomZone = [
      hole.DEFAULT_PLACEHOLDER,
      (param) => {
        const { person } = param;
        return <ACMForecastLabel key={10} person={person} />;
      },
    ];

    return (
      <Layout contentClass={styles.ACMFellowForecast} searchZone={[]}>
        <Spinner loading={loading} />
        <h1>
          ACM Fellow预测
          {total && <span className={styles.small}> ({total})</span>}
        </h1>
        <PersonList
          className={styles.personList}
          persons={persons}
          user={this.props.app.user}
          emptyPlaceHolder=""
          // expertBaseId={expertBaseId}
          afterTitleBlock={this.afterTitleFunc}
          // titleRightBlock={theme.PersonList_TitleRightBlock}
          // rightZoneFuncs={theme.PersonList_RightZone}
          // bottomZoneFuncs={this.bottomZones}
          contentBottomZone={contentBottomZone}
          // didMountHooks={sysconfig.PersonList_DidMountHooks}
          // UpdateHooks={this.props.PersonList_UpdateHooks}
          // tagsLinkFuncs={this.props.onSearchBarSearch}
        />

        {persons &&
        <div className={styles.pagination}>
          <Pagination
            showQuickJumper
            current={page}
            defaultCurrent={1}
            defaultPageSize={pageSize}
            total={total}
            onChange={this.onPageChange}
          />
        </div>
        }

      </Layout>
    );
  }
}
