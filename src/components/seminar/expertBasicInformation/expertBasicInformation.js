/**
 * Created by yangyanmei on 17/6/14.
 */
import React from 'react';
import { Input, Col, Radio, Button, Modal, Tag, Icon, } from 'antd';
import { routerRedux, Link } from 'dva/router';
import { request, config } from '../../../utils';
import fetch from 'dva/fetch';
import defaultImg from '../../../assets/people/default.jpg';
import styles from './expertBasicInformation.less';
const RadioGroup = Radio.Group;

class ExpertBasicInformation extends React.Component {
  state = {
    searchExperts: false,
    suggestSpeakers: [],
    // gender: "1",
    speakerInfo: [],
  };
  speakerInformation = { name: '', position: '', affiliation: '', aid: '', img: '', bio: '', phone: '', email: '',gender:'1' };
  //改变性别
  // onChangeGender = (e) => {
  //   this.setState({ gender: e.target.value });
  // };

  //增加嘉宾
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };

  handleOk = (e) => {
    this.setState({
      searchExperts: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      searchExperts: false,
    });
  };

  saveExpertInfo = (type, e) => {
    this.speakerInformation[type] = e.target.value;
    this.setState({
      speakerInfo: this.speakerInformation,
    });
    this.props.callbackParent(this.speakerInformation);
  };

//相关专家推荐
  showModal = () => {
    const type = parseInt(this.props.selectedType);
    const t = this;
    let payload = {};
    if (type === 0) {
      payload = {
        name: this.refs.speakerName.refs.input.value,
        position: this.refs.speakerPos.refs.input.value,
        affiliation: this.refs.speakerAff.refs.input.value,
        title: '',
      };
    } else {
      payload = {
        name: this.refs.speakerName.refs.input.value,
        position: this.refs.speakerPos.refs.input.value,
        affiliation: this.refs.speakerAff.refs.input.value,
        title: '',
      };
    }
    fetch(config.baseURL + config.api.speakerSuggest, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify(payload),
    }).then(function (response) {
      return response.json().then(function (json) {
        return json;
      }).then(function (json) {
        t.setState({
          suggestSpeakers: json,
          searchExperts: true,
        });

      });
    });
  };

  selectedExpert = (speaker) => {
    // let speakerInformation = { name: '', position: '', affiliation: '', aid: '', img: '' };
    this.speakerInformation.name = this.refs.speakerName.refs.input.value = speaker.payload.name;
    this.speakerInformation.affiliation = this.refs.speakerAff.refs.input.value = speaker.payload.org;
    speaker.pos.length > 0 ? this.speakerInformation.position = this.refs.speakerPos.refs.input.value = speaker.pos[0].n : this.speakerInformation.position = this.refs.speakerPos.refs.input.value = ' ';
    this.speakerInformation.aid = this.refs.speakerAid.value = speaker.payload.id;
    this.speakerInformation.img = this.refs.speakerImg.src = speaker.img;

    this.setState({
      speakerInfo: this.speakerInformation,
      searchExperts: false,
    });
    this.props.callbackParent(this.speakerInformation);
  };

  render() {
    let { suggestSpeakers } = this.state;

    let { integral } = this.props;
    return (
      <div>
        <Col span={6}>
          <section>
            <div className="people">
              <div className="no-padding shadow-10">
                <div className={styles.crop}><span className="helper"></span><img src={this.getImg()}
                                                                                  ref='speakerImg'/>
                  <input ref='speakerAid' style={{ display: 'none' }}/>
                </div>
              </div>
            </div>
            {/*<Button size='small'>*/}
            {/*<Icon type="cloud-upload"/>&nbsp;Upload*/}
            {/*</Button>*/}
          </section>
        </Col>
        <Col span={18}>
          <div className={styles.expertProfile}>
            <div className='ant-form-item'>
              <label className="ant-col-3">姓名: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='嘉宾姓名' ref='speakerName'
                       onBlur={this.saveExpertInfo.bind(this, 'name')}/>
              </div>
            </div>

            <div className='ant-form-item'>
              <label className="ant-col-3">性别: </label>
              <div className='ant-col-21'>
                <RadioGroup defaultValue="1" onChange={this.saveExpertInfo.bind(this, 'gender')}>
                  <Radio value="1" name="gender">男的</Radio>
                  <Radio value="2" name="gender">女的</Radio>
                </RadioGroup>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">职称: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='嘉宾职称' ref='speakerPos'
                       onBlur={this.saveExpertInfo.bind(this, 'position')}/>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">单位: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='嘉宾单位' ref='speakerAff'
                       onBlur={this.saveExpertInfo.bind(this, 'affiliation')}/>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">电话: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='电话' ref='speakerIphone' onBlur={this.saveExpertInfo.bind(this, 'phone')}/>
              </div>
            </div>
            <div className='ant-form-item'>
              <label className="ant-col-3">邮箱: </label>
              <div className='ant-col-21'>
                <Input size='large' placeholder='邮箱' ref='speakerEmail' onBlur={this.saveExpertInfo.bind(this, 'email')}/>
              </div>
            </div>

            <div className='ant-form-item'>
              <label className="ant-col-3">积分: </label>
              <div className='ant-col-21'>
                <span>{integral}</span>
              </div>
            </div>
            <Button type='primary' className={styles.recommendation}
                    onClick={this.showModal.bind(this)}>相关嘉宾推荐</Button>
            <Modal
              title="Search Experts"
              width="880px"
              visible={this.state.searchExperts}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div className={styles.personWrap}>
                {suggestSpeakers.map((speaker) => {
                  const position = speaker.pos && speaker.pos.length > 0 ? speaker.pos[0].n : null;
                  const aff = speaker.payload.aff ? speaker.payload.aff : null;
                  return (
                    <li key={speaker.payload.id} className={styles.person}>
                      <div className={styles.left}>
                        <img src={this.getImg(speaker.img)} alt="头像"/>
                      </div>
                      <div className={styles.right}>
                        <div className={styles.nameWrap}>
                          <h3>{speaker.text}</h3>
                        </div>
                        <div className={styles.statWrap}>
                          <div className={styles.item}>
                            <span className={styles.label}>h-index:</span>
                            <span>{speaker.payload.h_index}</span>
                          </div>
                          <span className={styles.split}>|</span>
                          <div className={styles.item}>
                            <span className={styles.label}>论文数:</span>
                            <span>{speaker.payload.n_pubs}</span>
                          </div>
                          <span className={styles.split}>|</span>
                          <div className={styles.item}>
                            <span className={styles.label}>引用数:</span>
                            <span>{speaker.payload.n_citation}</span>
                          </div>
                        </div>
                        <div className={styles.infoWrap}>
                          <p>{position ? <span className={styles.infoItem}>
                                      <Icon type="idcard"/>
                            { position }
                                    </span> : ''}</p>

                          <p>{aff ? <span className={styles.infoItem}>
                                      <Icon type="home"/>
                            { aff }
                                    </span> : ''}</p>
                        </div>
                        <div className={styles.tagWrap}>
                          {speaker.tags.map((tag) => {
                            return (<Link to={`/search/${tag.t}/0/30`} key={Math.random()}><Tag
                              className={styles.tag}>{tag.t}</Tag></Link>);
                          })}
                        </div>
                      </div>
                      <div>
                        <Button type='primary'
                                onClick={this.selectedExpert.bind(this, speaker)}>submit</Button>
                      </div>
                    </li>
                  )
                })}
              </div>
            </Modal>
          </div>
        </Col>
        <Col>
          <div className='ant-form-item'>
            <label className="ant-col-3" style={{textAlign:'right',paddingRight:10}}>专家简介: </label>
            <div className='ant-col-21'>
              <Input type='textarea' rows={4} size='large' placeholder='专家简介' ref='speakerBio'
                     onBlur={this.saveExpertInfo.bind(this, 'bio')}/>

            </div>
          </div>
        </Col>
      </div>
    );
  }
}

export default ExpertBasicInformation;
