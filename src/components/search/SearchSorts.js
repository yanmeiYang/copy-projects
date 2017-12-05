import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tag, Tabs } from 'antd';
import classnames from 'classnames';
import { Hole } from 'components';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { compare } from 'utils/compare';
import { hole } from 'utils';
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
    const { rightZone, sortType } = this.props;
    const sorts = this.props.sorts || defaultSorts;
    if (!sorts || sorts.length <= 0) {
      return false;
    }

    // render rightZone
    const rightZoneJSXs = rightZone && rightZone.length > 0 &&
      <div className={styles.exportButtonZone}>
        {rightZone && rightZone.length > 0 && rightZone.map((block) => {
          return block && block({ sortType });
        })}
      </div>;

    // TODO but div???
    const rightZoneJSX = <Hole fill={rightZone} param={{ sortType }} />;

    return (
      <Tabs
        className={classnames(styles.searchSorts)}
        defaultActiveKey={sortType}
        activeKey={sortType}
        size="small"
        onChange={this.onOrderChange}
        tabBarExtraContent={rightZoneJSX}
      >
        {sorts.map((sortItem) => {
          const icon = sortItem === sortType ? <i className="fa fa-sort-amount-desc" /> : '';
          const label =
            <FM id={`com.search.sort.label.${sortItem}`} defaultMessage={sortItem} />;
          return <TabPane tab={<span>{label} {icon}</span>} key={sortItem} />;
        })}
      </Tabs>
    );
  }
}

