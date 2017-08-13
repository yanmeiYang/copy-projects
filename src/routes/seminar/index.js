/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Tabs, Icon, Spin, Tag, Modal } from 'antd';
import { config } from '../../utils';
import styles from './index.less';
import SearchSeminar from './search-seminar';
import NewActivityList from '../../components/seminar/newActivityList';
// import ActivityList from '../../components/seminar/activityList';
import * as auth from '../../utils/auth';
import { Auth } from '../../hoc';

const { CheckableTag } = Tag;
const TabPane = Tabs.TabPane;

@connect(({ app, seminar, loading }) => ({ app, seminar, loading }))
@Auth
export default class Seminar extends React.Component {
  state = {
    organizer: '',
    category: '',
    orgType: '',
    tag: '',
    query: '',
    sortType: 'time',
  };

  componentWillMount = () => {
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'orgcategory' } });
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'activity_type' } });
  };

  addBao = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/seminar-post',
    }));
  };

  delTheSeminar = (result, i) => {
    const props = this.props;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        props.dispatch({ type: 'seminar/deleteActivity', payload: { id: result.id } });
        props.seminar.results.splice(i, 1);
      },
      onCancel() {
      },
    });
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
      this.props.seminar.orgByActivity = [];
      this.setState({ organizer: '', category: '', tag: '' });
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
    const sizePerPage = this.props.seminar.sizePerPage;
    const stype = {
      organizer: this.state.organizer,
      category: this.state.category,
      tag: this.state.tag,
    };
    if (checked) {
      if (type === 'orgType') {
        this.props.dispatch({
          type: 'seminar/getCategory',
          payload: { category: `orglist_${item.id}` },
        });
      }
      this.setState({ [type]: key });
      stype[type] = key;
    } else {
      this.setState({ [type]: '' });
      stype[type] = '';
      if (type === 'orgType') {
        // 活动类型取消后 承办单位置为空
        this.props.seminar.orgByActivity = {};
      }
    }
    this.props.seminar.results = [];
    if (stype.organizer === '' && stype.category === '' && stype.tag === '' && this.state.query === '') {
      const params = {
        offset: 0,
        size: sizePerPage,
        filter: { src: config.source },
      };
      this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
    } else {
      const params = {
        query: this.state.query,
        organizer: stype.organizer,
        category: stype.category,
        tag: stype.tag,
        offset: 0,
        size: sizePerPage,
        src: config.source,
      };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    }
  };

  onTabsChange = (key) => {
    this.setState({ sortType: key });
  };

  render() {
    const { app } = this.props;
    const {
      results, loading, sizePerPage, orgcategory, activity_type,
      topMentionedTags, orgByActivity,
    } = this.props.seminar;
    const { organizer, category, tag, orgType, sortType } = this.state;
    const compare = (property) => {
      return (a, b) => {
        let val1 = a[property];
        let val2 = b[property];
        if (property === 'time') {
          val1 = a[property].from;
          val2 = b[property].from;
        }
        return new Date(val2) - new Date(val1);
      };
    };
    results.sort(compare(sortType));
    return (
      <div className="content-inner">
        <div className={styles.top}>
          <SearchSeminar onSearch={this.onSearch.bind()} />
          {auth.isAuthed(app.user) &&
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
                  topMentionedTags.data.tags.slice(0, 5).map((item) => {
                    return (
                      <CheckableTag
                        key={item.l}
                        className={styles.filterItem}
                        checked={tag === item.l}
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
              {activity_type.data &&
              <ul className={styles.filterItems}>
                <CheckableTag
                  className={styles.filterItem}
                  checked={category === ''}
                  onChange={checked => this.getSeminar(sizePerPage, { src: config.source }, checked)}
                >All
                </CheckableTag>
                {
                  Object.values(activity_type.data).map((item) => {
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
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}>机构类型:</span>
              {orgcategory.data &&
              <ul className={styles.filterItems}>
                <CheckableTag
                  className={styles.filterItem}
                  checked={orgType === ''}
                  onChange={checked => this.getSeminar(sizePerPage, { src: config.source }, checked)}
                >All
                </CheckableTag>
                {
                  Object.values(orgcategory.data).map((item) => {
                    return (
                      <CheckableTag
                        key={item.id}
                        className={styles.filterItem}
                        checked={orgType === item.key}
                        onChange={checked => this.onFilterChange(item.key, item, 'orgType', checked)}
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

        <div>
          <Tabs defaultActiveKey={this.state.sortType} onChange={this.onTabsChange}
                className={styles.maxWidth}>

            <TabPane tab={<span>开始时间<i className="fa fa-sort-amount-desc" /></span>}
                     key="time" />
            <TabPane tab={<span>创建时间<i className="fa fa-sort-amount-desc" /></span>}
                     key="createtime" />
            <TabPane tab={<span>修改时间<i className="fa fa-sort-amount-desc" /></span>}
                     key="updatetime" />
          </Tabs>
        </div>

        <Spin spinning={loading}>
          <div className="seminar">
            {results.length > 0 ?
              <div className="seminar_outbox">
                {
                  results.map((result, index) => {
                    return (
                      <div key={result.id + Math.random()}>
                        {(this.props.app.roles.authority.indexOf(result.organizer[0]) >= 0 || this.props.app.roles.admin) &&
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
              </div> : <div style={{ marginTop: '20px' }}><span
                style={{ fontSize: '32px', color: '#aaa' }}>暂无数据</span></div>}
          </div>
        </Spin>
      </div>
    );
  }
}

//
// export default connect(
//   ({ seminar, loading, app }) => ({ seminar, loading, app, }))(Seminar);
