/**
 * Created by yangyanmei on 17/5/31.
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, Icon, Row, Col, Rate, Input, InputNumber } from 'antd';
import { Link } from 'dva/router';
import TimeFormat from './time-format';
import ExpertRating from './expert-rating';
import WorkShop from './workshop';
import CommentsByActivity from './comments';
import styles from './index.less';


const DetailSeminar = ({ dispatch, seminar, app }) => {
  const { summaryById, expertRating } = seminar;
  const currentUser = app;
  //share
  let shareModalDisplay = false;

  function clipboard(path) {
    shareModalDisplay = !shareModalDisplay;
  }

  function delSeminar() {
    dispatch({ type: 'seminar/deleteActivity', payload: { id: summaryById.id, body: summaryById } })
  }

  return (
    <div className={styles.detailSeminar}>
      <Row>
        <Col md={24} lg={{ span: 16, offset: 4 }} className={styles.thumbnail}>
          <div className={styles.caption}>
            {summaryById.uid === currentUser.user.id && currentUser.token &&
            <Button type='danger' icon='delete' style={{ float: 'right' }} onClick={delSeminar}>删除</Button>}
            <h4 className=''>
              <strong>
                { summaryById.title }
              </strong>
            </h4>

            {/*类型为seminar*/}
            {summaryById.type === 0 ?
              <div>
                <ul className={styles.messages}>
                  <span>
                    {summaryById.speaker ?
                      <div>
                        {summaryById.speaker.img ? <div className={styles.speakerAvatar}>
                          {summaryById.speaker.aid?<Link to={`/person/${summaryById.speaker.aid}`}><img src={summaryById.speaker.img}/></Link>:<img src={summaryById.speaker.img}/>}
                        </div> : ''}
                        <li>
                          <p>
                            <Icon type='user'/>
                            <strong>姓名:&nbsp;</strong>
                            {summaryById.speaker.aid?<Link to={`/person/${summaryById.speaker.aid}`}><span>{summaryById.speaker.name}</span></Link>:<span>{summaryById.speaker.name}</span>}
                          </p>
                        </li>
                        <li>
                          {summaryById.speaker.position ?
                            <p><Icon type="medicine-box"/>
                              <strong>职称:&nbsp;</strong>
                              <span>{summaryById.speaker.position}</span></p>
                            : ''}
                        </li>
                        <li>
                          {summaryById.speaker.affiliation ?
                            <p><Icon type="environment-o"/>
                              <strong>单位:&nbsp;</strong>
                              <span>{summaryById.speaker.affiliation}</span></p>
                            : ''}
                        </li>
                      </div>
                      : ''}
                  </span>
                  <span>
                    {summaryById.time ? <li><p>
                      <Icon type="clock-circle-o"/>
                      <strong>时间:&nbsp;</strong>
                      <TimeFormat {...summaryById.time} />
                      {/*<span>{dateRangeToString(summaryById.time.from, summaryById.time.to)} &nbsp;&nbsp;{timeRangeToString(summaryById.time.from, summaryById.time.to)}</span>*/}
                    </p></li> : ''}
                  </span>
                  <span>
                    {
                      summaryById.location ? <div>
                        {summaryById.location.city ?
                          <li>
                            <p>
                              <Icon type="car"/>
                              <strong>城市:&nbsp;</strong>
                              <span>{summaryById.location.city}</span>
                            </p>
                          </li>
                          : ''}
                        {summaryById.location.address ?
                          <li>
                            <p>
                              <Icon type="environment-o"/>
                              <strong>地点:&nbsp;</strong>
                              <span>{summaryById.location.address}</span>
                            </p>
                          </li>
                          : ''}
                      </div>
                        : ''
                    }
                  </span>

                  {summaryById.organizer && <span>
                    <li>
                      <p>
                        <Icon type="home" />
                        <strong>承办单位:&nbsp;</strong>
                        {summaryById.organizer.map((organizer, value) => {
                          return (
                            <span key={Math.random()}>
                              <span>{organizer}
                                {value < summaryById.organizer.length && <span>;&nbsp;</span>}
                              </span>
                            </span>
                          )
                        })}
                      </p>
                    </li>
                  </span>}

                  {summaryById.state && <span>
                    <li>
                        <p>
                          <Icon type="tags-o" />
                          <strong>贡献类别:&nbsp;</strong>
                          <span>{summaryById.state}</span>
                        </p>
                      </li>
                  </span>}

                </ul>
                <div>
                  {summaryById.abstract ? <div>
                    <h5><strong>报告摘要:</strong></h5>
                    <div className={styles.center}>
                      <p className='rdw-justify-aligned-block'>{summaryById.abstract}</p>
                    </div>
                  </div> : ''}
                </div>
                {summaryById.img&&<div>
                  <img src={summaryById.img} style={{width:'50%'}}/>
                </div>}
                <div>
                  {summaryById.speaker ? <div>
                    {summaryById.speaker.bio ? <div>
                      <h5>报告人简介:</h5>
                      <div className={styles.center}>
                        <p className='rdw-justify-aligned-block'>{summaryById.speaker.bio}</p>
                      </div>
                    </div> : ''}
                    {/*专家评分*/}
                    {summaryById.speaker.aid&&<ExpertRating actid={summaryById.id} currentUser={currentUser} aid={summaryById.speaker.aid} expertRating={expertRating}/>}
                  </div> : ''}
                </div>
              </div>
              : ''}

            {/*type=workshop*/}
            {summaryById.type === 1 ? <div>
              <div className={styles.workshopTetail}>
                <h5><TimeFormat {...summaryById.time}/></h5>
                {summaryById.img&&<img src={summaryById.img}/>}
                <p>{summaryById.abstract}</p>
                <hr />
              </div>
              {summaryById.talk.map((aTalk) => {
                return (
                  <div key={aTalk.speaker.aid + Math.random()} className={styles.workshop}>
                    {/*workshop详情页面*/}
                    <WorkShop {...aTalk}/>
                    {/*专家评分*/}
                    {aTalk.speaker.aid&&<ExpertRating actid={summaryById.id} currentUser={currentUser} aid={aTalk.speaker.aid} expertRating={expertRating}/>}
                    <hr />
                  </div>
                )
              })}
            </div> : ''}

          </div>
        </Col>
        <CommentsByActivity activityId={summaryById.id} currentUser={currentUser}/>
      </Row>
    </div>
  );
};
export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(DetailSeminar);
