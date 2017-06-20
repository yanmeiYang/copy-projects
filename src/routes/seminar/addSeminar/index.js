import React from 'react';
import { connect } from 'dva';
import RegistrationForm from '../../../components/RegistrationForm';

const AddSeminar = ({ app }) => {
  const { user } = app;
  const props = {};
  return (
    <RegistrationForm uid={user.id}/>
  );
};
export default connect(({ app }) => ({ app }))(AddSeminar);
