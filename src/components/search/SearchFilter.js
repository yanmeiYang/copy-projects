import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Tag } from 'antd';
import { classnames } from 'utils';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { sysconfig } from 'systems';
import styles from './SearchFilter.less';

const { CheckableTag } = Tag;

const expertBases = sysconfig.ExpertBases;

const AggConfig = {
  gender: {
    render: (item) => {
      if (item.term === 'no_records' || item.term === 'both') {
        return false;
      }
      return item.term ?
        <FM id={`com.search.filter.value.gender.${item.term}`} defaultMessage={item.term} />
        : false;
    },
  },
  h_index: {
    render: (item) => {
      if (!item) {
        return false;
      }
      if (!item.from && item.to) {
        return `<${item.to}`;
      } else if (item.from && !item.to) {
        return `>=${item.from}`;
      } else if (item.from && item.to) {
        return `${item.from}-${item.to}`;
      }
      return item.term;
    },
  },
  location: {},
  language: {},
};

/**
 * SearchFilter Component
 */
export default class SearchFilter extends Component {
  constructor(props) {
    super(props);
    // this.dispatch = this.props.dispatch;
    this.onFilterChange = this.props.onFilterChange;
    this.onExpertBaseChange = this.props.onExpertBaseChange;
    this.keys = ['h_index', 'gender', 'location', 'language'];
  }

  // shouldComponentUpdate(nextProps) {
  //   return true;
  // }

  render() {
    // console.log('====================================');
    const { filters, aggs, disableExpertBaseFilter } = this.props;
    const keys = this.keys;

    return (
      <div className={styles.searchFilter}>
        <div className={styles.filter}>

          {/* ------ 过滤条件 ------ */}

          {filters && Object.keys(filters).length > 0 &&
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}>
              <FM id="com.search.filter.Filters" defaultMessage="Filters:" />
            </span>
            <ul className={styles.filterItems}>
              {
                Object.keys(filters).map((key) => {
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

          {/* ------ 搜索范围 / Expert Base ------ */}

          {!disableExpertBaseFilter && expertBases &&
          <div className={classnames(styles.filterRow, styles.range)}>
            <span className={styles.filterTitle}>
              <FM id="com.search.filter.searchRange" defaultMessage="Search Range:" />
            </span>
            <ul className={styles.filterItems}>
              {expertBases.map((eb) => {
                const props = {
                  key: eb.id,
                  className: styles.filterItem,
                  onChange: () => this.onExpertBaseChange(eb.id, eb.name),
                  checked: filters.eb && (filters.eb.id === eb.id),
                };
                return (
                  <CheckableTag {...props}>
                    {eb.name}
                  </CheckableTag>
                );
              })}
            </ul>
          </div>
          }

          {keys && keys.length > 0 && aggs && keys.map((key, index) => {
            const aggss = aggs.filter(a => (a.name === key));
            const agg = aggss && aggss.length > 0 && aggss[0];
            const aggcfg = AggConfig[key];
            // console.log('>>__++__+_+:::::', key, aggcfg, agg);

            if (!agg // invalid
              || (agg.name === sysconfig.SearchFilterExclude) // TODO old skipper
              || filters[agg.name] // filter out already selected.
              || !agg.items || agg.items.length === 0 // if agg is empty
            ) {
              return false;
            }

            return (
              <div className={classnames(
                styles.filterRow, styles.range, (index === aggs.length - 1) ? 'last' : '')
              } key={agg.name}>
                <span className={styles.filterTitle}>
                  <FM id={`com.search.filter.label2.${agg.name}`}
                      defaultMessage={agg.name} />:
                </span>
                <ul>
                  {agg.items.slice(0, 12).map((item) => {
                    const termLabel = aggcfg.render
                      ? aggcfg.render(item)
                      : item.term;

                    if (!termLabel) {
                      return false;
                    }
                    const onChange = checked =>
                      this.onFilterChange(agg.name, item.term, checked, item.count);

                    const itemKey = `${agg.name}.${item.term}`;
                    return (
                      <CheckableTag
                        key={itemKey}
                        className={classnames(styles.filterItem, 'label')}
                        checked={filters[agg.name] === item.term}
                        onChange={onChange}
                      >{termLabel} (<span
                        className={classnames(styles.filterCount, 'label-count')}>{item.count}</span>)
                      </CheckableTag>
                    );
                  })}
                </ul>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
}

SearchFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  disableExpertBaseFilter: PropTypes.bool,
};

