/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { Link } from 'dva/router';
import { Breadcrumb } from 'antd';
import { Indices } from '../../components/widgets';
import { sysconfig } from '../../systems';
import * as personService from '../../services/person';
import { config } from '../../utils';
import styles from './RCDOrgList.less';
import * as profileUtils from '../../utils/profile-utils';

const { Item } = Breadcrumb;
export default class RCDOrgList extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.personLabel = props.personLabel;
  }

  state = {};

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.orgs === this.props.orgs) {
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    console.log('refresh rcd breadcrumb. ');
    return (
      <Breadcrumb separator=">">
        <Item>Home</Item>
        <Item href="">Application Center</Item>
        <Item href="">Application List</Item>
        <Item>An Application</Item>
      </Breadcrumb>
    );

  }
}
