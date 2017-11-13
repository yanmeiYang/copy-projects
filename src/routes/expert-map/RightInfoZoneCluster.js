/**
 *  Created by BoGao on 2017-07-16;
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Tooltip, Icon, Modal, Tabs, Tag } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import styles from './RightInfoZoneCluster.less';
import RightInfoZonePerson from './RightInfoZonePerson';
import ExpertTrajectory from '../expert-trajectory/ExpertTrajectory';
import * as profileUtils from '../../utils/profile-utils';
import { HindexGraph } from '../../components/widgets';
import { PersonListLittle } from '../../components/person';

let flag = false;
const { TabPane } = Tabs;

class RightInfoZoneCluster extends React.Component {
  state = {
    visible: false,
    visible1: false,
    cperson: '',
    cpersons: '',
  };

  componentDidMount() {
  }


  componentWillReceiveProps() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.cperson && nextState.cperson !== this.state.cperson) {
      return true;
    }
    return true;
  }

  showPersonelInfo = (person) => {
    this.setState({
      visible: true,
      cperson: person,
    }, () => {

    });
  };

  showMore = () => {
    if (flag) {
      document.getElementById('images').style.display = 'none';
      document.getElementById('showNum').innerHTML = 'more...';
      flag = false;
    } else {
      document.getElementById('images').style.display = '';
      document.getElementById('showNum').innerHTML = 'less...';
      flag = true;
    }
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk1 = () => {
    this.setState({
      visible1: false,
    });
  };

  handleCancel1 = () => {
    this.setState({
      visible1: false,
    });
  };

  showTagPersons = (tag) => {
    const cpersons = [];
    for (const p of this.props.persons) {
      if (p.tags_zh && p.tags_zh.length > 0) {
        p.tags.map((t) => {
          if (t.t === tag) {
            cpersons.push(p);
          }
          return true;
        });
      }
    }
    console.log(cpersons);
    this.setState({
      visible1: true,
      cpersons,
    });
  };

  render() {
    const persons = this.props.persons;
    if (!persons || persons.length <= 0) {
      return <div />;
    }

    let hindexSum = 0;
    const interests = {};
    persons.map((person) => {
      const indices = person.indices;
      // sum hindex
      if (indices) {
        hindexSum += indices.h_index;
      }
      persons.sort((a, b) => b.indices.h_index - a.indices.h_index);
      // interests
      if (person.tags && person.tags.length > 0) {
        person.tags.map((tag) => {
          const count = interests[tag.t] || 0;
          interests[tag.t] = count + 1;
          return null;
        });
      }
      if (person.tags_zh && person.tags_zh.length > 0) {
        person.tags.map((tag) => {
          const count = interests[tag.t] || 0;
          interests[tag.t] = count + 1;
          return null;
        });
      }
      if (person.tags_zh && person.tags_zh && person.tags_zh.length > 0) {
        person.tags.map((tag) => {
          const count = interests[tag.t] || 0;
          interests[tag.t] = count - 1;
          return null;
        });
      }
      return null;
    });

    // sort interests.
    let sortedInterest = Object.keys(interests).map((tag) => {
      return { key: tag, count: interests[tag] };
    });
    sortedInterest = sortedInterest.sort((a, b) => b.count - a.count);
    // TODO 人头按Hindex排序。
    // TODO 显示Hindex分段.
    const avg = (hindexSum / persons.length).toFixed(0);

    const infoJsx = (
      <div className={styles.charts}>
        <RightInfoZonePerson person={this.state.cperson} />
      </div>
    );
    const tagJsx = (
      <div className={styles.charts}>
        <PersonListLittle persons={this.state.cpersons} />
      </div>
    );
    return (
      <div className={styles.rizCluster}>
        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.titleIcon)} />
          H-index分布
        </div>

        <div className={styles.hindexInfo}>
          <HindexGraph persons={persons} avg={avg} />
        </div>

        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.expertIcon)} />
          专家&nbsp;
          <span className={styles.statistics}>(&nbsp;
            <span className={styles.count}>{persons.length}</span>
            人 )</span>
        </div>
        <div className={styles.images}>
          {persons && persons.slice(0, 20).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);

            const tooltip = (
              <div className={styles.tooltip}>
                {person.name}<br />
                Hindex: {person.indices && person.indices.h_index}
              </div>);
            return (
              <div key={person.id} className={styles.imgOuter}>
                <div className={styles.imgBox}>
                  <Tooltip title={tooltip}>
                    <img src={avatarUrl} alt="" onClick={this.showPersonelInfo.bind(this, person)} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.images} id="images" style={{ display: 'none' }}>
          {persons && persons.slice(20, persons.length).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);

            const tooltip = (
              <div className={styles.tooltip}>
                {person.name}<br />
                Hindex: {person.indices && person.indices.h_index}
              </div>);
            return (
              <div key={person.id} className={styles.imgOuter}>
                <div className={styles.imgBox}>
                  <Tooltip title={tooltip}>
                    <img src={avatarUrl} alt="" onClick={this.showPersonelInfo.bind(this, person)} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.showMoreInfo}>
          <a className="ant-dropdown-link" href="#" onClick={this.showMore} >
            <span id="showNum">more...</span>
          </a>
        </div>
        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.fieldIcon)} />
          研究领域
        </div>
        <div className={styles.keywords}>
          {sortedInterest && sortedInterest.slice(0, 20).map((interest) => {
            return (
              <div key={interest.key} role="presentation"
                   onClick={this.showTagPersons.bind(this, interest.key)} className={styles.tag}>
                <Tag className="tag">{interest.key} ({interest.count})</Tag>
              </div>
            );
          })}
        </div>
        <div className={styles.showInfo}>
          <Modal
            title="Information & Trajectory"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
              </Button>,
            ]}
            width="700px"
          >
            <Tabs defaultActiveKey="1" onChange={this.changeStatistic}>
              <TabPane tab="Detailed Information" key="1">{infoJsx && infoJsx}</TabPane>
              <TabPane tab="Trajectory" key="2">
                <div className={styles.traj}>
                  <ExpertTrajectory person={this.state.cperson} />
                </div>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
        <div className={styles.showResearch}>
          <Modal
            title="Same Research Area Scholars"
            visible={this.state.visible1}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleOk1}>
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
              </Button>,
            ]}
            width="700px"
          >
            <div className={styles.tagsInfo}>{tagJsx && tagJsx}</div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZoneCluster);
