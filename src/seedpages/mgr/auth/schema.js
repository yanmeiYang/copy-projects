import React, { Component } from 'react';
import { connect, routerRedux, withRouter } from 'engine';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { Tree } from 'antd';
import styles from './schema.less';

const TreeNode = Tree.TreeNode;

// TODO Combine search and uniSearch into one.
@connect(({ app, loading, mgr }) => ({ app, loading, mgr }))
// @Auth
// @withRouter
export default class Schema extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  state = {
    expandedKeys: null,
  };

  componentDidMount() {
    this.props.dispatch({ type: 'mgr/getGlobalSchema', payload: {} });
  }

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  onExpandAllClick = () => {
    this.getKey(this.schemaOfFunction, this.arrOfKeys);
    this.getKey(this.schemaOfScoped, this.arrOfKeys);
    this.setState({
      expandedKeys: this.arrOfKeys,
    });
  };

  onCollapseAllClick = () => {
    this.setState({
      expandedKeys: [],
    });
  };

  getKey = (data, arr) => {
    return data.map((item) => {
      if (item.children) {
        this.getKey(item.children, arr);
      }
      arr.push(item.title);
      return arr;
    });
  };

  arrOfKeys = [];
  schemaOfFunction;
  schemaOfScoped;

  i18n = (treeNode) => {
    let title;
    const titleExisted = treeNode && treeNode.title;
    title = sysconfig.Locale === 'zh' ? treeNode.title_zh : treeNode.title;
    if (!titleExisted) {
      title = sysconfig.Locale === 'zh' ? treeNode.title : treeNode.title_zh;
    }
    return titleExisted ? `(${title})` : '';
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title = item.title || item.title_zh;
      if (item.children) {
        return (
          <TreeNode title={`${title} ${this.i18n(item)}`} key={item.title || item.title_zh}
                    dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={`${title} ${this.i18n(item)}`} key={item.title || item.title_zh} />;
    });
  };

  render() {
    const { mgr } = this.props;
    const schemaData = mgr && mgr.globalSchema && mgr.globalSchema.items &&
      mgr.globalSchema.items[0] && mgr.globalSchema.items[0];
    const functionData = schemaData && schemaData.function;
    const schemaOfFunction = [];
    if (functionData) {
      schemaOfFunction.push(functionData);
    }
    const scopedData = schemaData && schemaData.scoped;
    const schemaOfScoped = [];
    if (scopedData) {
      schemaOfScoped.push(scopedData);
    }
    const { expandedKeys } = this.state;
    this.schemaOfFunction = schemaOfFunction;
    this.schemaOfScoped = schemaOfScoped;
    return (
      <div key={Math.random()}>
        <button className={styles.expandAll} onClick={this.onExpandAllClick}>Expand All</button>
        <button onClick={this.onCollapseAllClick}>Collapse All</button>
        {schemaOfFunction.length > 0 && <Tree
          showLine
          defaultExpandAll
          expandedKeys={expandedKeys}
          onSelect={this.onSelect}
        >
          {schemaOfFunction && this.renderTreeNodes(schemaOfFunction)}
        </Tree>}
        {schemaOfScoped.length > 0 && <Tree
          showLine
          defaultExpandAll
          expandedKeys={expandedKeys}
          onSelect={this.onSelect}
        >
          {schemaOfScoped && this.renderTreeNodes(schemaOfScoped)}
        </Tree>}
      </div>
    );
  }
}
