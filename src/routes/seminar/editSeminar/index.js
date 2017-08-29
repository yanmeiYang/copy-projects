/**
 * Created by yangyanmei on 17/8/1.
 */
import React from 'react';
import { connect } from 'dva';
import RegistrationForm from '../../../components/RegistrationForm';

const EditSeminar = ({ app, params }) => {
  const { user } = app;
  return (
    <RegistrationForm uid={user.id} seminarId={params.id} />
  );
};
export default connect(({ app }) => ({ app }))(EditSeminar);
