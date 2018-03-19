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

  testModify = () => {
    // test node
    const node = { id: '5a9f9c307e96b5460dc7e403', name: '测试改掉', name_zh: '测试改掉' };
    this.props.dispatch({ type: 'expertbaseTree/updateNode', payload: { node } });
  };

  render() {
    const { onItemClick, selected, expertbaseTree } = this.props;
    const treeData = expertbaseTree && expertbaseTree.get('treeData');
    // console.log('[datadata] 8888 render ExpertbaseTree', selected, selected, selected);
    return (
      <>
        <button onClick={this.testModify}>TEST</button>

        <HierarchyTree
          data={treeData}
          selected={selected}
          onItemClick={onItemClick}
          menuConfig={this.actionMenuConfig}
        />
      </>
    )
  }
}
