/**
 * Created by Administrator on 2017/8/9.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'engine';
import { Button, Tag, TreeSelect } from 'antd';
import { MapFilterRanges, MapFilterHindexRange } from './utils/map-utils';
import styles from './DomainSelector.less';

const { CheckableTag } = Tag;
const { TreeNode } = TreeSelect;

@connect()
export default class MapFilter extends PureComponent {
  static propTypes = {
    // domains: PropTypes.array,
    // currentDomain: PropTypes.string,
    onRangeChange: PropTypes.func,
    onHindexRangeChange: PropTypes.func,
  };

  state = {
    current: 'all',
    currentHindex: 'all',
  };

  onRangeChange = (range) => {
    this.setState({ current: range });
    if (this.props.onRangeChange) {
      this.props.onRangeChange(range);
    }
  };

  onHindexRangeChange = (range) => {
    this.setState({ currentHindex: range });
    if (this.props.onHindexRangeChange) {
      this.props.onHindexRangeChange(range);
    }
  };


  render() {
    const { current, currentHindex } = this.state;
    const { MapFilterRange } = this.props;

    return (
      <div className={styles.filterWrap}>
        <div className={styles.filter}>
          {MapFilterRange &&
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}>
              <span>Range:</span>
            </span>
            <ul>
              {MapFilterRanges.map(range => (
                <CheckableTag
                  key={range.key}
                  className={styles.filterItem}
                  checked={current === range.key}>
                  <span onClick={this.onRangeChange.bind(this, range.key)}>
                    {range.label}
                  </span>
                </CheckableTag>
              ))}
            </ul>
          </div>}
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}>
              <span>H-index:</span>
            </span>
            <ul>
              {MapFilterHindexRange.map(range => (
                <CheckableTag
                  key={range.key}
                  className={styles.filterItem}
                  checked={currentHindex === range.key}>
                  <span onClick={this.onHindexRangeChange.bind(this, range.key)}>
                    {range.label}
                  </span>
                </CheckableTag>
              ))}
            </ul>
          </div>
        </div>


        {/*
        <div className={styles.filter}>

        </div>


          <TreeSelect
          className={styles.treeSelect}
          style={{ width: 280, display: 'none' }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 425, overflow: 'auto' }}
          placeholder={<b style={{ color: '#08c' }}>Domains</b>}
          treeDefaultExpandAll
          >
          <TreeNode value="parent 1-0" title="Theory" key="1-0">
          {Domains.map((domain) => {
            if (domain.name === 'Theory' || domain.name === 'Multimedia' || domain.name === 'Security'
              || domain.name === 'Software Engineering' || domain.name === 'Computer Graphics') {
              return (
                <TreeNode value={domain.id}
                          title={<span role="presentation"
                                       onClick={this.domainChanged.bind(this, domain)}>{domain.name}</span>}
                          key={domain.id} />
              );
            }
            return true;
          })
          }
          </TreeNode>
          <TreeNode value="parent 1-1" title="System" key="1-1">
          {Domains.map((domain) => {
            if (domain.name === 'Database' || domain.name === 'System' || domain.name === 'Computer Networking') {
              return (
                <TreeNode value={domain.id}
                          title={<span role="presentation"
                                       onClick={this.domainChanged.bind(this, domain)}>{domain.name}</span>}
                          key={domain.id} />
              );
            }
            return true;
          })
          }
          </TreeNode>
          <TreeNode value="parent 1-2" title="Artificial Intelligence" key="1-2">
          {Domains.map((domain) => {
            if (domain.name === 'Data Mining' || domain.name === 'Machine Learning' || domain.name === 'Artificial Intelligence'
              || domain.name === 'Web and Information Retrieval' || domain.name === 'Computer Vision'
              || domain.name === 'Human-Computer Interaction' || domain.name === 'Natural Language Processing') {
              return (
                <TreeNode value={domain.id}
                          title={<span role="presentation"
                                       onClick={this.domainChanged.bind(this, domain)}>{domain.name}</span>}
                          key={domain.id} />
              );
            }
            return true;
          })
          }
          </TreeNode>
          </TreeSelect>
          */}
      </div>
    );
  }
}
