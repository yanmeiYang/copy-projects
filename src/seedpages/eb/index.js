/**
 * Created by yangyanmei on 18/2/6.
 * Refactor by bogao on 18/03/06.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Map } from 'immutable';
import hole from 'core/hole';
import { Spinner } from 'components';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { classnames } from 'utils';
import { createHiObj } from 'utils/hiobj';
import { Maps } from 'utils/immutablejs-helpers';
import ExpertBase from 'components/expert-base/ExpertBase';
import HierarchyTree from 'components/hierarchy/HierarchyTree';
import styles from './index.less';
import queryString from "query-string";

const tc = applyTheme(styles); // TODO 不用这个了.

@connect(({ app, magOrg, loading, conflicts }) => ({ app, magOrg, loading, conflicts }))
export default class HierarchyExpertBasePage extends Component {

  constructor(props) {
    super(props);
    this.children = Map();
  }

  state = {
    id: sysconfig.ExpertBase, // TODO 这里不通用。默认选中改成所有的第一个。
    name: sysconfig.ExpertBaseName, // 'F06 人工智能', // TODO 使用id去获取。
    childrenId: null, // TODO 改成从左边获取。
    parentId: null, // TODO 改成从左边获取。
    showPersonList: false, // ?
  };

  componentWillMount() {
    const { location } = this.props;
    const { id, name } = queryString.parse(location.search); // TODO remove name.
    // const { id, name } = this.props.match.params;
    if (id && name) {
      this.setState({ id, name });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.magOrg.get('initData') !== null) {
      this.getChildrenId(this.state.id, nextProps.magOrg);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.props.magOrg.get('initData') !== null) && (this.state.id !== nextState.id)) {
      this.getChildrenId(nextState.id, nextProps.magOrg);
    }
  }

  getChildrenId = (id, dataSource) => {
    const initData = dataSource && dataSource.get('initData') || [];
    const data = createHiObj(initData);
    const items = data.get(id);
    this.matchData(items);
  };

  matchData = (data) => {
    if (data && data.childs) {
      this.children = Map().withMutations((map) => {
        data.childs.forEach((item) => {
          if (item.childs) {
            // TODO 这个地方不能写递归，不然最外层执行时会把this.children置空
            item.childs.forEach((itemChilds) => {
              if (!itemChilds.childs) {
                map.set(itemChilds.id, itemChilds.name_zh);
              }
            });
          } else if (item) {
            map.set(item.id, item.name_zh);
          }
        });
      });
      this.setState({ childrenId: this.children, showPersonList: true });
    } else {
      this.setState({ childrenId: null, showPersonList: true });
    }
    if (data && data.parents) {
      this.setState({ childrenId: null, showPersonList: true, parentId: data.parents[0] });
    }
  };

  getSelectedNode = (data) => {
    this.setState({
      id: data.id,
      name: data.name,
    });
  };

  render() {
    const load = this.props.loading.effects['magOrg/getOrganizationByIDs'];
    const { id, name, childrenId, showPersonList, parentId } = this.state;

    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <div className={styles.nsfcIndexPage}>
          <div className={styles.treeBlock}>
            <Spinner loading={load} />

            <HierarchyTree callbackParent={this.getSelectedNode} defaultSelectedKeys={id} />

          </div>
          {showPersonList &&
          <div className={styles.rightBlock}>
            <ExpertBase query="-" offset="0" size="20" expertBaseId={id} expertBaseName={name}
                        currentBaseChildIds={childrenId} currentBaseParentId={parentId} />
          </div>
          }
        </div>
      </Layout>
    );
  }
}
