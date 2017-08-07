/**
 * Created by yangyanmei on 17/8/4.
 */
import React from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Tabs, Button, Icon, Row, Col, Rate, Modal, Spin } from 'antd';
import ActivityInfo from './activityInfo';
import CommentsByActivity from './comments';
import * as profileUtils from '../../../utils/profile-utils';
import styles from './index.less';


const DetailPage = ({ dispatch, seminar, app, pad }) => {
  const { summaryById, loading } = seminar;
  const currentUser = app;
  // share
  let shareModalDisplay = false;

  function clipboard(path) {
    shareModalDisplay = !shareModalDisplay;
  }

  function delSeminar() {
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        dispatch({
          type: 'seminar/deleteActivity',
          payload: { id: summaryById.id, body: summaryById },
        });
        dispatch(routerRedux.push('/seminar'));
      },
      onCancel() {
      },
    });
  }

  function editSeminar() {
    dispatch(routerRedux.push(`/seminar-edit/${summaryById.id}`));
  }

  return (
    <div className={styles.detailSeminar}>
      <Spin spinning={loading}>
        { typeof (summaryById.length) !== 'number' ? <Row>
          <Col className={styles.thumbnail}>
            <div className={styles.caption}>
              {(app.roles.authority.includes(summaryById.organizer[0]) || app.roles.admin) &&
              <span>
                <a type="danger" style={{ float: 'right', fontSize: '20px', color: '#f04134' }}
                   onClick={delSeminar} title="删除">
                  <Icon type="delete" /></a>
                <a style={{ float: 'right', marginRight: '10px', fontSize: '20px' }}
                   onClick={editSeminar} title="编辑">
                  <Icon type="edit" /></a>
              </span>}
              <div style={{ float: 'right', marginRight: 10 }}>
                <span type="default" className={styles.show_QRCode}>
                  <Icon type="share-alt" style={{ fontSize: '22px' }} />
                  {/*<i className="fa fa-2x fa-qrcode" aria-hidden="true" />*/}
                </span>
                <div className={styles.qrCode}>
                  <QRCode value={window.location.href} />
                </div>
              </div>
              {/* type=workshop*/}
              {summaryById.type === 1 ? <div>
                <ActivityInfo summaryById={summaryById} />
                {summaryById.talk.map((aTalk) => {
                  return (
                    <div key={aTalk.speaker.aid + Math.random()} className={styles.workshop}>
                      <div className={styles.workshopDetail}>
                        {aTalk.title && <h5 className={styles.talkTitle}>主题: {aTalk.title}</h5>}
                        <p style={{ marginBottom: 10 }}>
                          {aTalk.time &&
                          <span>
                            <strong>报告时间:&nbsp;</strong>
                            {pad(new Date(aTalk.time.from).getHours(), 2)}:
                            {pad(new Date(aTalk.time.from).getMinutes(), 2)}
                            {aTalk.time.to &&
                            <span>&nbsp;~&nbsp;
                              {pad(new Date(aTalk.time.to).getHours(), 2)}:
                              {pad(new Date(aTalk.time.to).getMinutes(), 2)}
                            </span>}
                          </span>}
                          {aTalk.location && <span style={{ marginLeft: 10 }}>
                            {aTalk.location.address &&
                            <span>
                              <strong>报告地点:&nbsp;</strong>
                              <span>{aTalk.location.address}</span>
                            </span>}
                          </span>}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div className={styles.speakerAvatar}>
                            {aTalk.speaker.aid ?
                              <Link to={`/person/${aTalk.speaker.aid}`}>
                                <img
                                  src={profileUtils.getAvatar(aTalk.speaker.img, aTalk.speaker.aid, 160)}
                                  alt={aTalk.speaker.name} />
                              </Link> :
                              <img src={aTalk.speaker.img} alt={aTalk.speaker.name} />}
                          </div>
                          <ul className={styles.messages}>
                            <span>
                              {aTalk.speaker &&
                              <div>
                                <li>
                                  <p>
                                    <Icon type="user" />
                                    <strong>姓名:&nbsp;</strong>
                                    {aTalk.speaker.aid ?
                                      <Link to={`/person/${aTalk.speaker.aid}`}>
                                        <span>{aTalk.speaker.name}</span>
                                      </Link> : <span>{aTalk.speaker.name}</span>}
                                  </p>
                                </li>
                                <li>
                                  {aTalk.speaker.position && aTalk.speaker.position !== ' ' &&
                                  <p><Icon type="medicine-box" />
                                    <strong>职称:&nbsp;</strong>
                                    <span>{aTalk.speaker.position}</span></p>}
                                </li>
                                <li>
                                  {aTalk.speaker.affiliation &&
                                  <p>
                                    <Icon type="environment-o" />
                                    <strong>单位:&nbsp;</strong>
                                    <span>{aTalk.speaker.affiliation}</span>
                                  </p>}
                                </li>
                              </div>}
                            </span>
                            <span>
                              {aTalk.speaker.phone &&
                              <li>
                                <p>
                                  <Icon type="phone" />
                                  <strong>电话:&nbsp;</strong>
                                  <span>{aTalk.speaker.phone}</span>
                                </p>
                              </li>}
                            </span>
                            <span>
                              {aTalk.speaker.email &&
                              <li>
                                <p>
                                  <Icon type="mail" />
                                  <strong>邮箱:&nbsp;</strong>
                                  <span>{aTalk.speaker.email}</span>
                                </p>
                              </li>}
                            </span>
                          </ul>
                        </div>
                        <div className={styles.bio}>
                          {aTalk.speaker.bio ? <div>
                            <h5>个人简介:</h5>
                            <div className={styles.center}>
                              <p className="rdw-justify-aligned-block">{ aTalk.speaker.bio }</p>
                            </div>
                          </div> : ''}
                        </div>

                        <div className={styles.abstract}>
                          {aTalk.abstract ? <div>
                            <h5>主题简介:</h5>
                            <div className={styles.center}>
                              <p className="rdw-justify-aligned-block">{aTalk.abstract}</p>
                            </div>
                          </div> : ''}
                        </div>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div> : ''}

            </div>
          </Col>
          <CommentsByActivity activityId={summaryById.id} currentUser={currentUser} />
        </Row> : <div style={{ minHeight: 300 }} />}
      </Spin>
    </div>
  );
};
export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(DetailPage);
