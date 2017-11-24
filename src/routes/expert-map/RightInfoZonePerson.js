/**
 *  Created by BoGao on 2017-07-17;
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Modal, Tag } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { sysconfig } from 'systems';
import bridge from 'utils/next-bridge';
import { Indices } from 'components/widgets';
import * as profileUtils from 'utils/profile-utils';
import styles from './RightInfoZonePerson.less';
import ExpertTrajectory from '../expert-trajectory/ExpertTrajectory';

class RightInfoZonePerson extends React.PureComponent {
  state = {
    visible: false,
    cperson: '',
  };

  componentDidMount() {
  }

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

  showTraj = (person) => {
    this.setState({
      visible: true,
      cperson: person,
    }, () => {

    });
  };

  render() {
    const { person } = this.props;
    if (!person) {
      return <div />;
    }

    const showTraj = sysconfig.Map_ShowTrajectory;
    const centerZoom = true;
    // used in person popup info
    let url = '/images/blank_avatar.jpg';
    url = profileUtils.getAvatar(person.avatar, person.id, 160);
    const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
    const pos = profileUtils.displayPosition(person.pos);
    const aff = profileUtils.displayAff(person);

    // used in person right info zone.
    const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
    if (sysconfig.PersonList_PersonLink_NewTab) {
      personLinkParams.target = '_blank';
    }
    const tags = profileUtils.findTopNTags(person, 8);

    const personShowIndices = ['h_index', 'citations', 'activity'];

    return (
      <div className="rizPersonInfo">
        {name &&
        <div className="name bg">
          <h2 className="section_header">
            <a {...personLinkParams}>{person.name} </a><br />
            <a {...personLinkParams} className="zh">{person.name_zh} </a>
          </h2>
        </div>
        }

        <a {...personLinkParams} className="img"><img src={url} alt="IMG" /></a>

        <div className="info bg">
          {showTraj &&
          <span>
            <Button onClick={this.showTraj.bind(this, person)}>Show Trajectory</Button>
          </span>}
          {pos && <span><i className="fa fa-briefcase fa-fw" />{pos}</span>}
          {aff && <span><i className="fa fa-institution fa-fw" />{aff}</span>}
        </div>

        <div className="info indicesInfo bg">
          <Indices
            indices={bridge.toNextIndices(person.indices)}
            activity_indices={person.activity_indices}
            showIndices={personShowIndices}
          />
        </div>

        <div className="info bg">
          <h4><i className="fa fa-area-chart fa-fw" />研究兴趣:</h4>
          <div className={styles.tagWrap}>
            {
              tags.map((tag) => {
                return (
                  <Link to={`/${sysconfig.SearchPagePrefix}/${tag}/0/${sysconfig.MainListSize}`}
                        key={Math.random()} className={styles.link} target = '_blank'>
                    <Tag className="tag">{tag}</Tag>
                  </Link>
                );
              })
            }
          </div>
        </div>
        <div className={styles.showTraj}>
          <Modal
            title="Trajectory"
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
            <div className={styles.traj}>
              <ExpertTrajectory person={this.state.cperson} centerZoom={centerZoom} />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default connect()(RightInfoZonePerson);
