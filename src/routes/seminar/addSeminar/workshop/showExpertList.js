/**
 * Created by yangyanmei on 17/6/22.
 */
import React from 'react';
import { Button, Icon } from 'antd';
import styles from './showExpertList.less';

class ShowExpertList extends React.Component {
  render() {
    const { talk, index, getImg, delTheExpert, editTheExpert } = this.props;
    let timeFrom = '';
    let timeTo = '';
    if (talk.time) {
      timeFrom = new Date(talk.time.from);
      timeTo = new Date(talk.time.to);
    }
    return (
      <li className={styles.talks}>
        <div className={styles.left}>
          <img src={getImg(talk.speaker.img)} alt="头像" />
        </div>
        <div className={styles.right}>
          {talk.title &&
          <div className={styles.specialInfo}>
            <span>演讲标题：</span>
            <span>
              {talk.title}
            </span>
          </div>}
          <table>
            <tr>
              <td>演讲时间：</td>
              {timeFrom !== '' ? <td>
                {timeFrom.format('yyyy年MM月dd日')}
                {timeTo !== '' && timeFrom.getDate() < timeTo.getDate() &&
                <span>~ {timeTo.getDate()}日</span>}
              </td> : <td></td>}
              <td style={{ textAlign: 'right', verticalAlign: 'top' }}>演讲地点：</td>
              <td style={{}}>{talk.talkAddress}</td>
            </tr>
            <tr>
              <td>专家姓名：</td>
              <td style={{ verticalAlign: 'top' }}>
                <span>{talk.speaker.name}</span>
                {talk.speaker.position && <span> {talk.speaker.position}</span>}
              </td>
              <td>专家单位：</td>
              <td style={{}}>
                {talk.speaker.affiliation && <span>{talk.speaker.affiliation}</span>}
              </td>
            </tr>
            <tr>
              <td>专家电话：</td>
              <td style={{ verticalAlign: 'top' }}>
                {talk.speaker.phone && <span>{talk.speaker.phone}</span>}
              </td>
              <td>专家邮箱：</td>
              <td style={{}}>
                {talk.speaker.email && <span>{talk.speaker.email}</span>}
              </td>
            </tr>
          </table>
          <div className={styles.specialInfo}>
            <span>专家简介：</span>
            <span>{talk.speaker.bio}</span>
          </div>
          <div className={styles.specialInfo}>
            <span>演讲摘要：</span>
            <span>{talk.abstract}</span>
          </div>
        </div>
        <a style={{ fontSize: '16px' }} onClick={editTheExpert.bind(this, index)}>
          <Icon type="edit" onClick={editTheExpert.bind(this, index)} />
        </a>
        <a style={{ marginLeft: 10, fontSize: '16px', color: '#f04134' }}
           onClick={delTheExpert.bind(this, index)}>
          <Icon type="delete" />
        </a>
      </li>
    );
  }
}

export default (ShowExpertList);
