/**
 * Created by BoGao on 2017/7/15.
 */
import React from 'react';
import { Tag } from 'antd';
import styles from './person-label.less';
import { ACMFellowExpertBaseIndex, TopUnivExpertBaseIndex } from '../../../utils/expert-base';

class PersonLabel extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.person !== nextProps.person;
  }

  render() {
    const p = this.props.person;
    return (
      <div className={styles.pl}>
        {p && p.pin && p.pin.l && p.pin.l.length > 0 && p.pin.l.map((ebid) => {
          let label = ACMFellowExpertBaseIndex[ebid]
            ? <Tag className={styles.personLabel}>ACM Fellow</Tag> : '';
          if (!label || label === '') {
            const tueb = TopUnivExpertBaseIndex[ebid];
            label = tueb ? (
              <Tag className={styles.personLabel}>
                {(tueb.index > 0 && tueb.index <= 30) && 'Top 30 University'}
                {(tueb.index > 30 && tueb.index <= 50) && 'Top 30-50 University'}
                {(tueb.index > 50 && tueb.index <= 100) && 'Top 50-100 University'}
              </Tag>
            ) : '';
          }
          return (
            <div className="tag" key={ebid}>
              {label}
            </div>
          );
        })}
      </div>
    );
  }
}

export default PersonLabel;
