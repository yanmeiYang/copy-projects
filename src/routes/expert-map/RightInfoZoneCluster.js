/**
 *  Created by BoGao on 2017-07-16;
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Tooltip, Icon, Modal, Tabs, Tag } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import { sysconfig } from 'systems';
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
    if (nextState.visible !== this.state.visible) {
      return true;
    }
    if (nextState.visible1 !== this.state.visible1) {
      return true;
    }
    if (nextState.cpersons && nextState.cpersons !== this.state.cpersons) {
      return true;
    }
    if (nextProps.persons && nextProps.persons !== this.props.persons) {
      return true;
    }
    return false;
  }

  onPersonClick = (person) => {
    const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
    window.open(personLinkParams.href, '_blank');
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
    const cp = new Set();
    const cpersons = [];
    for (const p of this.props.persons) {
      if (p.tags_zh && p.tags_zh.length > 0) {
        p.tags_zh.map((t) => {
          if (t.t === tag) {
            cp.add(p);
          }
          return true;
        });
      }
      if (p.tags && p.tags.length > 0) {
        p.tags.map((t) => {
          if (t.t === tag) {
            cp.add(p);
          }
          return true;
        });
      }
    }
    cp.forEach((item) => {
      cpersons.push(item);
    });
    this.setState({
      visible1: true,
      cpersons,
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

  showPersonelInfo = (person) => {
    this.setState({
      visible: true,
      cperson: person,
    }, () => {

    });
  };

  handleErr = (e) => {
    e.target.src='/images/blank_avatar.jpg';
  };

  render() {
    const { persons } = this.props;
    if (!persons || persons.length <= 0) {
      return <div />;
    }

    const showTraj = sysconfig.Map_ShowTrajectory;
    const title = showTraj ? "Information & Trajectory" : "Expert Information";
    const centerZoom = true; //个性化设置Trajectory地图聚焦到第一个位置
    let hindexSum = 0;
    const interests = {};
    if (persons) {
      persons & persons.map((person) => {
        const { indices } = person;
        // sum hindex
        if (indices) {
          hindexSum += indices.h_index;
        }
        persons.sort((a, b) => {
          if ((b.indices.h_index - a.indices.h_index) === 0) {
            return b.name - a.name;
          } else {
            return (b.indices.h_index - a.indices.h_index);
          }
        });
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
    }


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
        <PersonListLittle persons={this.state.cpersons} onClick={this.onPersonClick} />
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
            人 )
          </span>
        </div>
        <div className={styles.images}>
          {persons && persons.slice(0, 20).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 90);

            const tooltip = (
              <div className={styles.tooltip}>
                {person.name}<br />
                Hindex: {person.indices && person.indices.h_index}
              </div>);
            return (
              <div key={person.id} className={styles.imgOuter}>
                <div className={styles.imgBox}>
                  <Tooltip title={tooltip}>
                    <img src={avatarUrl} alt="" onKeyDown={() => {}} onError={this.handleErr}
                         onClick={this.showPersonelInfo.bind(this, person)} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.images} id="images" style={{ display: 'none' }}>
          {persons && persons.slice(20, persons.length).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 90);

            const tooltip = (
              <div className={styles.tooltip}>
                {person.name}<br />
                Hindex: {person.indices && person.indices.h_index}
              </div>);
            return (
              <div key={person.id} className={styles.imgOuter}>
                <div className={styles.imgBox}>
                  <Tooltip title={tooltip}>
                    <img src={avatarUrl} alt="" onKeyDown={() => {}}  onError={this.handleErr}
                         onClick={this.showPersonelInfo.bind(this, person)} />
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
              <div key={interest.key} role="presentation" onKeyDown={() => {}}
                   onClick={this.showTagPersons.bind(this, interest.key)} className={styles.tag}>
                <Tag className="tag">{interest.key} ({interest.count})</Tag>
              </div>
            );
          })}
        </div>
        <div className={styles.showInfo}>
          <Modal
            title={title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
              </Button>,
            ]}
            width="600px"
          >
            {
              showTraj && <Tabs defaultActiveKey="1" onChange={this.changeStatistic}>
                <TabPane tab="Detailed Information" key="1">{infoJsx && infoJsx}</TabPane>
                <TabPane tab="Trajectory" key="2">
                  <div className={styles.traj}>
                    <ExpertTrajectory person={this.state.cperson} centerZoom={centerZoom} />
                  </div>
                </TabPane>
              </Tabs>
            }
            {
              !showTraj && <div>{infoJsx && infoJsx}</div>
            }
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
            width="600px"
          >
            <div className={styles.tagsInfo}>{tagJsx && tagJsx}</div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZoneCluster);
