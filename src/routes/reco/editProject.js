import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import CreateProject from './createProject';
import { Button } from 'antd';

@connect(({ app }) => ({ app }))
export default class EditProject extends Component {
  state = { isEdit: true };
// TODO @xiaobei: 要携带projId
  render() {
    return (
      <div>
        <CreateProject isEdit={this.state.isEdit} projId={this.props.match.params.id} />
      </div>
    );
  }
}
