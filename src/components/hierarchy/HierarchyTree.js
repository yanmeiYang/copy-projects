/**
 * Created by GaoBo on 2018/03/14.
 */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Tree, Icon } from 'antd';
import { Maps } from 'utils/immutablejs-helpers';
import actionMenu from 'helper/actionmenu';
import styles from './HierarchyTree.less';
import { compare } from "utils/compare";
import ActionMenu from './ActionMenu';

// 具体的某个组件需要在这个的基础上包装一层，加上自定义的部分。

const ActionMenuID = 'ebActionMenu';

export default class HierarchyTree extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: this.getSelectedID(props),
      fatherId: [],
      menu: false,
    };
  }

  static propTypes = {
    // data: PropTypes.object.required, // allow null
    selected: PropTypes.string,
    onItemClick: PropTypes.func,
    menuConfig: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    menuConfig: {}
  };

  componentDidMount() {
    this.menu = actionMenu.init(ActionMenuID);
  }

  componentWillReceiveProps = (nextProps) => {
    // console.log('[datadata]~~~~~~~~~~~~~~~~~~~~~~~', nextProps.selected);
    if (compare(nextProps, this.props, 'data')) {
      this.setState({ selected: this.getSelectedID(nextProps) })
    }
  };

  getSelectedID = (props) => {
    const { selected, data } = props;
    return selected ? selected : data && data.size > 0 && data.get(0) && data.get(0).get('id');
  };

  shouldComponentUpdate(nextProps, nextState) {
    // if (nextState.current != this.state.current) {
    //   return false;
    // }
    //   console.log('>>. ', nextProps.data === this.props.data,
    //     nextProps.data, this.props.data
    //   );
    //   return nextProps.data !== this.props.data;
    return true;
  }

  // TODO 禁止取消选择
  // 目前只取第一个元素
  onSelect = (selectedKeys, info) => {
    const { onItemClick } = this.props;
    const firstID = selectedKeys && selectedKeys.length > 0 && selectedKeys[0];
    let firstItem = info && info.selectedNodes && info.selectedNodes.length > 0
      && info.selectedNodes[0];

    if (onItemClick) {
      onItemClick(firstID, firstItem); // TODO firstItem is bad.
    }

    // this.setState({ fatherId: selectedKeys });// TODO ??

    // if (selectedKeys.length > 0) {
    //   if (info.selectedNodes[0] && info.selectedNodes[0].props) {
    //     const selectedInfo = {
    //       id: selectedKeys[0],
    //       name: info.selectedNodes[0].props.dataRef.name_zh,
    //     };
    //     console.log('=====', this);
    //
    //   }
    // }
  };

  // // 控制rightzone是否显示
  // menuIsShow = (data) => {
  //   if (!data) {
  //     this.setState({ showRightZone: '', menu: false });
  //   } else {
  //     this.setState({ menu: data });
  //   }
  // };

  // showZone = (key) => {
  //   this.setState({ showRightZone: key });
  // };
  //
  // hiddenZone = () => {
  //   if (!this.state.menu) {
  //     this.setState({ showRightZone: '', menu: true });
  //   }
  // };

  sortNumber = (a, b) => {
    // 暂时按照字母顺序排序。
    if (!a) {
      return -1
    }
    if (!b) {
      return 1
    }
    const aa = this.getName(a);
    const bb = this.getName(b);
    return aa.localeCompare(bb);
  };

  getName = (item) => {
    // const lang = sysconfig.Locale;
    const lang = 'zh';
    const [name, name_zh] = Maps.getAll(item, 'name', 'name_zh');
    // here shows how to display a name in system
    let displayName = lang === 'zh' ? name_zh : name;
    if (!displayName) {
      displayName = lang === 'zh' ? name : name_zh;
    }
    return displayName;
  };

  onActionMenuHover = (model, e) => {
    if (!model) {
      console.error('error model is null',);
      return;
    }
    this.menu && this.menu.show(e.target, model);
  };

  // 处理数据形成树
  renderTreeNodes = (orgs) => {
    const { data } = this.props;
    const { selected } = this.state;

    return orgs.map((org) => {
      const [id, childs] = Maps.getAll(org, 'id', 'childs');
      const displayName = this.getName(org);
      const nchilds = childs && childs.size;

      // 什么鬼。。。。👻 我的天哪。
      const nchildsBlock = selected === id
        ? <span className={styles.childrenNumActive}>{nchilds}</span>
        : <span className={styles.childrenNum}>{nchilds}</span>;
      const afterTitle = childs && childs.size > 0 ? <span>({nchildsBlock})</span> : '';

      const title = (
        <div className={styles.line}>
          <div className={styles.highlight}>
            <div className={styles.treeNode}>{displayName} {afterTitle}</div>
          </div>

          <div className={styles.actionIcon}>
            <Icon type="down" onMouseEnter={this.onActionMenuHover.bind(this, org)} />
          </div>

        </div>
      );

      return (
        <Tree.TreeNode key={id} dataRef={org} title={title}>
          {childs && childs.size > 0 && this.renderTreeNodes(childs.sort(this.sortNumber))}
        </Tree.TreeNode>
      );
    });
  };

  render() {
    const { data, menuConfig } = this.props;
    const { selected } = this.state;
    console.log('8888 render HierarchyTree', selected);
    return (
      <div className={styles.hierarchyTree} id={`${ActionMenuID}_ROOT`}>
        {!data && <div> Loading ...</div>}

        {data && [
          <ActionMenu key={0} id={ActionMenuID} config={menuConfig} top={0} />,
          <Tree key={1} onSelect={this.onSelect}
                defaultSelectedKeys={[selected]}
                showLine defaultExpandAll draggablexxxx>
            {this.renderTreeNodes(data)}
          </Tree>,
        ]}
      </div>
    );
  }
}
