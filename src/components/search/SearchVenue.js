/**
 * Created by yangyanmei on 17/11/10.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { classnames, compare } from 'utils';
import * as strings from 'utils/strings';
import { FormattedMessage as FM } from 'react-intl';
import styles from './SearchVenue.less';

const { Column } = Table;
@connect(({ searchVenue, search }) => ({
  venues: searchVenue.venues,
  translatedLanguage: search.translatedLanguage,
  translatedText: search.translatedText,
}))
export default class SearchVenue extends Component {
  state = { query: '' };

  componentWillMount() {
    this.fetchData(this.props.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.translatedLanguage === 2) {
      this.setState({ query: nextProps.translatedText });
    } else {
      this.setState({ query: nextProps.query });
    }
  }

  shouldComponentUpdate(nextProps) {
    return compare(this.props, nextProps, 'venues', 'query', 'translatedLanguage', 'translatedText');
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.query !== this.state.query) {
      this.fetchData(nextState.query);
    }
  }

  fetchData = (query) => {
    const { dispatch } = this.props;
    if (!query) {
      return null;
    }
    const { term, name, org } = strings.destructQueryString(query);
    const fne = strings.firstNonEmpty(term, name, org);
    dispatch({ type: 'searchVenue/getVenuesByQuery', payload: { query: fne } });
  };

  render() {
    const { className } = this.props;
    return (
      <div className={classnames(styles.searchVenue, className)}>
        <h1>
          <FM id="com.SearchVenue.title" defaultMessage="Conference Rank" />
        </h1>
        <Table bordered size="small" pagination={false}
               dataSource={this.props.venues}>
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
            dataIndex="" key="h5_index" title="H5_Index"
            render={(data) => {
              return <span>{data.indices.h5_index}</span>;
            }} />
        </Table>
      </div>
    );
  }
}
