import React, { Component } from 'react';
import { connect } from 'engine';
import CreateProject from '../../components/CreateProject';

@connect(({ app }) => ({ app }))
export default class EditProject extends Component {
  state = { isEdit: true };

  render() {
    return (
      <div>
        <CreateProject isEdit={this.state.isEdit} projId={this.props.match.params.id} />
      </div>
    );
  }
}
