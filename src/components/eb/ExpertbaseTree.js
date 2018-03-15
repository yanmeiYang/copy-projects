import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, routerRedux } from 'engine';
import { system } from 'core';
import { queryString } from 'utils';
import { Maps } from 'utils/immutablejs-helpers';
import AddEBMenuItem from './menuitem/AddEBMenuItem';
import HierarchyTree from "components/hierarchy/HierarchyTree";

@connect(({ app, expertbaseTree }) => ({ app, expertbaseTree }))
export default class ExpertbaseTree extends Component {

  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {};

  state = {
    fatherId: [],
  };

  componentDidMount() {
    this.props.dispatch({ type: 'expertbaseTree/getTreeData' });
  }

  actionMenuConfig = [
    {
      key: "create", label: "新建", callbackParent: this.switch,
      component: AddEBMenuItem,
    },
    { key: "edit", label: "编辑", icon: "edit", component: AddEBMenuItem },
    { key: "move", label: "移动", icon: "select" },
    {
      key: "del", label: "删除", icon: "delete", onClick: () => {
        console.log('newnewnew')
      }
    },
  ];

  // //todo 增加org,禁止取消选择
  // onSelect = (selectedKeys, info) => {
  //   const { dispatch, callbackParent } = this.props;
  //   if (selectedKeys.length > 0) {
  //     if (info.selectedNodes[0] && info.selectedNodes[0].props) {
  //       const selectedInfo = {
  //         id: selectedKeys[0],
  //         name: info.selectedNodes[0].props.dataRef.name_zh,
  //       };
  //       const params = queryString.stringify({ id: selectedInfo.id, name: selectedInfo.name });
  //       dispatch(routerRedux.push({ pathname: '/eb', search: `?${params}` }));
  //       callbackParent && callbackParent(selectedInfo);
  //     }
  //     this.setState({ fatherId: selectedKeys });
  //   }
  // };

  // onLoadData = (treeNode) => {
  //   // TODO 改成回传选中的id，父组件发请求(新的api)，改变原数据，重新渲染。
  //   return new Promise((resolve) => {
  //     console.log('loaddata', treeNode.props);
  //     if (treeNode.props.childs) {
  //       resolve();
  //       return;
  //     }
  //     this.props.dispatch({
  //       type: 'magOrg/getChildren',
  //       payload: {
  //         ids: [treeNode.props.eventKey],
  //       },
  //     }).then((data) => {
  //       // TODO 这里的改变方式，应该可以用在拖拽处，直接改变数据
  //       treeNode.props.dataRef.childs = data;
  //       this.setState({
  //         treeData: [...this.state.treeData],
  //       });
  //       resolve();
  //     });
  //   });
  // };

  render() {
    const { onClick, expertbaseTree } = this.props;
    const treeData = expertbaseTree && expertbaseTree.get('treeData');
    return (
      <HierarchyTree
        data={treeData}
        onClick={onClick}
        menuConfig={this.actionMenuConfig}
      />
    )
  }
}
