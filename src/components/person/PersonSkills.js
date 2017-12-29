import React from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Button, Modal, Icon } from 'antd';
import { personAvatar } from '../../utils/display.js';
import styles from './Skills.less';

const ButtonGroup = Button.Group;

@connect(({ aminerPerson, loading }) => ({ aminerPerson, loading }))
class Skills extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getSkillsUseProps();
  }
  shouldComponentUpdate(nextProps, nextState) {
    //const nextnumVoted = nextState.voter_number;
    //const numVoted = this.state.voter_number;
    if (nextProps.profile && this.props.profile) {
      if (nextProps.profile.id !== this.props.profile.id) {
        //this.getSkillsUseProps();
        window.scrollTo(0, 0);
        return true;
      }
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    const { aminerPerson } = this.props;
    const { profile } = aminerPerson;
    const prevProfile = prevProps.profile;
    //const prevnumVoted = prevState.voter_number;
    if (profile && prevProfile) {
      if (profile.id !== prevProfile.id) {
        this.getSkillsUseProps();
        window.scrollTo(0, 0); // go to
      }
    }
  }
  getSkillsUseProps = () => {
    const { aminerPerson } = this.props;
    const { profile } = aminerPerson;
    const personId = profile.id;
    const { dispatch } = this.props;
    const paramsUp = {
      personId,
      toffset: 0,
      tsize: 10,
      uoffset: 0,
      usize: 6,
    };
    const paramsDown = {
      personId,
      toffset: 10,
      tsize: 100,
      uoffset: 0,
      usize: 0,
    };
    const payload = { paramsUp, paramsDown };
    dispatch({
      type: 'aminerPerson/getPersonSkillsByParams',
      payload,
    });
  };

  voteUp = (tid, result) => {
    const { aminerPerson } = this.props;
    const { profile } = aminerPerson;
    const aid = profile.id;
    const { dispatch } = this.props;
    if (result && (!result.is_upvoted)) {
      const params = {
        aid: aid,
        oper: 'up',
        tid: tid,
      };
      dispatch({
        type: 'aminerPerson/votePersonInSomeTopicById',
        params,
      }).then(() => this.getSkillsUseProps());
    } else if (result && (result.is_upvoted)) {
      const params = {
        aid: aid,
        tid: tid,
      };
      dispatch({
        type: 'aminerPerson/unvotePersonInSomeTopicById',
        params,
      }).then(() => this.getSkillsUseProps());
    }
  };

  voteDown = (tid, result) => {
    const { aminerPerson } = this.props;
    const { profile } = aminerPerson;
    const aid = profile.id;
    const { dispatch } = this.props;
    if (result && (!result.is_downvoted)) {
      const params = {
        aid: aid,
        oper: 'down',
        tid: tid,
      };
      dispatch({
        type: 'aminerPerson/votePersonInSomeTopicById',
        params,
      }).then(() => this.getSkillsUseProps());
    } else if (result && (result.is_downvoted)) {
      const params = {
        aid: aid,
        tid: tid,
      };
      dispatch({
        type: 'aminerPerson/unvotePersonInSomeTopicById',
        params,
      }).then(() => this.getSkillsUseProps());
    }
  };

  modalDisplay = () => {
    const { aminerPerson } = this.props;
    console.log(this.props);
    const { skillsModal } = aminerPerson;
    console.log(skillsModal);
    const statusModal = skillsModal.status;
    const votersModal = skillsModal.voters;
    Modal.info({
      title: 'Endorsers',
      okText: 'Cancel',
      iconType: null,
      maskClosable: true,
      width: 658,
      content: (
        <div>
          <div className={styles.spliterModal} />
          <div style={{ marginTop: 20 }} />
          {statusModal && votersModal &&
          <div>
            { votersModal.map((voter) => {
              return (
                <div>
                  <div className={styles.areaModal}>
                    <img
                      src={personAvatar(voter.avatar, voter.id, 160)} className={styles.avatarModal}
                      alt={voter.avatar} title={voter.name}
                    />
                    <span className={styles.text}>
                      <p className={styles.head}>{voter.name}</p>
                      <div style={{ marginTop: 10 }} />
                      {voter.profile.aff && <i className="fa fa-map-marker fa-fw" />}
                      <div style={{ marginTop: 10 }} />
                      {voter.profile.pos && voter.profile.pos.map((pos) => {
                        return <p><i className="fa fa-briefcase fa-fw" />{pos.n}</p>;
                      })}
                      <div style={{ marginTop: 10 }} />
                      {voter.profile.tags && voter.profile.tags.map((tag) => {
                        return <Button size="small" className={styles.tag}>{tag.t}</Button>;
                      })}
                    </span>
                  </div>
                  <div className={styles.spliterModal} />
                </div>);
            })}
          </div>
          }
        </div>
      ),
    });
  };

  info = (key, num_voted) => {
    const { profile } = this.props;
    const personId = profile.id;
    const { dispatch } = this.props;
    const payload = {
      personId: personId,
      tid: key,
      offset: 0,
      usize: num_voted,
    };
    dispatch({
      type: 'aminerPerson/getTopicOfModal',
      payload,
    }).then(() => this.modalDisplay());
  };
  render() {
    const { aminerPerson } = this.props;
    const { skillsUp, skillsDown } = aminerPerson;
    const topicsUp = skillsUp.topics;
    const statusUp = skillsUp.status;
    const topicsDown = skillsDown.topics;
    const statusDown = skillsDown.status;
  return (
    <div className={classnames(styles.skills_info, 'container-wrong')}>
      <div className={styles.info_zone}>
        <div className={styles.title}><h2><i className="fa fa-flask fa-fw" /> Skills</h2>
        </div>
        <div className={styles.spliter} />
        <div className={styles.skillsZone}>
          {statusUp && topicsUp &&
          <div>
            { topicsUp.map((item) => {
            return <div className={styles.upArea} >
              <span className={styles.leftArea}>
                <span className={styles.buttonArea}>
                  <ButtonGroup>
                    <Button className={styles.buttonNum}>{item.num_voted}</Button>
                    <Button className={styles.button}>{item.topic.label}</Button>
                  </ButtonGroup>
                </span>
                <span className={styles.lineContainer} >
                  {(!item.is_upvoted) && <a className={styles.unclicked} onClick={this.voteUp.bind(this, item.topic.id, item)}>
                    <i className="fa fa-thumbs-up fa-fw" />
                  </a>}
                  {item.is_upvoted && <a className={styles.clicked} onClick={this.voteUp.bind(this, item.topic.id, item)}>
                    <i className="fa fa-thumbs-up fa-fw" />
                  </a>}
                  {(!item.is_downvoted) && <a className={styles.unclicked} onClick={this.voteDown.bind(this, item.topic.id, item)}>
                    <i className="fa fa-thumbs-down fa-fw" />
                  </a>}
                  {item.is_downvoted && <a className={styles.clicked} onClick={this.voteDown.bind(this, item.topic.id, item)}>
                    <i className="fa fa-thumbs-down fa-fw" />
                  </a>}
                  <span className={styles.line} />
                </span>
              </span>
              <span className={styles.voterArea}> {item.voters.map((voter) => {
                return <img
                  src={personAvatar(voter.avatar, voter.id, 160)} className={styles.avatar}
                  alt={voter.avatar} title={voter.name}
                />;
              })}
                <span className={styles.modalArea} >
                  <a onClick={this.info.bind(this, item.topic.id, item.num_voted)} >
                    <Icon className={styles.icon} type="caret-right" />
                  </a>
                </span>
              </span>
            </div>;
          })}
          </div>}
          <div style={{ marginTop: 10 }} />
          {statusDown && topicsDown &&
            <div className={styles.downZone}>
              { topicsDown.map((item) => {
            return <span className={styles.downArea}>
              <span className={styles.buttonArea}>
                <ButtonGroup>
                  <Button className={styles.buttonNum}>{item.num_voted}</Button>
                  <Button className={styles.button}>{item.topic.label}</Button>
                </ButtonGroup>
              </span>
              {(!item.is_upvoted) && <a className={styles.unclicked} onClick={this.voteUp.bind(this, item.topic.id, item)}>
                <i className="fa fa-thumbs-up fa-fw" />
              </a>}
              {item.is_upvoted && <a className={styles.clicked} onClick={this.voteUp.bind(this, item.topic.id, item)}>
                <i className="fa fa-thumbs-up fa-fw" />
              </a>}
              {(!item.is_downvoted) && <a className={styles.unclicked} onClick={this.voteDown.bind(this, item.topic.id, item)}>
                <i className="fa fa-thumbs-down fa-fw" />
              </a>}
              {item.is_downvoted && <a className={styles.clicked} onClick={this.voteDown.bind(this, item.topic.id, item)}>
                <i className="fa fa-thumbs-down fa-fw" />
              </a>}
            </span>;
          })}
            </div>
        }
        </div>
      </div>
    </div>
  );
 }
}
export default Skills;
