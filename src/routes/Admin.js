import React from 'react';
import { connect } from 'dva';
import styles from './Admin.css';
import { VisResearchInterest } from './vis';

function Admin() {
  return (
    <div className={styles.normal}>
      Route Component: Admin
      <VisResearchInterest personId="53f46a3edabfaee43ed05f08" />

    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Admin);
