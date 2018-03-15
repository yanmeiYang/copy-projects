import React, { Component } from 'react';
import { connect,Link } from 'engine';
import { Layout } from 'components/layout';
import { applyTheme } from 'themes';
import { Button } from 'antd';
import { queryString } from 'utils';
import { PersonList } from 'components/person';
import styles from './$id.less';

@connect(({ app, reco }) => ({ app, reco }))
export default class ViewPerson extends Component {
  state = { data: [] };

  componentDidMount() {
    const { location } = this.props;
    let { n } = queryString.parse(location.search || {});
    console.log('n>>>>>>>>>>>>>>>>.',n)
    const { id } = this.props.match.params;
    const num = parseInt(n, 10);
    const number = `${num + 1},${num + 2}`;
    this.props.dispatch({
      type: 'reco/viewPerson',
      payload: { ids: id, num: number },
    }).then((data) => {
      this.setState({ data: data.items });
    });
  }

  render() {
    const { data } = this.state;
    const { id } = this.props.match.params;
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <Link to={`/reco/reports/${id}`}><Button>返回报告页</Button></Link>
        <PersonList
          persons={data}
          // type="tiny"
          // indicesType={'text'}
          PersonList_PersonLink_NewTab="true"
          // rightZoneFuncs={button}
          showIndices={['h_index', 'citations', 'num_pubs']}
          className={styles.recopersonlist}
        />
      </Layout>
    );
  }
}
