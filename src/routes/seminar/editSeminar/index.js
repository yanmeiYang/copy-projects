/**
 * Created by yangyanmei on 17/8/1.
 */
import React, { Component, PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux, Link, withRouter } from 'dva/router';
import RegistrationForm from 'components/RegistrationForm';

@connect(({ app }) => ({ app }))
@withRouter
export default class EditSeminar extends PureComponent {
  render() {
    const { user } = this.props.app;
    const id = this.props.match && this.props.match.params && this.props.match.params.id;
    return (
      <div>
        <RegistrationForm uid={user.id} seminarId={id} />
      </div>
    );
  }
}
