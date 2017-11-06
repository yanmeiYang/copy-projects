/**
 * Created by Administrator on 2017/8/9.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Tag, TreeSelect } from 'antd';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import styles from './DomainSelector.less';

const { CheckableTag } = Tag;
const { TreeNode } = TreeSelect;

@connect()
export default class DomainSelector extends PureComponent {
  static propTypes = {
    domains: PropTypes.array,
    currentDomain: PropTypes.string,
    onChange: PropTypes.func,
  };

  domainChanged = (domain) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(domain);
    }
  };

  render() {
    const { domains, currentDomain } = this.props;
    if (!domains) {
      return null;
    }
    // const Domains = sysconfig.Map_HotDomains;
    // let i = 0;
    // const arr = [];
    // Domains.map((domain1) => {
    //   domainIds[i] = domain1.id;
    //   if (domainIds.length === 0) {
    //     arr[i] = false;
    //   }
    //   i += 1;
    //   return true;
    // });
    // let m = 0;
    console.log('current is : ', currentDomain);
    return (
      <div className={styles.filterWrap}>
        <div className={styles.filter}>
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}><span>Most Influential Scholars:</span></span>
            <ul>
              {domains.map((domain) => {
                return (
                  <CheckableTag
                    key={domain.id}
                    className={styles.filterItem}
                    checked={currentDomain === domain.id}
                    value={domain.id}
                  ><span onClick={this.domainChanged.bind(this, domain)}>{domain.name}</span>
                  </CheckableTag>
                );
              })}
            </ul>
          </div>
        </div>

        {/*
        <div className={styles.filter}>
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}><span>Range:</span></span>
            <ul>
              <CheckableTag className={styles.filterItem} checked={this.state.rangeChecks[0]}>
                  <span role="presentation" onClick={this.showRange.bind(this, '0')}
                        value="0">ALL</span>
              </CheckableTag>
              <CheckableTag
                className={styles.filterItem}
                checked={that.state.rangeChecks[1]}>
                  <span role="presentation"
                        onClick={this.showRange.bind(that, '1')}>ACM Fellow</span>
              </CheckableTag>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.rangeChecks[2]}><span role="presentation"
                                                                      onClick={this.showRange.bind(that, '2')}>IEEE Fellow</span></CheckableTag>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.rangeChecks[3]}><span role="presentation"
                                                                      onClick={this.showRange.bind(that, '3')}>华人</span></CheckableTag>
            </ul>
          </div>
          <div className={styles.filterRow}>
            <span className={styles.filterTitle}><span>H-index:</span></span>
            <ul>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.numberChecks[4]}><span role="presentation"
                                                                       onClick={this.showNumber.bind(that, '4')}>ALL</span></CheckableTag>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.numberChecks[3]}><span role="presentation"
                                                                       onClick={this.showNumber.bind(that, '3')}>TOP500</span></CheckableTag>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.numberChecks[0]}><span role="presentation"
                                                                       onClick={this.showNumber.bind(that, '0')}>TOP200</span></CheckableTag>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.numberChecks[2]}><span role="presentation"
                                                                       onClick={this.showNumber.bind(that, '2')}>TOP100</span></CheckableTag>
              <CheckableTag className={styles.filterItem}
                            checked={that.state.numberChecks[1]}><span role="presentation"
                                                                       onClick={this.showNumber.bind(that, '1')}>TOP50</span></CheckableTag>
            </ul>
          </div>
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
