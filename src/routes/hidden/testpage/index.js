import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Icon, Tag, Pagination, Spin } from 'antd';
import { listPersonByIds } from '../../../services/person';

class TestPage extends React.Component {

  constructor(props) {
    super(props);
    console.log('Test Page Starting....');
    // this.props.dispatch();

    // Example: directly use service.
    const resultPromise = listPersonByIds(["53f432a6dabfaee0d9b3f93f", "53f42b48dabfaeb1a7b70189", "53f48ceddabfaea7cd1d0a3a"]);
    resultPromise.then(
      (data) => {
        console.log('success', data.data);
      },
      () => {
        console.log('failed');
      },
    ).catch(() => {
      console.error('Error occured.');
    });
  }

  render() {
    return (
      <div className="content-inner">

      </div>
    );
  }
}
;


export default connect(({ search, loading }) => ({ search, loading }))(TestPage);
