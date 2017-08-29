/**
 * Created by yangyanmei on 17/8/4.
 */
import React from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Tabs, Button, Icon, Row, Col, Rate, Modal, Spin } from 'antd';
import ActivityInfo from './activityInfo';
import ExpertAllInfo from './expertAllInfo';
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

  const compare = (property) => {
    return (a, b) => {
      const val1 = a[property].from;
      const val2 = b[property].from;
      return new Date(val1) - new Date(val2);
    };
  };

  let guestSpeakers = [];
  let presidents = [];
  if (summaryById.talk) {
    guestSpeakers = summaryById.talk.filter(item => item.speaker.role === undefined || !item.speaker.role.includes('president'));
    presidents = summaryById.talk.filter(item => item.speaker.role && item.speaker.role.includes('president'));
  }

  let timeTalk = [];
  const noTimeTalk = [];
  if (guestSpeakers.length > 0) {
    guestSpeakers.map((item) => {
      if (item.time !== undefined) {
        timeTalk.push(item);
      } else {
        noTimeTalk.push(item);
      }
      return true;
    });
  }
  if (timeTalk.length > 0) {
    timeTalk = timeTalk.sort(compare('time'));
  }
  guestSpeakers = timeTalk.concat(noTimeTalk);

  return (
    <div className={styles.detailSeminar}>
      <Spin spinning={loading}>
        {summaryById.title ? <Row>
          <Col className={styles.thumbnail}>
            <div className={styles.caption}>
              {(app.roles.authority.includes(summaryById.organizer[0]) || app.roles.admin)
              && <span>
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
              <div className={styles.speakerMessage}>
                <ActivityInfo summaryById={summaryById} />
                {presidents.length > 0 &&
                <div>
                  <h2><strong>会议主席</strong></h2>
                  <hr />
                  <ExpertAllInfo speakers={presidents} pad={pad} />
                </div>}

                {guestSpeakers.length > 0 &&
                <div>
                  <h2><strong>特邀嘉宾</strong></h2>
                  <hr />
                  <ExpertAllInfo speakers={guestSpeakers} pad={pad} />
                </div>}
              </div>
            </div>
          </Col>
          <CommentsByActivity activityId={summaryById.id} currentUser={currentUser} />
        </Row> : <div style={{ minHeight: 300 }} />}
      </Spin>
    </div>
  );
};
export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(DetailPage);
