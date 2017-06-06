/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import ExpertMap from './expert-map.js';

class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    console.log('Loading BaiduMap Container');
  }

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    return (
      <div className="">
        <h1>Expert Map</h1>

        <ExpertMap />

      </div>
    );
  }
}


export default connect(({ person, loading }) => ({ person, loading }))(ExpertMapPage);
