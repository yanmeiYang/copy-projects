/**
 * Created by yangyanmei on 17/5/31.
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, Icon, Row, Col, Rate, Input } from 'antd';
import styles from './index.less';


const DetailSeminar = ({ seminar }) => {
  const { summaryById } = seminar;
  const offsetMinutes = (new Date()).getTimezoneOffset() + 480

  function monthToEn(num) {
    const enmonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
      'November', 'December'];
    return enmonth[num];
  }

  function dateToString(time) {
    let date = new Date(time);
    let year = date.getFullYear() + '-';
    let mon = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    return year + mon + day;
  }

  function dateRangeToString(from, to) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);
    dateFrom.setMinutes(offsetMinutes);
    dateTo.setMinutes(offsetMinutes);
    monthToEn(dateFrom.getMonth());
    if (dateFrom.getFullYear() === dateTo.getFullYear() && dateFrom.getMonth() === dateTo.getMonth()) {
      if (dateFrom.getDate() === dateTo.getDate()) {
        return monthToEn(dateFrom.getMonth()) + ' ' + dateFrom.getDate() + ',' + dateFrom.getFullYear();
      } else {
        return monthToEn(dateFrom.getMonth()) + ' ' + dateFrom.getDate() + '-' + dateTo.getDate() + ', ' + dateFrom.getFullYear();
      }
    } else {
      if (dateFrom.getFullYear() === dateTo.getFullYear() && dateFrom.getMonth() !== dateTo.getMonth()) {
        return monthToEn(dateFrom.getMonth()) + ' ' + dateFrom.getDate() + '-' + monthToEn(dateTo.getMonth()) + ' ' + dateTo.getDate() + ', ' + dateFrom.getFullYear();
      } else {
        return dateToString(from) + ' to ' + dateToString(to);
      }
    }

  }

  function timeRangeToString(from, to) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);
    let mfrom, mto;

    if (dateFrom.getMinutes() === 0) {
      mfrom = "00";
    } else if (dateFrom.getMinutes() < 10) {
      mfrom = "0" + dateFrom.getMinutes();
    } else {
      mfrom = dateFrom.getMinutes();
    }

    if (dateTo.getMinutes() === 0) {
      mto = "00";
    } else if (dateTo.getMinutes() < 10) {
      mto = "0" + dateTo.getMinutes();
    } else {
      mto = dateTo.getMinutes();
    }

    if ((dateFrom.getHours() === dateTo.getHours()) && (dateFrom.getMinutes() === dateTo.getMinutes())) {
      return dateFrom.getHours() + ':' + mfrom;
    } else if (dateFrom.getHours() === dateTo.getHours() && dateFrom.getMinutes() !== dateTo.getMinutes()) {
      return dateFrom.getHours() + ':' + mfrom + '-' + dateFrom.getHours() + ":" + mto;
    } else {
      return dateFrom.getHours() + ':' + mfrom + '-' + dateTo.getHours() + ':' + mto;
    }
  }

  //share
  let shareModalDisplay = false

  function clipboard(path) {
    shareModalDisplay = !shareModalDisplay;
  }

  return (
    <div className={styles.detailSeminar}>
      <Row>
        <Col span={16} offset={4} className={styles.thumbnail}>
          <div className={styles.caption}>
            <h4 className=''>
              <strong>
                { summaryById.title }
              </strong>
            </h4>
            {summaryById.type === 0 ?
              <div>
                <ul className={styles.messages}>
              <span>
                {summaryById.speaker ?
                  <div>
                    <li>
                      <p>
                        <Icon type='user'/>
                        <strong>Name:&nbsp;</strong>
                        <span>{summaryById.speaker.name}</span>
                      </p>
                    </li>
                    <li>
                      {summaryById.speaker.position ?
                        <p><Icon type="medicine-box"/>
                          <strong>Position:&nbsp;</strong>
                          <span>{summaryById.speaker.position}</span></p>
                        : ''}
                    </li>
                    <li>
                      {summaryById.speaker.affiliation ?
                        <p><Icon type="environment-o" />
                          <strong>Position:&nbsp;</strong>
                          <span>{summaryById.speaker.affiliation}</span></p>
                        : ''}
                    </li>
                  </div>
                  : ''}
              </span>
                  <span>
                {summaryById.time ? <li><p>
                  <Icon type="clock-circle-o"/>
                  <strong>Time:&nbsp;</strong>
                  <span>{dateRangeToString(summaryById.time.from, summaryById.time.to)} &nbsp;&nbsp;{timeRangeToString(summaryById.time.from, summaryById.time.to)}</span>
                </p></li> : ''}
              </span>
                  <span>
                {
                  summaryById.location ? <div>
                    {summaryById.location.city ?
                      <li>
                        <p>
                          <Icon type="car"/>
                          <strong>City:&nbsp;</strong>
                          <span>{summaryById.location.city}</span>
                        </p>
                      </li>
                      : ''}
                    {summaryById.location.address ?
                      <li>
                        <p>
                          <Icon type="environment-o"/>
                          <strong>Location:&nbsp;</strong>
                          <span>{summaryById.location.address}</span>
                        </p>
                      </li>
                      : ''}
                  </div>
                    : ''
                }
              </span>
                </ul>
                <div>
                  {summaryById.abstract ? <div>
                    <h5>Abstract:</h5>
                    <div className={styles.center}>
                      <p className='rdw-justify-aligned-block'>{summaryById.abstract}</p>
                    </div>
                  </div> : ''}
                </div>
              </div>
              : <div className={styles.workshopTetail}>
                {summaryById.img ? <div>
                  <h5>{dateRangeToString(summaryById.time.from, summaryById.time.to)}&nbsp&nbsp{timeRangeToString(summaryById.time.from, summaryById.time.to)}. { summaryById.location.address }</h5>
                  <img src={summaryById.img}/>
                  <p>{summaryById.abstract}</p>
                  <hr/>
                </div> : ''}
              </div>}


            <div>
              {summaryById.speaker ? <div>
                {summaryById.speaker.bio ? <div>
                  <h5>Bio:</h5>
                  <div className={styles.center}>
                    <p className='rdw-justify-aligned-block'>{summaryById.speaker.bio}</p>
                  </div>
                </div> : ''}
              </div> : ''}
            </div>
            {/*type=workshop*/}
            {summaryById.type === 1 ? <div>{
              summaryById.talk.map((aTalk) => {
                return (
                  <div key={aTalk.speaker.aid} className={styles.workshop}>
                    <h5>
                      <strong>{aTalk.title}</strong>
                    </h5>
                    <div>
                      <div className={styles.speakerAvatar}>
                        <img src={aTalk.speaker.img} alt='aTalk.speaker.name'/>
                      </div>
                    </div>
                    <ul className={styles.messages}>
                    <span>
                      {aTalk.speaker ?
                        <div>
                          <li>
                            <p>
                              <Icon type='user'/>
                              <strong>Name:&nbsp;</strong>
                              <span>{aTalk.speaker.name}</span>
                            </p>
                          </li>
                          <li>
                            {aTalk.speaker.position ?
                              <p><Icon type="medicine-box"/>
                                <strong>Position:&nbsp;</strong>
                                <span>{aTalk.speaker.position}</span></p>
                              : ''}
                          </li>
                          <li>
                            {aTalk.speaker.affiliation ?
                              <p><Icon type="environment-o" />
                                <strong>Affiliation:&nbsp;</strong>
                                <span>{aTalk.speaker.affiliation}</span></p>
                              : ''}
                          </li>
                        </div>
                        : ''}
                      </span>
                      <span>
                        {aTalk.time ? <li><p>
                          <Icon type="clock-circle-o"/>
                          <strong>Time:&nbsp;</strong>
                          <span>{dateRangeToString(aTalk.time.from, aTalk.time.to)} &nbsp;&nbsp;{timeRangeToString(summaryById.time.from, summaryById.time.to)}</span>
                        </p></li> : ''}
                      </span>
                      <span>
                        {aTalk.location ? <span>
                            {aTalk.location.address ? <li><p>
                              <Icon type="environment-o"/>
                              <strong>Time:&nbsp;</strong>
                              <span>{dateRangeToString(aTalk.time.from, aTalk.time.to)} &nbsp;&nbsp;{timeRangeToString(summaryById.time.from, summaryById.time.to)}</span>
                            </p></li> : ''}</span> : ''}
                      </span>
                    </ul>
                    <div>
                      {aTalk.abstract ? <div>
                        <h5>Abstract:</h5>
                        <div className={styles.center}>
                          <p className='rdw-justify-aligned-block'>{aTalk.abstract}</p>
                        </div>
                      </div> : ''}
                    </div>
                    <div>
                      {aTalk.speaker.bio ? <div>
                        <h5>Bio:</h5>
                        <div className={styles.center}>
                          <p className='rdw-justify-aligned-block'>{ aTalk.speaker.bio }</p>
                        </div>
                      </div> : ''}
                    </div>
                    <hr/>
                  </div>
                )
              })}
            </div> : ''}

            {/*<div className={styles.action}>
             <Button>
             <Icon type="share-alt"/>
             <span>share</span>
             </Button>
             <Button className={styles.marginLeft}>
             <Icon type="like-o"/>
             <span>like</span>
             </Button>
             </div>*/}

            <div className={styles.rate}>
              <span>专家评分：</span>
              <Rate allowHalf defaultValue={2.5}/>
            </div>

            <div className={styles.comment}>
              <Input type='textarea' rows={4} placeholder='请输入评语。。。'/>
              <Button type="primary">发布</Button>
            </div>

          </div>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ seminar, loading }) => ({ seminar, loading }))(DetailSeminar);
