/**
 * Created by Administrator on 2017/8/9.
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect, Link } from 'engine';
import { Tag, TreeSelect } from 'antd';
import styles from './DomainSelector.less';

const { CheckableTag } = Tag;
const { TreeNode } = TreeSelect;

@connect()
export default class DomainSelector extends PureComponent {
  static propTypes = {
    domains: PropTypes.array,
    currentDomain: PropTypes.string,
    onDomainSelect: PropTypes.func,
  };

  onDomainClicked = (domain) => {
    const { onDomainSelect } = this.props;
    let cd = domain;
    if (typeof (domain) === 'string') {
      for (const d of this.props.domains) {
        if (d.id === domain) {
          cd = d;
        }
      }
    }
    if (onDomainSelect) {
      onDomainSelect(cd);
    }
  };

  render() {
    const { domainsLabel, domains, currentDomain, type } = this.props;
    if (!domains) {
      return null;
    }
    const hdFlag = (type === 'filter');
    const cdomain = currentDomain ? currentDomain : undefined;
    return (
      <div>
        <Link to={{
          pathname: "/expert-map",
          search: queryString.stringify({ domain: '57a57c640a3ac5e5b97e6f9b' })
        }}>sldkfj</Link>
        {
          hdFlag &&
          <div className={styles.filterWrap}>
            <div className={styles.filter}>
              <div className={styles.filterRow}>
                {domainsLabel &&
                <span className={styles.filterTitle}><span>{domainsLabel}</span></span>}
                <ul>
                  {domains.map((domain) => {
                    return (
                      <CheckableTag
                        key={domain.id}
                        className={styles.filterItem}
                        checked={currentDomain === domain.id}
                        onChange={this.onDomainClicked.bind(this, domain)}
                        value={domain.id}
                      >
                        {domain.name}
                      </CheckableTag>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        }
        {
          !hdFlag &&
          <TreeSelect
            className={styles.treeSelect}
            style={{ width: 280 }}
            dropdownStyle={{ maxHeight: 425, overflow: 'auto' }}
            placeholder={<b style={{ color: '#000000' }}>Choose Domain</b>}
            onChange={this.onDomainClicked}
            value={cdomain}
            treeDefaultExpandAll
          >
            <TreeNode value="parent 1-0" title="Theory" key="1-0">
              {domains.map((domain) => {
                if (domain.name === 'Theory' || domain.name === 'Multimedia' || domain.name === 'Security'
                  || domain.name === 'Software Engineering' || domain.name === 'Computer Graphics') {
                  return (
                    <TreeNode value={domain.id}
                              title={<span role="presentation">{domain.name}</span>}
                              key={domain.id} />
                  );
                }
                return true;
              })
              }
            </TreeNode>
            <TreeNode value="parent 1-1" title="System" key="1-1">
              {domains.map((domain) => {
                if (domain.name === 'Database' || domain.name === 'System' || domain.name === 'Computer Networking') {
                  return (
                    <TreeNode value={domain.id}
                              title={<span role="presentation">{domain.name}</span>}
                              key={domain.id} />
                  );
                }
                return true;
              })
              }
            </TreeNode>
            <TreeNode value="parent 1-2" title="Artificial Intelligence" key="1-2">
              {domains.map((domain) => {
                if (domain.name === 'Data Mining' || domain.name === 'Machine Learning' || domain.name === 'Artificial Intelligence'
                  || domain.name === 'Web and Information Retrieval' || domain.name === 'Computer Vision'
                  || domain.name === 'Human-Computer Interaction' || domain.name === 'Natural Language Processing') {
                  return (
                    <TreeNode value={domain.id}
                              title={<span role="presentation">{domain.name}</span>}
                              key={domain.id} />
                  );
                }
                return true;
              })
              }
            </TreeNode>
          </TreeSelect>
        }
      </div>
    );
  }
}
