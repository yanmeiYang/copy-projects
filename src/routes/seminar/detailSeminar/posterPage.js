/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import { Row, Col, Spin } from 'antd';
import { Link } from 'dva/router';
import styles from './posterPage.less';
import ActivityInfo from './activityInfo';
import * as profileUtils from '../../../utils/profile-utils';

class PosterPage extends React.Component {
  render() {
    const { summaryById, loading } = this.props.seminar;
    return (
      <div className={styles.detailSeminar}>
        <Spin spinning={loading}>
          { typeof (summaryById.length) !== 'number' ? <Row>
            <Col className={styles.thumbnail}>
              <div className={styles.caption}>
                {summaryById.type === 1 && <div>
                  <ActivityInfo summaryById={summaryById} />

                  <h2 style={{ fontWeight: 600, marginBottom: '15px' }}>特邀讲者</h2>
                  {summaryById.talk.map((aTalk) => {
                    const startTime = aTalk.time ? new Date(aTalk.time.from) : '';
                    return (
                      <div key={aTalk.speaker.aid + Math.random()} className={styles.workshop}>
                        <div className={styles.posterShow}>
                          <div className={styles.expertAvatar}>
                            <Link to={`/person/${aTalk.speaker.aid}`}>
                              <img
                                src={profileUtils.getAvatar(aTalk.speaker.img, aTalk.speaker.aid, 90)}
                                alt={aTalk.speaker.name} />
                            </Link>
                          </div>
                          <div className={styles.expertMessage}>
                            <div className={styles.expert_name_pos}>
                              <Link to={`/person/${aTalk.speaker.aid}`}>
                                <h2>{aTalk.speaker.name}</h2>
                              </Link>
                              <span>{aTalk.speaker.position}</span>
                            </div>
                            <div className={styles.expert_poster_info}>
                              <strong>报告主题: </strong>
                              {aTalk.title &&
                              <span>{aTalk.title}</span>
                              }
                            </div>
                            <div className={styles.expert_poster_info}>
                              <strong>报告时间: </strong>
                              {startTime !== '' &&
                              <span>
                                {this.props.pad(startTime.getHours(), 2)}:
                                {this.props.pad(startTime.getMinutes(), 2)}
                              </span>}
                            </div>
                            <div className={styles.expert_poster_info}>
                              <strong>主题简介: </strong>
                              <p style={{ display: 'inline' }}>{aTalk.abstract}</p>
                            </div>
                            <div className={styles.expert_poster_info}>
                              <strong>个人简介: </strong>
                              <p style={{ display: 'inline' }}>{ aTalk.speaker.bio }</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <QRCode value={window.location.href} size={90} />
                  </div>
                </div>}
              </div>
            </Col>
          </Row> : <div style={{ minHeight: 300 }} />}
        </Spin>
      </div>


    );
  }
}

export default connect(({ seminar, loading }) => ({ seminar, loading }))(PosterPage);
