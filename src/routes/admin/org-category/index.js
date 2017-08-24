/**
 *  Created by ranyanchuan on 2017-06-09;
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Input, Modal, Icon } from 'antd';
import { connect } from 'dva';
import { isEqual } from 'lodash';
import UniversalConfig from '../../common/universal-config/index';
import styles from './index.less';
import { classnames } from '../../../utils';
import { RequireAdmin } from '../../../hoc';

const TabPane = Tabs.TabPane;
const OrgListGroupCategoryKey = 'orgcategory';
const OrgListPrefix = 'orglist_';

@connect(({ app, universalConfig, loading }) => ({ app, universalConfig, loading }))
@RequireAdmin
export default class OrgCategory extends React.Component {
  state = {
    // 不带前缀的ID, {id:?, name:?, category: orglist_?}
    currentGroupId: null,
    addOrgModalVisible: false,
  };

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    // 页面一开始就加载列表，这个是可以的。
    this.props.dispatch({
      type: 'universalConfig/getCategoryGroup',
      payload: {
        groupCategory: OrgListGroupCategoryKey,
        categoryTemplate: `${OrgListPrefix}{id}`,
      },
    });
  }

  // componentWillReceiveProps = (nextProps) => {
  //   // 得到categories列表的时候设置默认选择第一个。
  //   const categories = nextProps.universalConfig.categories;
  //   if (!isEqual(categories, this.props.universalConfig.categories)) {
  //     if (categories && categories.length > 0) {
  //       this.setState({ currentGroupId: `${OrgListPrefix}${categories[0].id}` });
  //     }
  //   }
  // };

  shouldComponentUpdate(nextProps, nextState) {
    // deep compare;
    const categories = nextProps.universalConfig.categories;
    if (!isEqual(categories, this.props.universalConfig.categories)) {
      if (categories && categories.length > 0 && !this.state.currentGroupId) {
        this.setState({ currentGroupId: categories[0].id });
      }
      return true;
    }
    if (nextState.currentGroupId !== this.state.currentGroupId
      || nextState.addOrgModalVisible !== this.state.addOrgModalVisible) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentGroupId !== this.state.currentGroupId) {
      const category = `${OrgListPrefix}${this.state.currentGroupId}`;
      this.props.dispatch({
        type: 'universalConfig/setCategory',
        payload: { category },
      });
    }
  }

  onTabChange = (activeKey) => {
    this.setState({ currentGroupId: activeKey.replace(OrgListPrefix, '') });
  };

  onModalInputBlur = (e) => {
    this.newOrgName = e.target.value;
  };

  onSetOrgModalVisible = () => {
    this.setState({ addOrgModalVisible: true });
  };

  onEditOrgList = () => {
    const key = this.state.currentGroupId;
    const data = this.props.universalConfig.categories;
    let matchedGroup;
    if (data && data.length > 0) {
      data.map((group) => {
        if (key === group.id) {
          matchedGroup = group;
        }
        return true;
      });
    }

    const { dispatch } = this.props;
    const that = this;
    Modal.confirm({
      title: '修改机构名称：',
      content: (
        <input className="orgNameInput" defaultValue={matchedGroup.name}
               onBlur={this.onModalInputBlur} />
      ),
      onOk() {
        const newOrgName = that.newOrgName && that.newOrgName.trim();
        if (!newOrgName) {
          alert('机构名称不能为空！');
        } else if (matchedGroup.name !== newOrgName) {
          dispatch({
            type: 'universalConfig/updateCategoryGroup',
            payload: {
              category: OrgListGroupCategoryKey,
              key: matchedGroup.name,
              newKey: newOrgName,
            },
          });
        }
      },
      onCancel() {
      },
    });
  };

  onDeleteOrgList = () => {
    console.log('onAddOrgList selectedid is', this.state.currentGroupId);
    const key = this.state.currentGroupId;
    const data = this.props.universalConfig.categories;
    const { dispatch } = this.props;
    if (data && data.length > 0) {
      data.map((group) => {
        if (key === group.id) {
          Modal.confirm({
            title: '删除机构列表：',
            content: `确定删除【${group.name}】吗？`,
            onOk() {
              dispatch({
                type: 'universalConfig/deleteCategoryGroup',
                payload: {
                  category: OrgListGroupCategoryKey, key: group.name,
                },
              });
            },
            onCancel() {
            },
          });
        }
        return true;
      });
    }
  };
  onAddOrgList = (value) => {
    let orgName = '';
    if (typeof value === 'string') {
      orgName = value && value.trim();
    } else {
      orgName = this.newOrgName && this.newOrgName.trim();
    }
    if (!orgName) {
      alert('机构名称不能为空！');
    } else {
      this.props.dispatch({
        type: 'universalConfig/addCategoryGroup',
        payload: {
          category: OrgListGroupCategoryKey,
          key: orgName,
          val: 1,
          categoryTemplate: `${OrgListPrefix}{id}`,
        },
      });
      ReactDOM.findDOMNode(this.refs.addOrgInput).value = '';
    }
  };
  cancelHandle = () => {
    this.setState({ addOrgModalVisible: false });
  };

  render() {
    const { categories } = this.props.universalConfig;
    return (
      <div className={classnames('', styles.page)}>
        <h2>机构列表</h2>

        <div className={styles.main}>
          <div className={styles.left}>

            <div className={styles.toolbox} style={{ display: 'flex', marginRight: '5px' }}>
              <a onClick={this.onSetOrgModalVisible}>添加</a>
              <Modal
                title="添加机构列表："
                visible={this.state.addOrgModalVisible}
                onOk={this.onAddOrgList.bind(this)}
                onCancel={this.cancelHandle}
              >
                <Input className="orgNameInput" placeholder="请输入新机构的名字" ref="addOrgInput"
                       onBlur={this.onModalInputBlur}
                       onPressEnter={e => this.onAddOrgList(e.target.value)}
                />
              </Modal>
            </div>

            <Tabs type="line" size="small" tabPosition="left"
                  activeKey={`${OrgListPrefix}${this.state.currentGroupId}`}
                  onChange={this.onTabChange}>
              {categories && categories.map((item) => {
                // TODO how to match ya.
                return <TabPane key={item.category} tab={
                  <div className={styles.leftTab}>
                    <span className={styles.wrapOverWidth}>{item.name}</span>
                    <div className={styles.toolbox}
                         style={this.state.currentGroupId === item.id ? { display: 'inline-block' } : { display: 'none' }}>
                      <a onClick={this.onEditOrgList}>
                        <Icon type="edit" />
                      </a>
                      <span className="spliter">|</span>
                      <a className={styles.actionByDel} onClick={this.onDeleteOrgList}>
                        <Icon type="delete" />
                      </a></div>
                  </div>} />;
              })}
            </Tabs>
          </div>

          <div className={styles.right}>
            <UniversalConfig hideValue />
          </div>

        </div>
      </div>
    );
  }
}

// export default connect(
//   ({ universalConfig, loading }) => ({ universalConfig, loading }),
// )(OrgCategory);
