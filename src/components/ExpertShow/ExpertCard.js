import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { sysconfig } from 'systems';
import { theme } from 'themes';
import { PersonList } from '../../components/person';
import styles from './ExpertCard.less';

class ExpertCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.orgs === this.props.orgs) {
      return false;
    }
    return true;
  }

  showExpertDetailInfo = (org) => {
    const id = org.id;
    this.setState({ profile: org });
    this.props.dispatch(routerRedux.push({ pathname: `/profile-info/${id}` }));
  };

  render() {
    const orgs = this.props.orgs;
    return (
      <div className={styles.content}>
        <PersonList persons={orgs} titleRightBlock={theme.PersonList_TitleRightBlock} />
      </div>

    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(ExpertCard);

