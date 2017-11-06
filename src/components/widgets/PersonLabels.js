/**
 *  Created by BoGao on 2017-10-25;
 */
import React, { PureComponent } from 'react';
import { Tag } from 'antd';
import styles from './PersonLabels.less';

export default class PersonLabels extends PureComponent {

  render() {
    const { person, labelMap } = this.props;
    const map = labelMap || {};
    return (
      <div className={styles.personLabels}>
        {person && person.dims && person.dims.eb &&
        person.dims.eb.map((t) => {
          const label = map[t];
          return label && (
            <Tag key={t} className={styles.label}>{label}</Tag>
          );
        })}
      </div>
    );
  }
}

