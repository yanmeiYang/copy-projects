/**
 * Created by yangyanmei on 18/2/6.
 * Refactor by bogao on 18/03/06.
 */
import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Map } from 'immutable';
import hole from 'core/hole';
import { Spinner } from 'components';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { classnames, queryString } from 'utils';
import { createHiObj } from 'utils/hiobj';
import { Maps } from 'utils/immutablejs-helpers';
import ExpertBase from 'components/expert-base/ExpertBase';
import ExpertbaseTree from 'components/eb/ExpertbaseTree';
import styles from './index.less';
import helper from 'helper';

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
  };

  componentWillMount() {
    const { id, name } = helper.getSearchParams(this.props);

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

  onTreeReady = () => {
    console.log('8889 onTreeReady',);
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
      this.setState({ childrenId: this.children });
    } else {
      this.setState({ childrenId: null });
    }
    if (data && data.parents) {
      this.setState({ parentId: data.parents[0] });
    } else {
      this.setState({ parentId: null });
    }
  };

  getSelectedNode = (id, item) => {
    const { dispatch } = this.props;
    // 应该么？
    this.setState({
      id: id,
      name: `TODO name for ${id}`,
    });

    const params = queryString.stringify({ id: id });
    dispatch(routerRedux.push({ pathname: '/eb', search: `?${params}` }));
  };

  render() {
    const load = this.props.loading.effects['magOrg/getOrganizationByIDs'];
    const { id, name, childrenId, parentId } = this.state;

    return (
      <Layout searchZone={[]} contentClass={styles.ebIndex} showNavigator={false}>
        <div className={styles.nsfcIndexPage}>
          <div className={styles.treeBlock}>
            <Spinner loading={load} />

            <ExpertbaseTree
              onItemClick={this.getSelectedNode}
              onReady={this.onTreeReady}
              selected={id}
              defaultSelectedKeys={id} />

          </div>

          <div className={styles.rightBlock}>
            <ExpertBase query="-" offset="0" size="20" expertBaseId={id} expertBaseName={name}
                        currentBaseChildIds={childrenId} currentBaseParentId={parentId} />
          </div>

        </div>
      </Layout>
    );
  }
}
