/**
 *  Created by BoGao on 2017-08-28;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Icon } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { gql, graphql } from 'react-apollo';
import { sysconfig } from '../../../systems';
import { Spinner } from '../../../components';
import { classnames } from '../../../utils';
import styles from './ProjectPage.less';
import { Auth } from '../../../hoc';
import { ProjectTable } from '../../../components/recommendation';

const gqlGetOrgByID = gql`
  query gqlGetOrgByID ($id:ID!) {
    rcdorg (id: $id){
      id
      name
      desc
      creatorID
      creatorName
      createTime
      updateTime
      projects {
        ... projectFields
        taskCount
      }
    }
  }
  
  fragment projectFields on RcdProject {
    id
    desc
    title
    progress
    status
    creatorID
    creatorName
    createTime
    updateTime
  }
`;

@connect(({ app, recommendation }) => ({ app, recommendation }))
@graphql(gqlGetOrgByID, {
  options({ params }) {
    // console.log('--------------', params);
    return {
      variables: { id: `${params.id}` },
    };
  },
  // props({ data: { loading, currentUser, entry } }) {
  //   return { loading, currentUser, entry };
  // },
})
@Auth
export default class ProjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  componentWillMount() {
    const { query } = queryString.parse(location.search);
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

  render() {
    // const rcd = this.props.recommendation;
    const { data } = this.props;
    // console.log('>> ', data);
    console.log('>>--<< ', data);
    return (
      <div className={styles.content}>

        {data.rcdorg &&
        <div className={classnames('', styles.titleBox)}>
          <h1>{data.rcdorg.name}</h1>
          <div className={styles.info}>
            <div className={styles.user}>
              <Icon type="user" />{data.rcdorg.creatorName}
            </div>
            <div className={styles.time}>
              <FD value={data.rcdorg.createTime} />
            </div>
          </div>
          {/*<FM id="rcd.home.pageTitle" defaultMessage="Organization List"*/}
          {/*values={{ name: 'This is a test' }} />*/}
        </div>}

        <div className={styles.table}>
          <Spinner loading={data.loading} nomask />
          {!data.loading && data.rcdorg &&
          <ProjectTable projects={data.rcdorg.projects} />
          }
        </div>

      </div>
    );
  }
}
