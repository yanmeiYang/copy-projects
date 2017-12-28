/**
 *  Created by BoGao on 2017-08-28;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Icon } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
// import { gql, graphql } from 'react-apollo';
import { sysconfig } from 'systems';
import { Spinner } from '../../../components';
import { classnames } from '../../../utils';
import styles from './ProjectTaskPage.less';
import { Auth } from '../../../hoc';
import { ProjectTaskTable } from '../../../components/recommendation';

const location = window.location;
// const gqlGetProjectByID = gql`
//   query gqlGetProjectByID ($id:ID!) {
//     rcdproject(id: $id) {
//       ... projectFields
//       taskCount
//       tasks{
//         ... taskFields
//       }
//     }
//   }
//
//   fragment projectFields on RcdProject {
//     id
//     desc
//     title
//     progress
//     status
//     creatorID
//     creatorName
//     createTime
//     updateTime
//   }
//
//   fragment taskFields on RcdTask {
//     id
//     title
//     url
//     progress
//     status
//     createTime
//     updateTime
//   }
// `;

@connect(({ app, recommendation }) => ({ app, recommendation }))
// @graphql(gqlGetProjectByID, {
//   options({ params }) {
//     console.log('params:::', params);
//     return {
//       variables: { id: `${params.id}` },
//     };
//   },
//   // props({ data: { loading, currentUser, entry } }) {
//   //   return { loading, currentUser, entry };
//   // },
// })
@Auth
export default class ProjectTaskPage extends React.Component {
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
  };

  render() {
    // const rcd = this.props.recommendation;
    const { data } = this.props;
    console.log('>>--<< ', data);
    return (
      <div className={styles.content}>

        {data.rcdproject &&
        <div className={classnames('', styles.titleBox)}>
          <h1>{data.rcdproject.title}</h1>
          <div className={styles.info}>
            <div className={styles.user}>
              <Icon type="user" />{data.rcdproject.creatorName}
            </div>
            <div className={styles.time}>
              <FD value={data.rcdproject.createTime} />
            </div>
          </div>
          {/*<FM id="rcd.home.pageTitle" defaultMessage="Organization List"*/}
          {/*values={{ name: 'This is a test' }} />*/}
        </div>}

        <div className={styles.table}>
          <Spinner loading={data.loading} nomask />
          {!data.loading && data.rcdproject &&
          <ProjectTaskTable tasks={data.rcdproject.tasks} />
          }
        </div>

      </div>
    );
  }
}
