import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'routes';
import { Spinner } from 'components';
import ManagermentOrg from './index';
import { Maps } from 'utils/immutablejs-helpers';
import { system } from "core";


// import styles from './index.less';
@connect(({ app, magOrg, loading }) => ({ app, magOrg, loading }))
export default class Org extends Component {
  state = {
    ids: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'magOrg/getOrganizationByIDs',
      payload: {
        ids: [],
        query: '',
        offset: 0,
        size: 100,
        searchType: 'all',
        filters: { terms: { system: [system.System] } },
        expertbase: ['name', 'name_zh',
          'logo', 'desc', 'type', 'stats',
          'created_time', 'updated_time', 'is_deleted', 'parents','system'],
      },
    });
  }

// TODO 以后改成穿进去的
//   rightZone = {
//     rightZoneBtn: [() => {
//       return (<p>test</p>);
//     }],
//   };

  render() {
    const load = this.props.loading.effects['magOrg/getOrganizationByIDs'];
    const [allOrgs] = Maps.getAll(this.props.magOrg, 'allOrgs');
    return (
      <Layout searchZone={[]} showNavigator={true}>
        <Spinner loading={load} />
        <ManagermentOrg treeData={allOrgs} callbackParent={this.addId} />
      </Layout>
    );
  }
}
