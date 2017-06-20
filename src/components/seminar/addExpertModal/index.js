/**
 * Created by yangyanmei on 17/6/20.
 */
import React from 'react';
import { Modal, Button, Input, Form, Col, Tag, Icon } from 'antd';
import { Link } from 'dva/router';
import CanlendarInForm from '../calendar';
import ExpertBasicInformation from '../expertBasicInformation/expertBasicInformation';
import defaultImg from '../../../assets/people/default.jpg';
import styles from './index.less'
const FormItem = Form.Item;
class AddExpertModal extends React.Component {
  state = {
    modalVisible: true,
    step2: false,
    step3: false,
    step4: false,
  };

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  setStep(step, visible) {
    this.setState({ [step]: visible });
  }

  //增加嘉宾
  getImg = (src) => {
    if (src) {
      return src;
    } else {
      return defaultImg;
    }
  };

  suggestExpert(step, visible) {
    console.log(this.props);
    this.setState({ [step]: visible });
    let data = {};
    data = {
      name: this.refs.speakerName.refs.input.value,
      position: this.refs.speakerPos.refs.input.value,
      affiliation: this.refs.speakerAff.refs.input.value,
      title: '',
    };
    this.props.parentProps.dispatch({ type: 'seminar/getSpeakerSuggest', payload: data });
    // fetch(config.baseURL + config.api.speakerSuggest, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': localStorage.getItem('token')
    //   },
    //   body: JSON.stringify(payload),
    // }).then(function (response) {
    //   return response.json().then(function (json) {
    //     return json;
    //   }).then(function (json) {
    //     t.setState({
    //       suggestSpeakers: json,
    //       searchExperts: true,
    //     });
    //
    //   });
    // });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const { modalVisible, step2, step3, step4 } = this.state;
    const { integral, parentProps } = this.props;
    const { speakerSuggests } = parentProps.seminar;
    return (
      <Modal
        title='Add Expert'
        visible={modalVisible}
        width={640}
        footer={null}
        wrapClassName={styles.addExpertModal}
      >
        {!step2 && <div>
          <FormItem
            {...formItemLayout}
            label="演讲标题"
          >
            <Input placeholder='请输入活动名称。。。' ref='talkTitle'/>
          </FormItem>
          {/*<FormItem>*/}
          {/*<Col><label>专家信息</label></Col>*/}
          {/*<ExpertBasicInformation integral={integral} callbackParent={this.onExpertInfoChanged}/>*/}
          {/*</FormItem>*/}
          <FormItem
            {...formItemLayout}
            label={(<span>活动时间&nbsp;</span>)}
            hasFeedback>
            <CanlendarInForm callbackParent={this.onChildTalkChanged}/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>演讲地点&nbsp;</span>)}>
            <Input placeholder='请输入活动地点。。。' ref='talkLocation'/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>演讲摘要&nbsp;</span>)}>
            <Input type='textarea' rows={4} placeholder='请输入演讲摘要。。。' ref='talkAbstract'/>
          </FormItem>
          {/*<Button type='primary' className={styles.saveExpert} onClick={this.saveTalkData}>保存</Button>*/}
          <Button key="submit" type="primary" size="large" onClick={() => this.setStep('step2', true)}>
            下一步
          </Button>
        </div>}
        {step2 && !step3 && <div>
          <Col><label>专家信息</label></Col>
          <FormItem
            {...formItemLayout}
            label={(<span>姓名&nbsp;</span>)}>
            <Input size='large' placeholder='嘉宾姓名' ref='speakerName'/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>职称&nbsp;</span>)}>
            <Input size='large' placeholder='嘉宾职称' ref='speakerPos'/>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(<span>单位&nbsp;</span>)}>
            <Input size='large' placeholder='嘉宾单位' ref='speakerAff'/>
          </FormItem>
          <Button key="submit" type="primary" size="large" onClick={this.suggestExpert.bind(this, 'step3', true)}>
            下一步
          </Button>
        </div>}
        {step3 && speakerSuggests && !step4 &&
        <div>
          <div className={styles.personWrap}>
            {speakerSuggests.map((speaker) => {
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

                      <p>{aff && <span className={styles.infoItem}>
                                          <Icon type="home"/>
                        { aff }
                                        </span> }</p>
                    </div>
                    <div className={styles.tagWrap}>
                      {speaker.tags.map((tag) => {
                        return (<Link to={`/search/${tag.t}/0/30`} key={Math.random()}><Tag
                          className={styles.tag}>{tag.t}</Tag></Link>);
                      })}
                    </div>
                  </div>
                  <div>
                    <Button type='primary'>submit</Button>
                  </div>
                </li>
              )
            })}
          </div>
          <div>
            <Button key="submit" type="primary" size="large" onClick={this.suggestExpert.bind(this, 'step4', true)}>
              下一步
            </Button>
          </div>
        </div>}
        {step4 && <div>
          <FormItem>
            <Col><label>专家信息</label></Col>
            <ExpertBasicInformation integral={integral} callbackParent={this.onExpertInfoChanged}/>
          </FormItem>
          <Button key="submit" type="primary" size="large">
            提交
          </Button>
        </div>}
      </Modal>
    )
  }
}

export

default(AddExpertModal);
