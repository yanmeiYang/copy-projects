import React from 'react';
import { connect } from 'dva';
import { Layout } from 'routes';
import RegistrationForm from 'components/RegistrationForm';

const AddSeminar = ({ app }) => {
  const { user } = app;
  return (
    <Layout searchZone={[]}>
      <RegistrationForm uid={user.id} />
    </Layout>
  );
};
export default connect(({ app }) => ({ app }))(AddSeminar);
