import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tree, Icon } from 'antd';
import { Link } from 'dva/router';
import { system } from 'core';
import RightZone from './rightZone';
import styles from './index.less';
import { Maps } from 'utils/immutablejs-helpers';
import { queryString } from 'utils';

const { TreeNode } = Tree;
@connect(({ app, magOrg }) => ({ app, magOrg }))
export default class ManagermentOrg extends Component {
  state = {
    fatherId: [],
    showRightZone: '',
    menu: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'magOrg/getOrganizationByIDs',
      payload: {
        ids: [],
        query: '',
        offset: 0,
        size: 100,
        searchType: 'all',
        filters: { terms: { system: [system.System] } },
        expertbase: ['name', 'name_zh', 'logo', 'desc', 'type', 'stats',
          'created_time', 'updated_time', 'is_deleted', 'parents', 'system'],
      },
    });
  }

  //todo 增加org,禁止取消选择
  onSelect = (selectedKeys, info) => {
    const { dispatch, callbackParent } = this.props;
    if (selectedKeys.length > 0) {
      if (info.selectedNodes[0] && info.selectedNodes[0].props) {
        const selectedInfo = {
          id: selectedKeys[0],
          name: info.selectedNodes[0].props.dataRef.name_zh,
        };
        const params = queryString.stringify({ id: selectedInfo.id, name: selectedInfo.name });
        dispatch(routerRedux.push({ pathname: '/eb', search: `?${params}` }));
        callbackParent && callbackParent(selectedInfo);
      }
      this.setState({ fatherId: selectedKeys });
    }
  };
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
  // 控制rightzone是否显示
  menuIsShow = (data) => {
    if (!data) {
      this.setState({ showRightZone: '', menu: false });
    } else {
      this.setState({ menu: data });
    }
  };

  showZone = (key) => {
    this.setState({ showRightZone: key });
  };

  hiddenZone = () => {
    if (!this.state.menu) {
      this.setState({ showRightZone: '', menu: true });
    }
  };

  sortNumber = (a, b) => {
    return a.name.localeCompare(b.name);
  };

  // 处理数据形成树
  renderTreeNodes = (orgs) => {
    const { showRightZone } = this.state;
    const { defaultSelectedKeys } = this.props;
    return orgs.map((org) => {
      return (
        <TreeNode
          key={org.id} dataRef={org}
          title={
            <div className={styles.treeTitle}
                 onMouseMove={this.showZone.bind(this, org.id)}
                 onMouseLeave={this.hiddenZone.bind(this, org.id)}>
              <div className={styles.treeNode}>
                {org.name_zh}
                {org.childs &&
                <span> (
                  {defaultSelectedKeys === org.id &&
                  <span className={styles.childrenNumActive}>{org.childs.length}</span>
                  }
                  {defaultSelectedKeys !== org.id &&
                  <span className={styles.childrenNum}>{org.childs.length}</span>
                  }
                  )
                </span>}
              </div>
              <div className={styles.iconLeft}>
                {showRightZone === org.id &&
                <RightZone fatherId={[org.id]} changemenu={this.menuIsShow} />
                }
              </div>
            </div>
          }
        >
          {
            org.childs && this.renderTreeNodes(org.childs.sort(this.sortNumber))
          }
        </TreeNode>
      );
    });
  };

  render() {
    const [allOrgs] = Maps.getAll(this.props.magOrg, 'allOrgs');
    return (
      <div className={styles.magOrgBlock}>
        {allOrgs &&
        <Tree
          showLine
          onSelect={this.onSelect}
          // draggable
          defaultSelectedKeys={[this.props.defaultSelectedKeys]}
          defaultExpandAll
        >
          {this.renderTreeNodes(allOrgs)}
        </Tree>}
      </div>
    );
  }
}
