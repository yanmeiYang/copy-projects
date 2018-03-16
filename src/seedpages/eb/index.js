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
import ExpertbaseTree from 'components/eb/ExpertbaseTree';
import styles from './index.less';
import helper from 'helper';
import { Maps } from "utils/immutablejs-helpers";


@connect(({ app, expertbaseTree, magOrg, loading }) => ({ app, expertbaseTree, magOrg, loading }))
export default class HierarchyExpertBasePage extends Component {

  constructor(props) {
    super(props);
    this.children = Map(); // TODO what's this?
  }

  state = {
    id: null, // sysconfig.ExpertBase, // 默认选中改成所有的第一个。
    eb: null,

    childrenId: null, // TODO 改成从左边获取。
    parentId: null, // TODO 改成从左边获取。
  };

  componentWillMount() {
    const { id } = helper.getSearchParams(this.props);
    if (id) {
      this.setState({ id });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { id } = helper.getSearchParams(nextProps);
    if (this.state.id !== id) {
      if (id) {
        this.setState({ id });
        this.getEB(id);
      } else {
        this.setState({ id: null, eb: null })
      }
    }
    // console.log('------------------------------------', id); // TODO ???????????
    // if (nextProps.magOrg.get('initData') !== null) {
    //   this.getChildrenId(this.state.id, nextProps.magOrg);
    // }
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.props.magOrg.get('initData') !== null) && (this.state.id !== nextState.id)) {
      this.getChildrenId(nextState.id, nextProps.magOrg);
    }
    return true;
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

  onItemClick = (id, item) => {
    const { dispatch } = this.props;
    const params = queryString.stringify({ id: id });
    dispatch(routerRedux.push({ pathname: '/eb', search: `?${params}` }));
  };

  onTreeReady = (data) => {
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
              this.setState({ eb: firstItem })
            }
          });
      }
    }
  };

  render() {
    const { id, eb, childrenId, parentId } = this.state;
    eb && console.log('eb is ', eb.toJS());
    const [name, name_zh, desc, desc_zh, created_time] =
      Maps.getAll(eb, "name", "name_zh", "desc", "desc_zh", "created_time");
    return (
      <Layout searchZone={[]} contentClass={styles.ebIndex} showNavigator={false}>
        <div className={styles.container}>
          <div className={styles.treeBlock}>

            <ExpertbaseTree
              onItemClick={this.onItemClick}
              onReady={this.onTreeReady}
              selected={id}
            />

          </div>

          <div className={styles.rightBlock}>

            <div className={styles.ebBasicInfo}>
              {eb && <>
                <h1>
                  {name}
                  {name_zh && <span className={styles.subTitle}>（{name_zh}）</span>}
                </h1>
                <div className={styles.infoLine}>
                  <span>创建时间：
                    {created_time && <FD value={created_time} />}
                  </span>
                  {eb.get("creator") && <span>创建者：{eb.get("creator")}</span>}
                </div>
                <div className={styles.desc}>{desc}</div>
                <div className={styles.desc}>{desc_zh}</div>
              </>}
            </div>

            <ExpertBase
              query="-" offset="0" size="20" expertBaseId={id}
              currentBaseChildIds={childrenId}
              currentBaseParentId={parentId} />
          </div>

        </div>
      </Layout>
    );
  }
}
