import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tag, Tabs } from 'antd';
import classnames from 'classnames';
import { Hole } from 'components/core';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { compare } from 'utils/compare';
import { hole } from 'core';
import styles from './SearchSorts.less';

const { TabPane } = Tabs;

const defaultSorts = ['relevance', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

@connect()
export default class SearchSorts extends PureComponent {
  static displayName = 'SearchSorts';

  static propTypes = {
    sorts: PropTypes.array,
    sortType: PropTypes.string.isRequired,
    rightZone: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    onOrderChange: PropTypes.func,
  };

  static defaultProps = {
    // Note: default value只在使用component时不传参数时生效。传空进来并不能生效。
    sortType: '',
    rightZone: [],
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return compare(this.props, nextProps, 'sortType', 'sorts');// TODO sorts not work.
  // }

  onOrderChange = (e) => {
    if (this.props.onOrderChange) {
      this.props.onOrderChange(e);
    }
  };

  render() {
    return ""
  }
}

