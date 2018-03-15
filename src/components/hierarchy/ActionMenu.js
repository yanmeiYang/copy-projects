/**
 *  Created by BoGao on 2018-03-14;
 */
import React, { Component } from 'react';
import { Tree, Icon, Popover } from 'antd';
import styles from './ActionMenu.less';
import PropTypes from "prop-types";
import { AddExpertbase, DeleteBtn, MoveOrg } from './oppopup';
import { compare } from "utils/compare";

export default class ActionMenu extends Component {
  static propTypes = {
    id: PropTypes.string,
    top: PropTypes.number, // delete this.
    config: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    id: 'actionMenu',
  };

  state = {};

  componentWillReceiveProps = (nextProps) => {

  };

  shouldComponentUpdate(nextProps, nextState) {
    // return compare(this.props, nextProps, 'navis', 'query');
    return true;
  }

  getData = () => {
    let data = this.refs.menu && this.refs.menu.dataset.item;
    data = JSON.parse(data);
    return data;
  };

  render() {
    const { id, top, config } = this.props;
    console.log('init ActionMenu', id, top, config);
    return (
      <div id={id} className={styles.actionMenu} ref="menu">
        <div className={styles.menu}>
          {config && config.map((item) => {
            if (item.component) {
              const { component, ...props } = item;
              const newProps = {
                ...props,
                className: styles.item,
                onGetData: this.getData,
              };
              return React.createElement(component, newProps);
            } else {
              const iconType = item.icon;
              const onclick = item.onClick || null;
              return (
                <div key={item.key} className={styles.item} onClick={onclick}>
                  <Icon type={iconType} /><span>{item.label}</span>
                </div>
              )
            }
          })}
          {/*<AddExpertbase fatherId={this.props.fatherId} callbackParent={this.switch} name="新建" />*/}
          {/*<AddExpertbase fatherId={this.props.fatherId} callbackParent={this.switch} name="编辑" />*/}
          {/*<MoveOrg fatherId={this.props.fatherId} callbackParent={this.switch} />*/}
          {/*<DeleteBtn fatherId={this.props.fatherId} callbackParent={this.switch} />*/}
        </div>
      </div>
    );
  }
}
