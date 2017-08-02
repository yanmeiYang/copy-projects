/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import { InputNumber, Rate, Button, Row, Col, Table, Modal } from 'antd';

const { Column } = Table;
import { Link } from 'dva/router';
import TimeFormat from '../detailSeminar/time-format';
import * as profileUtils from '../../../utils/profile_utils';
import styles from './index.less';

class ExpertRatingPage extends React.Component {
  state = {
    visible: false,
    score: [0, 0, 0],
    speaker: {},
    actId: '',

  };
  // 闭包
  showModal = (text) => {
    return (e) => {
      this.setState({
        visible: true,
        score: text.score,
        speaker: text.speaker,
        actId: text.actId,

      });
    };
  };


  onChange = (index, value) => {
    const score = this.state.score;
    score[index] = value;
    this.setState({
      score,
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    // 将数据提交到后台
    const type = ['level', 'content', 'integrated'];
    this.state.score.map((score, index) => {
      const params = {
        src: 'ccf',
        actid: this.state.actId,
        aid: this.state.speaker.aid,
        key: type[index],
        score,
        lvtime: new Date().getTime(),
      };
      this.props.dispatch({ type: 'seminar/updateOrSaveActivityScore', payload: params });
      return true;
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { summaryById, expertRating } = this.props.seminar;
    // 评分数据处理
    const expertData = [];

    if (summaryById.talk && summaryById.talk !== undefined) {
      summaryById.talk.map((item) => {
        const aid = item.speaker.aid;
        const actId = summaryById.id;
        const valList = [0, 0, 0];
        expertRating.map((value) => {
          if (value.aid === aid) {
            if (value.key === 'level') {
              valList[0] = value.score;
            }
            if (value.key === 'content') {
              valList[1] = value.score;
            }
            if (value.key === 'integrated') {
              valList[2] = value.score;
            }
          }
          return true;
        });
        expertData.push({ key: aid, speaker: item.speaker, score: valList, actId });
        return true;
      });
    }


    return (
      <div className={styles.detailSeminar}>
        <Row>
          <Col md={24} lg={{ span: 20, offset: 2 }} className={styles.thumbnail}>
            <div className={styles.caption}>
              <h4>
                <strong>
                  { summaryById.title }
                </strong>
              </h4>

              <div style={{ marginTop: 20 }} className={styles.workshopTetail}>
                {summaryById.organizer && <div>
                  <h7><strong>承办单位：</strong></h7>
                  <span>{summaryById.organizer.map((item) => {
                    return <span key={Math.random()}>{item}</span>;
                  })}</span>
                </div>}
                {summaryById.location && <div>
                  <h7><strong>活动地点：</strong></h7>
                  <span>{summaryById.location.address}</span>
                </div>}
                {summaryById.time && <div>
                  <h7><strong>活动时间：</strong></h7>
                  <span><TimeFormat {...summaryById.time} /></span>
                </div>}
              </div>

              {/* <Table columns={columns} dataSource={expertData} */}
              {/* pagination={false} */}
              {/* style={{ marginTop: 20 }} /> */}

              <Table
                dataSource={expertData}
                bordered
                size="small"
                pagination={false}
                rowKey="key"
              >
                <Column
                  title="专家信息"
                  dataIndex="speaker"
                  key="speaker"
                  width="50%"
                  render={(person, record) => {
                    const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
                    const pos = person.position;
                    const aff = person.affiliation;
                    return (
                      <div key={person.aid + person.name} className="item">
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
                              {pos && <p><i className="fa fa-briefcase fa-fw" /> {pos}</p>}
                              {aff && <p><i className="fa fa-institution fa-fw" /> {aff}</p>}
                            </div>
                          </div>
                        </div>
                      </div>);
                  }}
                />
                <Column
                  title="专家评分"
                  dataIndex="score"
                  key="score"
                  render={(score, record) => {
                    return (
                      <div>
                        {score &&
                        <div>
                          <div>演讲水平:&nbsp;&nbsp;<Rate disabled defaultValue={score[0]}
                                                      value={score[0]} />
                            <span className="ant-rate-text">{score[0]} 星</span></div>
                          <div>演讲内容:&nbsp;&nbsp;<Rate disabled defaultValue={score[1]}
                                                      value={score[1]} />
                            <span className="ant-rate-text">{score[1]} 星</span></div>
                          <div>综合评价:&nbsp;&nbsp;<Rate disabled defaultValue={score[2]}
                                                      value={score[2]} />
                            <span className="ant-rate-text">{score[2]} 星</span></div>
                        </div>
                        }
                      </div>
                    );
                  }}
                />
                <Column
                  title="操作"
                  key="action"
                  render={(text, record) => {
                    return (
                      <div>
                        <Button type="primary" onClick={this.showModal(text)}
                                data={JSON.stringify(text)}>评分</Button>
                        <Modal
                          title={this.state.speaker.name}
                          visible={this.state.visible}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                        >
                          <table >
                            <tbody>
                            <tr>
                              <td><span style={{ marginRight: 5 }}>演讲水平:</span></td>
                              <td>
                                <Rate value={this.state.score[0]}
                                      onChange={this.onChange.bind(this, 0)} />
                                <InputNumber min={0} max={5} step={1} value={this.state.score[0]}
                                             onChange={this.onChange.bind(this, 0)} />
                              </td>
                            </tr>
                            <tr>
                              <td><span style={{ marginRight: 5 }}>演讲内容:</span></td>
                              <td>
                                <Rate value={this.state.score[1]}
                                      onChange={this.onChange.bind(this, 1)} />
                                <InputNumber min={0} max={5} step={1} value={this.state.score[1]}
                                             onChange={this.onChange.bind(this, 1)} />
                              </td>
                            </tr>
                            <tr>
                              <td><span style={{ marginRight: 5 }}>综合评价:</span></td>
                              <td>
                                <Rate value={this.state.score[2]}
                                      onChange={this.onChange.bind(this, 2)} />
                                <InputNumber min={0} max={5} step={1} value={this.state.score[2]}
                                             onChange={this.onChange.bind(this, 2)} />
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </Modal>

                      </div>
                    );
                  }}
                />
              </Table>

            </div >
          </Col >
        </Row >
      </div >
    );
  }
}
export default
connect(({ seminar }) => ({ seminar }))(ExpertRatingPage);

