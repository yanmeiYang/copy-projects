/**
 * Created by yangyanmei on 17/11/10.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { classnames } from 'utils';
import * as strings from 'utils/strings';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import styles from './SearchVenue.less';

const { Column } = Table;
@connect(({ searchVenue }) => ({ searchVenue }))
export default class SearchVenue extends Component {
  componentWillMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { dispatch, query } = this.props;
    if (!query) {
      return null;
    }
    const { term, name, org } = strings.destructQueryString(query);
    const fne = strings.firstNonEmpty(term, name, org);
    dispatch({ type: 'searchVenue/getVenuesByQuery', payload: { query: fne } });
  };

  render() {
    const { className } = this.props;
    const { venues } = this.props.searchVenue;
    return (
      <div className={classnames(styles.searchVenue, className)}>
        <h1>
          <FM id="com.SearchVenue.title" defaultMessage="Conference Rank" />
        </h1>
        <Table bordered size="small" pagination={false}
               dataSource={venues}>
          <Column
            dataIndex="name" key="name" title="Short Name"
            className={styles.venueName}
          />
          <Column
            dataIndex="" key="position" title="Desc"
            className={styles.venueDesc}
            render={(data) => {
              return <span dangerouslySetInnerHTML={{ __html: data.info.name }} />;
            }} />
          <Column
            dataIndex="" key="position" title="H5_Index"
            render={(data) => {
              return <span>{data.indices.h5_index}</span>;
            }} />
        </Table>
      </div>
    );
  }
}
