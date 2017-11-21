/**
 * Created by yangyanmei on 17/8/4.
 */
import React from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import ShareButtons from 'react-share-buttons';
import { routerRedux, Link } from 'dva/router';
import { Tabs, Button, Icon, Row, Col, Rate, Modal, Spin } from 'antd';
import ActivityInfo from './activityInfo';
import ExpertAllInfo from './expertAllInfo';
import CommentsByActivity from './comments';
import * as auth from '../../../utils/auth';
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
          <Col className={styles.seminar_action}>
            <div className={styles.action_buttons}>
              {(app.roles &&
              (app.roles.authority.includes(summaryById.organizer[0]) || auth.isSuperAdmin(app.roles) ||
              summaryById.uid === app.user.id))
              && <span>
                <a type="danger"
                   style={{
                     float: 'right',
                     marginLeft: '8px',
                     marginRight: '5px',
                     fontSize: '20px',
                     color: '#f04134',
                   }}
                   onClick={delSeminar} title="删除">
                  <Icon type="delete" /></a>
                <a style={{ float: 'right', marginRight: '10px', fontSize: '20px' }}
                   onClick={editSeminar} title="编辑">
                  <Icon type="edit" />
                </a>
              </span>}
            </div>
            <div className={styles.share_buttons}>
              <ShareButtons
                sites={['qq', 'weibo', 'tencent', 'linkedin', 'twitter', 'facebook', 'google']}
                url={window.location.href}
                title={summaryById.title}
                description={summaryById.abstract}
              />
            </div>
          </Col>
          <Col className={styles.thumbnail}>
            <div className={styles.caption}>
              <div className={styles.qrcode}>
                <div>
                  <QRCode value={window.location.href} size={90} />
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
          {summaryById.link &&
          <Col className={styles.join_button}>
            <Button type="primary" size="large">
              <a href={summaryById.link} rel="noopener noreferrer" target="_blank">
                我要报名
              </a>
            </Button>
          </Col>
          }
          <CommentsByActivity activityId={summaryById.id} currentUser={currentUser} />
        </Row> : <div style={{ minHeight: 300 }} />}
      </Spin>
    </div>
  );
};
export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(DetailPage);
