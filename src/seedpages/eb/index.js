/**
 * Created by yangyanmei on 18/2/6.
 * Refactor by bogao on 18/03/06.
 */
import React, { Component } from 'react';
import { connect, routerRedux } from 'engine';
import { Map, fromJS } from 'immutable';
import { Spinner } from 'components';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { classnames, queryString } from 'utils';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { createHiObj } from 'utils/hiobj';
import ExpertBase from 'components/expert-base/ExpertBase';
import EBBasicInfo from 'components/eb/EBBasicInfo';
import ExpertbaseTree from 'components/eb/ExpertbaseTree';
import styles from './index.less';
import helper from 'helper';
import hierarchy from 'helper/hierarchy';
import { Maps } from "utils/immutablejs-helpers";

@connect(({ app, expertbaseTree, loading }) => ({ app, expertbaseTree, loading }))
export default class HierarchyExpertBasePage extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    id: null, // sysconfig.ExpertBase, // 默认选中改成所有的第一个。
    eb: null,

    childrenId: null, // TODO 改成从左边获取。
  };

  componentWillMount() {
    // TODO 首页url中没有参数，怎么办
    const { id } = helper.getSearchParams(this.props);
    if (id) {
      this.setState({ id });
      this.getChilds(id, this.props);
    } else {
      // this.setState({ id: sysconfig.ExpertBase });
      // this.getChilds(sysconfig.ExpertBase, this.props);
    }



  }

  componentWillReceiveProps(nextProps) {
    const { id } = helper.getSearchParams(nextProps);
    if (this.state.id !== id) {
      if (id) {
        this.setState({ id });
        this.getEB(id);
        this.getChilds(id, nextProps);
      } else {
        // this.getChilds(this.state.id, nextProps);
        this.setState({ id: null })
      }

    }
    // this.getChilds(id, nextProps);
    // console.log('------------------------------------', id); // TODO ???????????
    // if (nextProps.magOrg.get('initData') !== null) {
    //   this.getChildrenId(this.state.id, nextProps.magOrg);
    // }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.id !== nextState.id) {
      this.setState({ id: nextState.id });
      // this.getChilds(nextState.id, nextProps);
    }
    return true;
  }

  getChilds = (id, props) => {
    const testData = [];
    const { expertbaseTree } = props;
    if (expertbaseTree.get('treeData') !== null) {
      let path = hierarchy.findPath(expertbaseTree.get('treeData'), expertbaseTree.get('treeIndex'), id);
      path = ['treeData', ...path];
      expertbaseTree.withMutations((map) => {
        const firstLevel = map.getIn(path).get('childs');
        if (firstLevel) {
          firstLevel.toJS().forEach((item) => {
            let path2 = hierarchy.findPath(expertbaseTree.get('treeData'), expertbaseTree.get('treeIndex'), item.id);
            path2 = ['treeData', ...path2];
            const secondLevel = map.getIn(path2).get('childs');
            if (secondLevel) {
              testData.push(...secondLevel.toJS())
            }
          });
          testData.push(...firstLevel.toJS())
        }
        this.setState({ childrenId: testData });
      });
    }
  };

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
  };

  onItemClick = (id, item) => {
    const { dispatch } = this.props;
    const params = queryString.stringify({ id: id });
    dispatch(routerRedux.push({ pathname: '/eb', search: `?${params}` }));
  };

  onTreeReady = (data) => {
    console.log('on tree ready', );
    this.getEB(this.state.id);
  };

  getEB = (id) => {
    const { dispatch, expertbaseTree } = this.props;
    if (expertbaseTree) {
      const treeData = expertbaseTree.get('treeData');
      let firstItem;
      const ebid = id || treeData && treeData.size > 0 && treeData.get(0) && treeData.get(0).get('id');
      if (ebid) {
        dispatch({ type: 'expertbaseTree/getExpertBases', payload: { ids: [ebid] } })
          .then((items) => {
            if (items && items.length > 0) {
              firstItem = fromJS(items[0]);
              this.setState({ eb: firstItem, id: ebid });
              this.getChilds(ebid, this.props);
            }
          });
      }
    }
  };

  render() {
    const { id, eb, childrenId } = this.state;

    console.log('render -----------', eb);
    return (
      <Layout searchZone={[]} contentClass={styles.ebIndex} showNavigator={true}>
        <div className={styles.container}>

          <div className={styles.treeBlock}>

            <ExpertbaseTree
              onItemClick={this.onItemClick}
              onReady={this.onTreeReady}
              selected={id}
            />

          </div>

          <div className={styles.rightBlock}>

            <EBBasicInfo eb={eb} />

            <ExpertBase
              query="-" offset="0" size="20" expertBaseId={id}
              currentBaseChildIds={childrenId}
              currentBaseParentId={eb && eb.get("parents") && eb.get("parents").get(0)}
              expertBaseName={eb && eb.get("name_zh")}
            />

          </div>

        </div>
      </Layout>
    );
  }
}
