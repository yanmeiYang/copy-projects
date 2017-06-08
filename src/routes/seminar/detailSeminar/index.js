/**
 * Created by yangyanmei on 17/5/31.
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Button, Icon, Row, Col, Rate, Input, InputNumber } from 'antd';
import TimeFormat from './time-format'
import styles from './index.less';


const DetailSeminar = ({ seminar }) => {
  const { summaryById } = seminar;
  //share
  let shareModalDisplay = false;

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
            {/*类型为seminar*/}
            {summaryById.type === 0 ?
              <div>
                <ul className={styles.messages}>
                  <span>
                    {summaryById.speaker ?
                      <div>
                        {summaryById.speaker.img ? <div className={styles.speakerAvatar}>
                          <img src={summaryById.speaker.img} />
                        </div> : ''}
                        <li>
                          <p>
                            <Icon type='user' />
                            <strong>Name:&nbsp;</strong>
                            <span>{summaryById.speaker.name}</span>
                          </p>
                        </li>
                        <li>
                          {summaryById.speaker.position ?
                            <p><Icon type="medicine-box" />
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
                      <Icon type="clock-circle-o" />
                      <strong>Time:&nbsp;</strong>
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
                          <Icon type="car" />
                          <strong>City:&nbsp;</strong>
                          <span>{summaryById.location.city}</span>
                        </p>
                      </li>
                      : ''}
                    {summaryById.location.address ?
                      <li>
                        <p>
                          <Icon type="environment-o" />
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
                <div className={styles.workshopTetail}>
                  {summaryById.img ? <div>
                    <img src={summaryById.img} />
                    <hr />
                  </div> : ''}
                </div>

                <div className={styles.rate}>
                  <span style={{ fontWeight: 'bold' }}>专家评分：</span>
                  <table >
                    <tr>
                      <td>演讲内容（水平）:</td>
                      <td>
                        <Rate allowHalf defaultValue={4.5} />
                        <InputNumber min={1} max={100} defaultValue={95} size="3" />
                      </td>
                    </tr>
                    <tr>
                      <td>演讲水平:</td>
                      <td>
                        <Rate allowHalf defaultValue={4.5} />
                        <InputNumber min={1} max={100} defaultValue={95} size="3" />
                      </td>
                    </tr>
                    <tr>
                      <td>综合评价（其它贡献）:</td>
                      <td>
                        <Rate allowHalf defaultValue={3.5} />
                        <InputNumber min={1} max={100} defaultValue={75} size="3" />
                      </td>
                    </tr>
                  </table>
                </div>

              </div>
              :
              //type ===1时显示图片信息
              <div className={styles.workshopTetail}>
                {summaryById.img ? <div>
                  <h5><TimeFormat {...summaryById.time}/></h5>
                  <img src={summaryById.img} />
                  <p>{summaryById.abstract}</p>
                  <hr />
                </div> : ''}
              </div>}

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
                        <img src={aTalk.speaker.img} alt={aTalk.speaker.name} />
                      </div>
                    </div>
                    <ul className={styles.messages}>
                    <span>
                      {aTalk.speaker ?
                        <div>
                          <li>
                            <p>
                              <Icon type='user' />
                              <strong>Name:&nbsp;</strong>
                              <span>{aTalk.speaker.name}</span>
                            </p>
                          </li>
                          <li>
                            {aTalk.speaker.position ?
                              <p><Icon type="medicine-box" />
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
                          <Icon type="clock-circle-o" />
                          <strong>Time:&nbsp;</strong>
                          <TimeFormat {...aTalk.time} />
                        </p></li> : ''}
                      </span>
                      <span>
                        {aTalk.location ? <span>
                            {aTalk.location.address ? <li><p>
                              <Icon type="environment-o" />
                              <strong>Time:&nbsp;</strong>
                              <TimeFormat {...aTalk.time} />
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
                    <div className={styles.rate}>
                      <span style={{ fontWeight: 'bold' }}>专家评分：</span>
                      <table >
                        <tr>
                          <td>演讲内容（水平）:</td>
                          <td>
                            <Rate allowHalf defaultValue={4.5} />
                            <InputNumber min={1} max={100} defaultValue={95} size="3" />
                          </td>
                        </tr>
                        <tr>
                          <td>演讲水平:</td>
                          <td>
                            <Rate allowHalf defaultValue={4.5} />
                            <InputNumber min={1} max={100} defaultValue={95} size="3" />
                          </td>
                        </tr>
                        <tr>
                          <td>综合评价（其它贡献）:</td>
                          <td>
                            <Rate allowHalf defaultValue={3.5} />
                            <InputNumber min={1} max={100} defaultValue={75} size="3" />
                          </td>
                        </tr>
                      </table>

                    </div>
                    <hr />
                  </div>
                )
              })}
            </div> : ''}

          </div>
        </Col>
        <Col span={16} offset={4} className={styles.thumbnail}>
          <div className={styles.comment}>
            <Input type='textarea' rows={4} placeholder='请输入评语。。。' />
            <Button type="primary">发布</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ seminar, loading }) => ({ seminar, loading }))(DetailSeminar);
