/**
 *  Created by BoGao on 2017-05-30;
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, InputNumber, Rate } from 'antd';
import { ProfileInfo } from '../../components/person';
import * as personService from '../../services/person';
import styles from './index.less';


const ExpertMap = ({ dispatch, person, loading }) => {
  // function onSearch({ query }) {
  //   console.log('onSearch in PersonPage');
  //   dispatch(routerRedux.push({
  //     pathname: `/search/${query}/0/30`,
  //   }));
  // }

  return (
    <div className="content-inner">
      <h1>Expert Map</h1>

    </div>
  );
};

export default connect(({ person, loading }) => ({ person, loading }))(ExpertMap);
