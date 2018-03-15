import React, { Component } from 'react';
import { connect } from 'engine';
import CreateProject from '../../components/CreateProject';

@connect(({ app }) => ({ app }))
export default class ViewProject extends Component {
  state = { isView: true };

  render() {
    return (
      <div>
        <CreateProject isView={this.state.isView} projId={this.props.match.params.id} />
      </div>
    );
  }
}
