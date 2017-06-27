/**
 * Created by yangyanmei on 17/6/26.
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, Icon, Row, Col, Table, Input, InputNumber } from 'antd';
import { Link } from 'dva/router';
import TimeFormat from '../detailSeminar/time-format';
import ExpertRating from '../detailSeminar/expert-rating';
import * as profileUtils from '../../../utils/profile_utils';
import styles from './index.less'


const ExpertRatingPage = ({ dispatch, seminar, app }) => {
  const { summaryById, expertRating } = seminar;
  const currentUser = app;

  const columns = [{
    title: '专家信息',
    dataIndex: 'speaker',
    width: '50%',
    render: function (person) {
      const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      const pos = person.position;
      const aff = person.affiliation;
      return <div key={person.aid + person.name} className="item">
        <div className="avatar_zone">
          <img
            src={profileUtils.getAvatar(person.img, '', 90)}
            className="avatar"
            alt={name}
            title={name}
          />
        </div>

        <div className="info_zone">

          <div>
            {name &&
            <div className="title">
              <h2>
                {person.aid ? <Link to={`/person/${person.aid}`}>
                  {name}
                </Link> : <span>{name}</span>}

              </h2>
            </div>}
          </div>
          <div className="zone">
            <div className="contact_zone">
              {pos && <p><i className="fa fa-briefcase fa-fw"/> {pos}</p>}
              {aff && <p><i className="fa fa-institution fa-fw"/> {aff}</p>}
            </div>
          </div>
        </div>

      </div>
    }
  }, {
    title: '专家评分',
    dataIndex: 'speaker.aid',
    render: function (aid) {
      return <div>
        {aid && <ExpertRating actid={summaryById.id} currentUser={currentUser} aid={aid} expertRating={expertRating}/>}
      </div>
    }
  }];

  return (
    <div className={styles.detailSeminar}>
      <Row>
        <Col md={24} lg={{ span: 16, offset: 4 }} className={styles.thumbnail}>
          <div className={styles.caption}>
            <h4 className=''>
              <strong>
                { summaryById.title }
              </strong>
            </h4>

            <div style={{ marginTop: 20 }} className={styles.workshopTetail}>
              {summaryById.organizer && <div>
                <h7><strong>承办单位：</strong></h7>
                <span>{summaryById.organizer.map((item) => {
                  return <span key={Math.random()}>{item}</span>
                })}</span>
              </div>}
              {summaryById.location && <div>
                <h7><strong>活动地点：</strong></h7>
                <span>{summaryById.location.address}</span>
              </div>}
              {summaryById.time && <div>
                <h7><strong>活动时间：</strong></h7>
                <span><TimeFormat {...summaryById.time}/></span>
              </div>}

              <Table columns={columns} dataSource={summaryById.talk} pagination={false}
                     style={{ marginTop: 20 }}/>
            </div>

          </div>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(ExpertRatingPage);
