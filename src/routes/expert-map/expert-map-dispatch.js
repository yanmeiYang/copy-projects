/**
 * Created by Administrator on 2017/8/30.
 */
import React from 'react';
import { connect } from 'dva';

class ExpertMapDispatch extends React.Component {
  componentDidMount() {
  }

  componentWillReceiveProps() {

  }

  render() {
    let target;
    const type = localStorage.getItem("maptype");
    if (type) {
      if (type === 'google') {
        target = 'google';
      } else if (type === 'baidu') {
        target = 'baidu';
      }
    }
    if (!target) {
      const lang = navigator.language;
      if (lang === 'zh-CN') {
        target = 'baidu';
      } else {
        target = 'google';
      }
    }
    if (target === 'baidu') {
      window.location.href = '/expert-map?type=baidu';
    } else {
      window.location.href = '/expert-googlemap';
    }

    return (
      <div></div>
    );
  }
}

export default ExpertMapDispatch;
