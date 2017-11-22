import React from 'react';
import { connect } from 'dva';
import { Layout } from 'routes';
import RegistrationFormNew from 'components/RegistrationFormNew';

const AddSeminar = ({ app }) => {
  const { user } = app;
  return (
    <Layout searchZone={[]}>
      <RegistrationFormNew uid={user.id} />
    </Layout>
  );
};
export default connect(({ app }) => ({ app }))(AddSeminar);
