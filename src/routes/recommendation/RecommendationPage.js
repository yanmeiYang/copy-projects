/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { sysconfig } from '../../systems';
import styles from './RecommendationPage.less';
import { Auth } from '../../hoc';
import { RCDOrgList } from '../../components/recommendation';

@connect(({ app, recommendation }) => ({ app, recommendation }))
@Auth
export default class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query);
    if (query) {
      // this.props.dispatch({ type: 'app/setQuery', query });
      this.setState({ query });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
      },
    });
    // call data
    this.loadOrgs();
  }


  // componentWillUnmount() {
  //   this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  // }
  //
  onSearch = (data) => {
    if (data.query) {
      return;
    }
    const { dispatch } = this.props;
    this.setState({ query: data.query });
    dispatch(routerRedux.push({ pathname: '/rcd', query: { query: data.query } }));
    dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query: data.query } });
  };


  loadOrgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'recommendation/getAllOrgs',
      payload: { offset: 0, size: sysconfig.MainListSize },
    });
  };

  render() {
    const rcd = this.props.recommendation;
    console.log('>> ', rcd.orgs);
    return (
      <div className={styles.content}>

        <FM id="rcd.home.pageTitle" defaultMessage="Organization List"
            values={{ name: 'This is a test' }} />

        {rcd.orgs &&
        <RCDOrgList orgs={rcd.orgs} />
        }

      </div>
    );
  }
}
