/**
 * Created by yangyanmei on 17/8/1.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Layout } from 'routes';
import { withRouter } from 'dva/router';
import RegistrationFormNew from 'components/RegistrationFormNew';

@connect(({ app }) => ({ app }))
@withRouter
export default class EditSeminar extends PureComponent {
  render() {
    const { user } = this.props.app;
    const id = this.props.match && this.props.match.params && this.props.match.params.id;
    return (
      <Layout searchZone={[]}>
        <RegistrationFormNew uid={user.id} seminarId={id} />
      </Layout>
    );
  }
}
