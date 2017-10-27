/**
 *  Created by BoGao on 2017-10-25;
 */
import React, { PureComponent } from 'react';
import { Tooltip, Tag } from 'antd';
import { classnames } from 'utils/index';
import styles from './PersonLabels.less';

export default class PersonLabels extends PureComponent {

  render() {
    const { person } = this.props;
    return (
      <div className={styles.personLabels}>
        {person && person.dims && person.dims.title &&
        person.dims.title.map((t) => {
          const label = t.replace(/CCF_MEMBER_/g, '');
          return (
            <Tag key={label} className={styles.label}>{label}</Tag>
          );
        })}
      </div>
    );
  }
}

