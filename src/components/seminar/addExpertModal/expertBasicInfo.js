/**
 * Created by yangyanmei on 17/8/1.
 */
import React from 'react';
import { Icon } from 'antd';
import defaultImg from '../../../assets/people/default.jpg';
import styles from './expertBasicInfo.less';

class ExpertBasicInfo extends React.Component {
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };
  render() {
    const editTheSpeaker = this.props.currentExpert;
    return (
      <li className={styles.person}>
        <div className={styles.left}>
          <img src={this.getImg(editTheSpeaker.img)} alt="头像" />
        </div>
        <div className={styles.right}>
          <div className={styles.nameWrap}>
            <h3>{editTheSpeaker.name}</h3>
          </div>
          <div className={styles.infoWrap}>
            <p>
              {editTheSpeaker.position &&
              <span className={styles.infoItem}>
                <Icon type="idcard" />{ editTheSpeaker.position }
              </span>}
            </p>

            <p>{editTheSpeaker.affiliation &&
              <span className={styles.infoItem}>
                <Icon type="home" />
                { editTheSpeaker.affiliation }
              </span> }
            </p>
          </div>
        </div>
      </li>
    );
  }
}
export default ExpertBasicInfo;
