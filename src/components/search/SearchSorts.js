import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tag, Tabs } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { compare } from 'utils/compare';
import styles from './SearchFilter.less';

const TabPane = Tabs.TabPane;

const defaultSorts = ['relevance', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

@connect()
export default class SearchSorts extends React.PureComponent {
  static displayName = 'SearchSorts';

  static propTypes = {
    sorts: PropTypes.array,
    sortType: PropTypes.string.isRequired,
    rightZone: PropTypes.array,
    onOrderChange: PropTypes.func,
  };

  static defaultProps = {
    // Note: default value只在使用component时不传参数时生效。传空进来并不能生效。
    sortType: 'relevance',
    rightZone: [],
  };

  shouldComponentUpdate(nextProps, nextState) {
    return compare(this.props, nextProps, 'sortType', 'sorts');// TODO sorts not work.
  }

  onOrderChange = (e) => {
    if (this.props.onOrderChange) {
      this.props.onOrderChange(e);
    }
  };

  render() {
    const { rightZone } = this.props;
    const sortType = this.props.sortType || 'relevance';
    const sorts = this.props.sorts || defaultSorts;
    if (!sorts || sorts.length <= 0) {
      return false;
    }

    // render rightZone
    const rightZoneJSX = rightZone && rightZone.length > 0 &&
      <div>
        {rightZone && rightZone.length > 0 && rightZone.map((block) => {
          return block && block({ sortType });
        })}
      </div>;


    return (
      <Tabs
        className={styles.maxWidth}
        defaultActiveKey={sortType}
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
