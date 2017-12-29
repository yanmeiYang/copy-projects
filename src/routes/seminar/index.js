/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import { Button, Tabs, Icon, Spin, Tag, Modal } from 'antd';
import { sysconfig } from 'systems';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import NewActivityList from 'components/seminar/newActivityList';
import { Auth } from 'hoc';
import * as auth from 'utils/auth';
import styles from './index.less';
import SearchSeminar from './search-seminar';
import { contactByJoint, getValueByJoint } from '../../services/seminar';

const { CheckableTag } = Tag;
const TabPane = Tabs.TabPane;
const tc = applyTheme(styles);

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
    parentOrg: '',
  };

  componentWillMount = () => {
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'orgcategory' } });
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'activity_type' } });
  };
  componentDidMount = () => {
    this.setState({ organizer: '', category: '', tag: '', orgType: '' });
    const params = {
      offset: 0,
      size: this.props.seminar.sizePerPage,
      filter: { src: sysconfig.SOURCE, organizer: '', category: '' },
    };
    this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
  };

  componentDidUpdate(nextProps) {
    const { parentOrg, orgType, category, query, tag } = this.state;
    const { orgByActivity } = this.props.seminar;
    if (!isEqual(nextProps.seminar.orgByActivity, orgByActivity)) {
      const organizer = (orgByActivity.data && orgByActivity.data.length > 0) ?
        contactByJoint(parentOrg, orgByActivity.data[0].key) : orgType;
      if (orgByActivity.data) {
        const params = {
          query, organizer, category, tag,
          offset: 0, size: this.props.seminar.sizePerPage,
          src: sysconfig.SOURCE,
        };
        this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
      }
    }
  }

  addBao = () => {
    if (sysconfig.SeminarNewEditor === true) {
      this.props.dispatch(routerRedux.push({
        pathname: '/seminar-new',
      }));
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/seminar-post',
      }));
    }
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

  getMoreSeminar = (size, key) => {
    const { offset, query, sizePerPage } = this.props.seminar;
    const { organizer, category, sortType } = this.state;

    let finalOffset = 0;
    if ((size && typeof size === 'number') || size === 0) {
      finalOffset = size;
    } else {
      finalOffset = offset;
    }

    let sort = '';
    if (key) {
      sort = key === 'time' ? '' : key;
    } else {
      sort = sortType === 'time' ? '' : sortType;
    }
    if (query || organizer || category) {
      const params = {
        query,
        offset: finalOffset,
        size: sizePerPage,
        src: sysconfig.SOURCE,
        organizer,
        category,
        sort,
      };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      const params = {
        offset: finalOffset,
        size: sizePerPage,
        filter: {
          src: sysconfig.SOURCE,
          organizer,
          category,
          sort,
        },
      };
      this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
    }
  };

  getSeminar = (sizePerPage, filter) => {
    this.props.dispatch({ type: 'seminar/clearState' });
    this.setState({ organizer: '', category: '', tag: '', orgType: '' });
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
        src: sysconfig.SOURCE,
      };
      this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      const filter = {
        src: sysconfig.SOURCE,
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
      parentOrg: this.state.parentOrg,
    };
    if (checked) {
      if (type === 'orgType') {
        this.props.dispatch({
          type: 'seminar/getOrgList',
          payload: { category: `orglist_${item.id}` },
        });
        this.setState({ [type]: key, parentOrg: item.key, organizer: '' });
        stype[type] = key;
      } else if (type === 'organizer' && this.state.parentOrg) {
        this.setState({ [type]: contactByJoint(this.state.parentOrg, key) });
        stype[type] = contactByJoint(this.state.parentOrg, key);
      } else {
        this.setState({ [type]: key });
        stype[type] = key;
      }
    } else {
      // this.setState({ [type]: '' });
      // stype[type] = '';
      // if (type === 'orgType') {
      // 活动类型取消后 承办单位置为空
      // this.props.seminar.orgByActivity = {};
      // }
      // this.getSeminar(sizePerPage, { src: sysconfig.SOURCE });
    }
    if (type !== 'orgType') {
      this.props.seminar.results = [];
      if (stype.organizer === '' && stype.category === '' && stype.tag === '' && this.state.query === '') {
        const params = {
          offset: 0,
          size: sizePerPage,
          filter: { src: sysconfig.SOURCE },
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
          src: sysconfig.SOURCE,
        };
        this.props.dispatch({ type: 'seminar/searchActivity', payload: params });
      }
    }
  };

  onTabsChange = (key) => {
    this.setState({ sortType: key });
    this.getMoreSeminar(0, key);
  };

  render() {
    const { app } = this.props;
    const {
      results, loading, sizePerPage, orgcategory, activity_type,
      topMentionedTags, orgByActivity, offset,
    } = this.props.seminar;

    let showTip = '';
    if (loading && results.length <= 0) {
      showTip = '读取中...';
    } else {
      showTip = '暂无数据';
    }
    const { organizer, category, tag, orgType, sortType } = this.state;
    // const compare = (property) => {
    //   return (a, b) => {
    //     let val1 = a[property];
    //     let val2 = b[property];
    //     if (property === 'time') {
    //       val1 = a[property].from;
    //       val2 = b[property].from;
    //     }
    //     return new Date(val2) - new Date(val1);
    //   };
    // };
    // if (results && results.length > 0) {
    //   results.sort(compare(sortType));
    // }
    return (
      <Layout contentClass={tc(['seminar'])} searchZone={[]}>
        <div className="content-inner">
          <div className={styles.top}>
            <SearchSeminar onSearch={this.onSearch.bind()} />
            {auth.isAuthed(app.roles) &&
            <Button type="primary" onClick={this.addBao.bind()}>
              <Icon type="plus" />&nbsp;创建新活动
            </Button>}
          </div>
          {/* filter */}
          <div className={styles.filterWrap}>
            <div className={styles.filter}>
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
                    onChange={checked => this.getSeminar(sizePerPage, { src: sysconfig.SOURCE }, checked)}
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
                    onChange={checked => this.getSeminar(sizePerPage, { src: sysconfig.SOURCE }, checked)}
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
                    Object.values(orgByActivity.data).map((item, index) => {
                      return (
                        <CheckableTag
                          key={`${item.id}_${Math.random()}`}
                          className={styles.filterItem}
                          checked={organizer ? getValueByJoint(organizer) === item.key : index === 0}
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
              {results && results.length > 0 ?
                <div className="seminar_outbox">
                  {
                    results.map((result, index) => {
                      return (
                        <div key={result.id + Math.random()}>
                          {(app.roles.authority.indexOf(result.organizer[0]) >= 0
                          || auth.isSuperAdmin(app.roles))
                          && <Button type="danger" icon="delete" size="small"
                                     className={styles.delSeminarBtn}
                                     onClick={this.delTheSeminar.bind(this, result, index)}>
                            删除
                          </Button>}
                          <NewActivityList result={result} hidetExpertRating="false"
                                           style={{ marginTop: '20px' }} />
                        </div>
                      );
                    })
                  }
                  {!loading && results.length >= (offset - 2) &&
                  <Button type="primary" className="getMoreActivities"
                          onClick={this.getMoreSeminar.bind(this)}>
                    More
                  </Button>}
                </div>
                :
                <div className={styles.noDataMessage}>
                  <span>{showTip}</span>
                </div>}
            </div>
          </Spin>
        </div>
      </Layout>
    );
  }
}

