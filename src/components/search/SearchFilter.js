import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs, Tag } from 'antd';
import styles from './SearchFilter.less';
import { sysconfig } from '../../systems';
import { classnames } from '../../utils';

const { CheckableTag } = Tag;

const expertBases = sysconfig.ExpertBases;

const labelMap = { 'H-Index': 'h指数', Language: '语言', Location: '国家' };

function showChineseLabel(enLabel) {
  if (sysconfig.Locale === 'zh') {
    const cnLabel = labelMap[enLabel];
    return !cnLabel ? enLabel : cnLabel;
  } else {
    return enLabel;
  }
}

const labelMap2 = { 'h-index': 'h指数', language: '语言', nationality: '国家' };

function showChineseLabel2(enLabel) {
  if (sysconfig.Locale === 'zh') {
    const cnLabel = labelMap2[enLabel];
    return !cnLabel ? enLabel : cnLabel;
  } else {
    return enLabel;
  }
}

/**
 * SearchFilter Component
 */
class SearchFilter extends React.PureComponent {
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

          {sysconfig.SHOW_ExpertBase && expertBases &&
          <div className={classnames(styles.filterRow, styles.range)}>
            <span className={styles.filterTitle}>搜索范围:</span>
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
                      {/* TODO Show Numbers */}
                    </CheckableTag>
                  );
                })
              }
            </ul>
          </div>}

          {filters && Object.keys(filters).length > 0 &&
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}>过滤条件:</span>
            <ul className={styles.filterItems}>
              {
                Object.keys(filters).map((key) => {
                  const label = key === 'eb' ? filters[key].name : `${showChineseLabel2(key)}: ${filters[key].split('#')[0]}`;// special
                  // console.log('- - ', label);
                  const newFilters = key === 'eb' ? filters[key] : filters[key].split('#')[1];
                  return (
                    <Tag
                      className={styles.filterItem}
                      key={key}
                      closable={key !== 'eb'}
                      afterClose={() => this.onFilterChange(key, newFilters, false)}
                      color="blue"
                    >{label}</Tag>
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
                const cnLabel = showChineseLabel(agg.label);
                return (
                  <div
                    className={classnames(styles.filterRow, (index === aggs.length - 1) ? 'last' : '')}
                    key={agg.type}
                  >
                    <span className={styles.filterTitle}>{cnLabel}:</span>
                    <ul>
                      {agg.item.slice(0, 12).map((item) => {
                        return (
                          <CheckableTag
                            key={`${item.label}_${agg.label}`}
                            className={styles.filterItem}
                            checked={filters[agg.label] === item.label}
                            onChange={checked => this.onFilterChange(agg.type, item.label, checked, item.count)}
                          >
                            {item.label} (<span
                            className={styles.filterCount}>{item.count}</span>)
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

export default connect()(SearchFilter);
