/**
 * Created by yangyanmei on 17/6/22.
 */
import React from 'react';
import { Col, Button } from 'antd';
import styles from './showExpertList.less';

class ShowExpertList extends React.Component {
  render() {
    const { talk, index, getImg, delTheExpert } = this.props;
    return (
      <li className={styles.talks}>
        <div className={styles.left}>
          <img src={getImg(talk.speaker.img)} alt="头像" />
        </div>
        <div className={styles.right}>
          <table>
            <tr>
              <td>演讲标题：</td>
              <td colSpan={3}>{talk.title}</td>
            </tr>
            <tr>
              <td>演讲时间：</td>
              <td style={{ width: '42%' }}>2017</td>
              <td style={{ textAlign: 'right', verticalAlign: 'top' }}>演讲地点：</td>
              <td style={{ width: '42%' }}>{talk.location.address}</td>
            </tr>
            <tr>
              <td>姓名：</td>
              <td style={{ width: '42%' }}>
                <span>{talk.speaker.name}</span>
                {talk.speaker.position && <span> {talk.speaker.position}</span>}
              </td>
              <td>单位：</td>
              <td style={{ width: '42%' }}>
                {talk.speaker.affiliation && <span>{talk.speaker.affiliation}</span>}
              </td>
            </tr>
            <tr>
              <td>专家简介：</td>
              <td colSpan={3}>{talk.speaker.bio}</td>
            </tr>
            <tr>
              <td>演讲摘要：</td>
              <td colSpan={3}>{talk.abstract}</td></tr>
          </table>
        </div>
        <Button type="danger" onClick={delTheExpert.bind(this, index)}>删除</Button>
      </li>
    );
  }
}

export default (ShowExpertList);
