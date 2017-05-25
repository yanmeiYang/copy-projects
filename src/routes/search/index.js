import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs } from 'antd';
import List from './List';
import SearchBox from '../../components/SearchBox';
import styles from './index.less';
import Filter from './Filter';
import Modal from './Modal';

const TabPane = Tabs.TabPane;

const Search = ({ location, dispatch, search, loading }) => {
  const { results, pagination, query } = search;
  const { pageSize } = pagination;

  function onSearch({ keyword }) {
    dispatch(routerRedux.push({
      pathname: `/search/${keyword}/0/30`,
    }));
  }

  // const modalProps = {
  //   item: modalType === 'create' ? {} : currentItem,
  //   visible: modalVisible,
  //   maskClosable: false,
  //   confirmLoading: loading.effects['user/update'],
  //   title: `${modalType === 'create' ? 'Create User' : 'Update User'}`,
  //   wrapClassName: 'vertical-center-modal',
  //   onOk(data) {
  //     dispatch({
  //       type: `user/${modalType}`,
  //       payload: data,
  //     });
  //   },
  //   onCancel() {
  //     dispatch({
  //       type: 'user/hideModal',
  //     });
  //   },
  // }
  //
  const listProps = {
    dataSource: results,
    loading: loading.effects['user/query'],
    pagination,
    location,
    isMotion: true,
    onChange(page) {
      console.log('test', page, query);
      dispatch(routerRedux.push({
        pathname: `/search/${query}/${(page.current - 1) * page.pageSize}/${page.pageSize}`,
      }));
    },
    // onDeleteItem(id) {
    //   dispatch({
    //     type: 'user/delete',
    //     payload: id,
    //   });
    // },
    // onEditItem(item) {
    //   dispatch({
    //     type: 'user/showModal',
    //     payload: {
    //       modalType: 'update',
    //       currentItem: item,
    //     },
    //   });
    // },
  };

  // const filterProps = {
  //   isMotion,
  //   filter: {
  //     ...location.query,
  //   },
  //   onFilterChange(value) {
  //     dispatch(routerRedux.push({
  //       pathname: location.pathname,
  //       query: {
  //         ...value,
  //         page: 1,
  //         pageSize,
  //       },
  //     }));
  //   },
  //   onSearch(fieldsValue) {
  //     fieldsValue.keyword.length ? dispatch(routerRedux.push({
  //       pathname: '/user',
  //       query: {
  //         field: fieldsValue.field,
  //         keyword: fieldsValue.keyword,
  //       },
  //     })) : dispatch(routerRedux.push({
  //       pathname: '/user',
  //     }));
  //   },
  //   onAdd() {
  //     dispatch({
  //       type: 'user/showModal',
  //       payload: {
  //         modalType: 'create',
  //       },
  //     });
  //   },
  //   switchIsMotion() {
  //     dispatch({ type: 'user/switchIsMotion' });
  //   },
  // }

  return (
    <div className="content-inner">
      <div className={styles.top}>
        <div>
          <span>分类筛选</span>
        </div>
        <div className={styles.searchWrap}>
          <h1>云智库搜索</h1>
          <SearchBox size="large" style={{ width: 500 }} onSearch={onSearch} />
        </div>
      </div>
      <div className={styles.filterWrap}>
        <div className={styles.filter}>
          <div className={styles.filterRow}>
            <span>专委会:</span>
          </div>
          <div className={styles.filterRow}>
            <span>标签:</span>
          </div>
          <div className={styles.filterRow}>
            <span>级别:</span>
          </div>
          <div className={styles.filterRow}>
            <span>搜索:</span>
          </div>
        </div>
        <Tabs defaultActiveKey="contrib" >
          <TabPane tab="贡献度" key="contrib" />
          <TabPane tab="h-index" key="h_index" />
          <TabPane tab="活跃度" key="activity" />
          <TabPane tab="领域新星" key="rising" />
          <TabPane tab="引用数" key="citation" />
          <TabPane tab="论文数" key="num_pubs" />
        </Tabs>
      </div>
      {/*<Filter {...filterProps} />*/}
      <List {...listProps} />
      {/*{modalVisible && <Modal {...modalProps} />}*/}
    </div>
  );
};


export default connect(({ search, loading }) => ({ search, loading }))(Search);
