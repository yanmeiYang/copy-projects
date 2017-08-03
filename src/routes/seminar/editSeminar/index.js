/**
 * Created by yangyanmei on 17/8/1.
 */
import React from 'react';
import { connect } from 'dva';
import RegistrationForm from '../../../components/RegistrationForm';

class EditSeminar extends React.Component {
  componentWillMount() {
    const id = this.props.params.id;
    this.props.dispatch({ type: 'seminar/getSeminarByID', payload: { id } });
  }

  render() {
    const { app, seminar } = this.props;
    const { user } = app;
    return (
      <RegistrationForm uid={user.id} seminarId={this.props.params.id} editTheSeminar={seminar.summaryById} />
    );
  }
}
export default connect(({ app, seminar }) => ({ app, seminar }))(EditSeminar);
