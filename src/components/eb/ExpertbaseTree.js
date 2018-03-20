import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'engine';
import { AddEBMenuItem, DeleteMenuItem, MoveEBMenuItem } from './menuitem';
import HierarchyTree from "components/hierarchy/HierarchyTree";
import { imCompare } from 'utils/compare';

@connect(({ app, expertbaseTree }) => ({ app, expertbaseTree }))
export default class ExpertbaseTree extends Component {

  static propTypes = {
    onItemClick: PropTypes.func,
    onReady: PropTypes.func,
    selected: PropTypes.string,
  };

  static defaultProps = {};

  state = {};

  componentDidMount() {
    this.props.dispatch({ type: 'expertbaseTree/getTreeData' });
  }

  componentDidUpdate(prevProps) {
    if (!imCompare(prevProps, this.props, "expertbaseTree", "treeData")) {
      const { onReady, expertbaseTree } = this.props;
      const data = expertbaseTree && expertbaseTree.get('treeData');
      onReady && onReady(data);
    }
  }

  actionMenuConfig = [
    {
      key: "create",
      label: "新建",
      type: 'create',
      callbackParent: this.switch,
      component: AddEBMenuItem
    },
    { key: "edit", label: "编辑", type: 'edit', icon: "edit", component: AddEBMenuItem },
    { key: "move", label: "移动", icon: "select", component: MoveEBMenuItem },
    { key: "del", label: "删除", component: DeleteMenuItem },
  ];

  topMenuConfig = [
    {
      key: "create",
      label: "新建",
      type: 'create',
      callbackParent: this.switch,
      component: AddEBMenuItem
    },
  ];

  render() {
    const { onItemClick, selected, expertbaseTree } = this.props;
    const treeData = expertbaseTree && expertbaseTree.get('treeData');
    // console.log('[datadata] 8888 render ExpertbaseTree', selected, selected, selected);
    return (
      <HierarchyTree
        data={treeData}
        selected={selected}
        onItemClick={onItemClick}
        menuConfig={this.actionMenuConfig}
        topMenuConfig={this.topMenuConfig}
      />
    )
  }
}
