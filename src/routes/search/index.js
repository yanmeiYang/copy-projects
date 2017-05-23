import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import List from './List';
import Filter from './Filter';
import Modal from './Modal';

const Search = ({ location, dispatch, search, loading }) => {
  const { results, pagination, query } = search;
  const { pageSize } = pagination;

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
  }

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
      {/*<Filter {...filterProps} />*/}
      <List {...listProps} />
      {/*{modalVisible && <Modal {...modalProps} />}*/}
    </div>
  );
};


export default connect(({ search, loading }) => ({ search, loading }))(Search);
