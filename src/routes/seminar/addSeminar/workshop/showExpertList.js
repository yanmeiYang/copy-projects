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
          <img src={getImg(talk.speaker.img)} alt="头像"/>
        </div>
        <div className={styles.right}>
          <Col span={12} className={styles.nameWrap}>
            <div className='ant-form-item'>
              <label className='ant-col-4'>演讲嘉宾：</label>
              <div className='ant-col-20'>
                <span>{talk.speaker.name}</span>
                {talk.speaker.position && <span> {talk.speaker.position}</span>}
              </div>
            </div>
            {talk.title && <div className='ant-form-item' style={{ marginBottom: 5 }}>
              <label className='ant-col-4'>演讲名称：</label>
              <span>{talk.title}</span>
            </div>}
          </Col>
          <Col span={12} className={styles.nameWrap}>
            <div className='ant-form-item'>
              <label className='ant-col-4'>嘉宾信息：</label>
              <div className='ant-col-20'>
                {talk.speaker.affiliation && <span>{talk.speaker.affiliation}</span>}
                {/*<span>性别</span>*/}
                {/*<span>, 电话</span>*/}
                {/*<span>, 邮箱</span>*/}
              </div>
            </div>
            {talk.location.address && <div className='ant-form-item' style={{ marginBottom: 5 }}>
              <label className='ant-col-4'>演讲地点：</label>
              <span>{talk.location.address}</span>
            </div>}
          </Col>
          <Col span={24} className='ant-form-item' style={{ marginBottom: 5 }}>
            <label className='ant-col-2'>专家简介：</label>
            <div className='ant-col-22'>{talk.speaker.bio}</div>
          </Col>
          <Col span={24} className='ant-form-item' style={{ marginBottom: 5 }}>
            <label className='ant-col-2'>演讲摘要：</label>
            <div className='ant-col-22'>{talk.abstract}</div>
          </Col>
        </div>
        <Button type='danger' onClick={delTheExpert.bind(this, index)}>删除</Button>
      </li>
    )
  }
}

export default (ShowExpertList);
