/**
 * Created by yangyanmei on 17/8/1.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { Layout } from 'routes';
import { withRouter } from 'dva/router';
import RegistrationForm from 'components/RegistrationForm';
import RegistrationFormNew from 'components/RegistrationFormNew';

@connect(({ app }) => ({ app }))
@withRouter
export default class EditSeminar extends PureComponent {
  render() {
    const { user } = this.props.app;
    const id = this.props.match && this.props.match.params && this.props.match.params.id;
    return (
      <Layout searchZone={[]}>
        {sysconfig.SeminarNewEditor ?
          <RegistrationFormNew uid={user.id} seminarId={id} />
          : <RegistrationForm uid={user.id} seminarId={id} />}
      </Layout>
    );
  }
}
