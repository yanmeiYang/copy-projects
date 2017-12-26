/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import { InputNumber, Rate, Button, Row, Col, Table, Modal, Spin } from 'antd';
import { Link, routerRedux } from 'dva/router';
import * as seminarService from 'services/seminar';
import { Spinner } from 'components';
import * as strings from 'utils/strings';
import { sysconfig } from 'systems';
import { Layout } from 'routes';
import * as profileUtils from '../../../utils/profile-utils';
import ExpertRatingModalContent from './expertRatingModalContent';
import styles from './index.less';

const { Column } = Table;

class ExpertRatingPage extends React.Component {
  state = {
    visible: null,
    score: [0, 0, 0],
    speaker: {},
    actId: '',

  };

  showModal = (text) => {
    this.setState({
      visible: text.speaker.aid,
      score: text.score,
      speaker: text.speaker,
      actId: text.actId,
    });
  };


  onChange = (index, value) => {
    if (typeof value === 'number') {
      const score = this.state.score;
      score[index] = value;
      this.setState({
        score,
      });
    }
  };

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
  };

  onSearchBarSearch = (data) => {
    console.log('Enter query is ', data);
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    const encodedQuery = strings.encodeAdvancedQuery(data.query) || '-';
    const pathname = `/${sysconfig.SearchPagePrefix}/${encodedQuery}/${newOffset}/${newSize}`;
    console.log('=========== encode query is: ', pathname);
    this.props.dispatch(routerRedux.push({ pathname }));
  };

  render() {
    const { summaryById, expertRating } = this.props.seminar;
    const { roles } = this.props;
    const loading = this.props.loading.effects['seminar/getSeminarByID'];
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
      <Layout className={styles.detailSeminar} onSearch={this.onSearchBarSearch}>
        <Spin spinning={loading}>
          <div className={styles.thumbnail}>
          <div className={styles.caption}>

            <h2>
              <strong>为专家评分：</strong>
            </h2>
            {summaryById.title &&
            <h3>
              <strong>标题：{summaryById.title}</strong>
            </h3>}

            <div className={styles.workshopTetail}>
              {summaryById.host_org && summaryById.host_org.length > 0 &&
              <div>
                <strong>主办单位：</strong>
                <span>
                  {summaryById.host_org.map(item => seminarService.getValueByJoint(item))}
                </span>
              </div>}
              {summaryById.organizer && summaryById.organizer.length > 0 &&
              <div>
                <strong>承办单位：</strong>
                <span>
                  {summaryById.organizer.map(item => seminarService.getValueByJoint(item))}
                </span>
              </div>}
              {summaryById.co_org && summaryById.co_org.length > 0 &&
              <div>
                <strong>协办单位：</strong>
                <span>
                  {summaryById.co_org.map(item => seminarService.getValueByJoint(item))}
                </span>
              </div>}
              {summaryById.location &&
              <div>
                <strong>活动地点：</strong>
                <span>{summaryById.location.city} {summaryById.location.address}</span>
              </div>}
              {summaryById.time &&
              <div>
                <strong>活动时间：</strong>
                <span>{new Date(summaryById.time.from).format('yyyy年MM月dd日')}</span>
                {summaryById.time.to &&
                <span>&nbsp;~&nbsp;
                  {new Date(summaryById.time.to).format('yyyy年MM月dd日')}
                </span>}
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
              rowKey={key => Math.random() + key}
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
                    <div key={person.aid + person.name} className="expertInfoInRating">
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
                        <div>演讲水平:&nbsp;&nbsp;
                          <Rate disabled defaultValue={score[0]} value={score[0]} />
                          {score[0] > 0 ?
                            <span className="ant-rate-text">{score[0]} 分</span>
                            : <span className={styles.ratingPlaceholder} />}
                        </div>
                        <div>演讲内容:&nbsp;&nbsp;
                          <Rate disabled defaultValue={score[1]} value={score[1]} />
                          {score[1] > 0 ?
                            <span className="ant-rate-text">{score[1]} 分</span>
                            : <span className={styles.ratingPlaceholder} />}
                        </div>
                        <div>综合评价:&nbsp;&nbsp;
                          <Rate disabled defaultValue={score[2]} value={score[2]} />
                          {score[2] > 0 ?
                            <span className="ant-rate-text">{score[2]} 分</span>
                            : <span className={styles.ratingPlaceholder} />}
                        </div>
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
                      {(roles.admin || roles.authority.includes(summaryById.organizer[0])) &&
                      text.speaker && text.speaker.aid &&
                      <Button
                        type="primary" data={JSON.stringify(text)}
                        onClick={this.showModal.bind(this, text)}>
                        评分
                      </Button>}

                      {text.speaker && text.speaker.aid &&
                      <Modal
                        title={this.state.speaker.name}
                        visible={this.state.visible === text.speaker.aid}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                      >
                        <ExpertRatingModalContent score={this.state.score} />
                      </Modal>}

                    </div>
                  );
                }}
              />
            </Table>

          </div>
        </div>
        </Spin>
      </Layout>
    );
  }
}

export default connect(({ seminar, app, loading }) => ({ seminar, roles: app.roles, loading }))(ExpertRatingPage);

