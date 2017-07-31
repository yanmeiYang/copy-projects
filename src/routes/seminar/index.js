/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon, Spin, Tag } from 'antd';
import { config, classnames } from '../../utils';
import styles from './index.less';
import SearchSeminar from './search-seminar';
import NewActivityList from '../../components/seminar/newActivityList';
// import ActivityList from '../../components/seminar/activityList';

const { CheckableTag } = Tag;

class Seminar extends React.Component {
  state = {
    organizer: '',
    category: '',
    tag: '',
    query: '',
  };

  componentWillMount = () => {
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'orgcategory' } });
  };
  addBao = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/seminar-post',
    }));
  };
  delTheSeminar = (result, i) => {
    this.props.dispatch({ type: 'seminar/deleteActivity', payload: { id: result.id } });
    this.props.seminar.results.splice(i, 1);
  };
  getMoreSeminar = () => {
    const { offset, query, sizePerPage } = this.props.seminar;
    const { organizer, category } = this.state;
    if (query) {
      const params = {
        query,
        offset,
        size: sizePerPage,
        src: config.source,
        organizer,
        category,
      };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      const params = {
        offset,
        size: sizePerPage,
        filter: { src: config.source, organizer, category },
      };
      this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
    }
  };
  getSeminar = (sizePerPage, filter, status) => {
    if (status) {
      this.props.seminar.orgByActivity = [];
    }
    this.setState({ organizer: '', category: '', tag: '' });
    const params = {
      offset: 0,
      size: sizePerPage,
      filter,
    };
    this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
  };
  onSearch = (searchQuery) => {
    this.setState({ query: searchQuery });
    this.props.seminar.results = [];
    const sizePerPage = this.props.seminar.sizePerPage;
    if (searchQuery) {
      const params = {
        query: searchQuery,
        organizer: this.state.organizer,
        category: this.state.category,
        offset: 0,
        size: sizePerPage,
        src: config.source,
      };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      const filter = {
        src: config.source,
        organizer: this.state.organizer,
        category: this.state.category,
      };
      this.getSeminar(sizePerPage, filter, false);
      // this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
    }
  };

  onFilterChange = (key, item, type, checked) => {
    if (checked && type === 'category') {
      this.props.dispatch({
        type: 'seminar/getCategory',
        payload: { category: `orglist_${item.id}` },
      });
    }
    const sizePerPage = this.props.seminar.sizePerPage;
    let organizer = '';
    let category = '';
    if (checked) {
      this.setState({ [type]: key });
      organizer = type === 'organizer' ? key : this.state.organizer;
      category = type === 'category' ? key : this.state.category;
    } else {
      this.props.seminar.orgByActivity = [];
      this.setState({ [type]: '' });
      organizer = type === 'organizer' ? '' : this.state.organizer;
      category = type === 'category' ? '' : this.state.category;
    }
    this.props.seminar.results = [];
    if (organizer === '' && category === '' && this.state.query === '') {
      const params = {
        offset: 0,
        size: sizePerPage,
        filter: { src: config.source },
      };
      this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
    } else {
      const params = {
        query: this.state.query,
        organizer,
        category,
        offset: 0,
        size: sizePerPage,
        src: config.source,
      };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    }
  };

  render() {
    const { results, loading, sizePerPage, orgcategory, activity_organizer_options, topMentionedTags, orgByActivity } =
      this.props.seminar;
    const { organizer, category } = this.state;
    return (
      <div className="content-inner">
        <div className={styles.top}>
          <SearchSeminar onSearch={this.onSearch.bind()} />
          {this.props.app.user.hasOwnProperty('first_name') &&
          <Button type="primary" onClick={this.addBao.bind()}>
            <Icon type="plus" />&nbsp;发布新活动
          </Button>}
        </div>
        {/* filter */}
        <div className={styles.filterWrap}>
          <div className={styles.filter}>
            {/*<div className={styles.filterRow}>*/}
            {/*<span className={styles.filterTitle}>过滤条件:</span>*/}
            {/*<ul className={styles.filterItems}>*/}
            {/*{Object.entries(this.state).map((item) => {*/}
            {/*console.log(item);*/}
            {/*if (item[1] === '') {*/}
            {/*return '';*/}
            {/*}*/}
            {/*return (*/}
            {/*<Tag*/}
            {/*className={styles.filterItem}*/}
            {/*key={item[1]}*/}
            {/*closable*/}
            {/*afterClose={() => this.onFilterChange(item[1], item[0], false)}*/}
            {/*color="blue"*/}
            {/*style={{ width: 'auto' }}*/}
            {/*>{item[1]}</Tag>*/}
            {/*);*/}
            {/*})}*/}
            {/*</ul>*/}
            {/*</div>*/}
            {topMentionedTags.data && topMentionedTags.data.tags.length > 0 &&
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}>标签:</span>
              <ul className={styles.filterItems}>
                {
                  topMentionedTags.data.tags.map((item) => {
                    return (
                      <CheckableTag
                        key={item.l}
                        className={styles.filterItem}
                        checked={organizer === item.l}
                        onChange={checked => this.onFilterChange(item.l, item, 'tag', checked)}
                      >
                        {item.l}
                        (<span className={styles.filterCount}>{item.f + 1}</span>)
                      </CheckableTag>
                    );
                  })
                }
              </ul>
            </div>
            }
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}>活动类型:</span>
              {orgcategory.data &&
              <ul className={styles.filterItems}>
                <CheckableTag
                  className={styles.filterItem}
                  checked={category === ''}
                  onChange={checked => this.getSeminar(sizePerPage, {src: config.source}, checked)}
                >All
                </CheckableTag>
                {
                  Object.values(orgcategory.data).map((item) => {
                    return (
                      <CheckableTag
                        key={item.id}
                        className={styles.filterItem}
                        checked={category === item.key}
                        onChange={checked => this.onFilterChange(item.key, item, 'category', checked)}
                      >
                        {item.key}
                      </CheckableTag>
                    );
                  })
                }
              </ul>
              }
            </div>
            {orgByActivity.data && <div className={styles.filterRow}>
              <span className={styles.filterTitle}>承办单位:</span>
              <ul className={styles.filterItems}>
                {
                  Object.values(orgByActivity.data).map((item) => {
                    return (
                      <CheckableTag
                        key={`${item.id}_${Math.random()}`}
                        className={styles.filterItem}
                        checked={organizer === item.key}
                        onChange={checked => this.onFilterChange(item.key, item, 'organizer', checked)}
                      >
                        {item.key}
                      </CheckableTag>
                    );
                  })
                }
              </ul>
            </div>}
          </div>
        </div>
        <Spin spinning={loading}>
          <div className="seminar">
            <div className="seminar_outbox">
              {
                results.map((result, index) => {
                  return (
                    <div key={result.id + Math.random()}>
                      {this.props.app.token && (this.props.app.roles.authority.indexOf(result.organizer[0]) >= 0 || this.props.app.roles.admin) &&
                      <Button type="danger" icon="delete" size="small"
                              onClick={this.delTheSeminar.bind(this, result, index)} style={{
                        float: 'right',
                        margin: '15px 10px 0 10px',
                      }}>删除</Button>}
                      <NewActivityList result={result} hidetExpertRating="false"
                                       style={{ marginTop: 20 }} />
                    </div>
                  );
                })
              }
              {!loading && results.length > sizePerPage &&
              <Button type="primary" className="getMoreActivities"
                      onClick={this.getMoreSeminar.bind()}>More</Button>}
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}


export default connect(({ seminar, loading, app }) => ({
  seminar,
  loading,
  app,
}))(Seminar);
