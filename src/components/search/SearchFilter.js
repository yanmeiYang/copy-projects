import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tag } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import styles from './SearchFilter.less';
import { sysconfig } from '../../systems';
import { classnames } from '../../utils';

const { CheckableTag } = Tag;

const expertBases = sysconfig.ExpertBases;

/**
 * SearchFilter Component
 */
@connect()
export default class SearchFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.dispatch = this.props.dispatch;
    this.onFilterChange = this.props.onFilterChange;
    this.onExpertBaseChange = this.props.onExpertBaseChange;
  }

  componentWillMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const { filters, aggs } = this.props;

    return (
      <div className={styles.filterWrap}>
        <div className={styles.filter}>

          {/* ------ 搜索范围 ------ */}
          {sysconfig.SHOW_ExpertBase && expertBases &&
          <div className={classnames(styles.filterRow, styles.range)}>
            <span className={styles.filterTitle}>
              <FM id="com.search.filter.searchRange"
                  defaultMessage="Search Range:" />
            </span>
            <ul className={styles.filterItems}>
              {
                expertBases.map((ep) => {
                  const props = {
                    key: ep.id,
                    className: styles.filterItem,
                    onChange: () => this.onExpertBaseChange(ep.id, ep.name),
                    checked: filters.eb && (filters.eb.id === ep.id),
                  };
                  return (
                    <CheckableTag {...props}>
                      {ep.name}
                    </CheckableTag>
                  );
                })
              }
            </ul>
          </div>}

          {/* ------ 过滤条件 ------ */}
          {filters && Object.keys(filters).length > 0 &&
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}>
              <FM id="com.search.filter.Filters"
                  defaultMessage="Filters:" />
            </span>
            <ul className={styles.filterItems}>
              {
                Object.keys(filters).map((key) => {
                  // special
                  const newFilters = key === 'eb' ? filters[key] : filters[key].split('#')[1];
                  return (
                    <Tag key={key} className={styles.filterItem} closable={key !== 'eb'}
                         afterClose={() => this.onFilterChange(key, newFilters, false)}
                         color="blue">
                      {key === 'eb' && filters[key].name}
                      {key !== 'eb' &&
                      <span>
                        <FM id={`com.search.filter.label.${key}`} defaultMessage={key} />:
                        {filters[key].split('#')[0]}
                      </span>
                      }
                    </Tag>
                  );
                })
              }
            </ul>
          </div>}

          {
            aggs.map((agg, index) => {
              if (agg.label === sysconfig.SearchFilterExclude) { // skip gender
                return '';
              }
              if (filters[agg.type]) {
                return '';
              } else {
                // if agg is empty
                if (!agg.item || agg.item.length === 0) {
                  return '';
                }
                // const cnLabel = showChineseLabel(agg.label);
                return (
                  <div
                    className={classnames(styles.filterRow, (index === aggs.length - 1) ? 'last' : '')}
                    key={agg.type}
                  >
                    <span className={styles.filterTitle}>
                      <FM id={`com.search.filter.label2.${agg.label}`}
                          defaultMessage={agg.label} />:
                    </span>
                    <ul>
                      {agg.item.slice(0, 12).map((item) => {
                        // console.log('>>>>>>>>>>>>>>>>>>>>>>', item);
                        const onChange = checked =>
                          this.onFilterChange(agg.type, item.value, checked, item.count);
                        return (
                          <CheckableTag
                            key={`${item.label}_${agg.label}`}
                            className={styles.filterItem}
                            checked={filters[agg.label] === item.label}
                            onChange={onChange}
                          >{item.label} (<span className={styles.filterCount}>{item.count}</span>)
                          </CheckableTag>
                        );
                      })
                      }
                    </ul>
                  </div>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}

SearchFilter.propTypes = {
  filters: PropTypes.object.isRequired,
};

