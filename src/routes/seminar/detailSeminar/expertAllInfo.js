/**
 * Created by yangyanmei on 17/8/8.
 */
import React from 'react';
import { connect } from 'dva';
import { Rate, Icon } from 'antd';
import { routerRedux, Link } from 'dva/router';
import * as profileUtils from '../../../utils/profile-utils';
import styles from './index.less';

class ExpertAllInfo extends React.PureComponent {
  render() {
    const speakers = this.props.speakers;
    const pad = this.props.pad;
    return (
      <div>
        {speakers.map((aTalk) => {
          return (
            <div key={aTalk.speaker.aid + Math.random()} className={styles.workshop}>
              <div className={styles.workshopDetail}>
                {aTalk.title && <h5 className={styles.talkTitle}>主题: {aTalk.title}</h5>}
                {!aTalk.speaker.role.includes('president') &&
                <p style={{ marginBottom: 10 }}>
                  {aTalk.time &&
                  <span>
                    <strong>报告时间:&nbsp;</strong>
                    {pad(new Date(aTalk.time.from).getHours(), 2)}:
                    {pad(new Date(aTalk.time.from).getMinutes(), 2)}
                    {aTalk.time.to &&
                    <span>&nbsp;~&nbsp;
                      {pad(new Date(aTalk.time.to).getHours(), 2)}:
                      {pad(new Date(aTalk.time.to).getMinutes(), 2)}
                    </span>}
                  </span>}
                  {aTalk.location && <span style={{ marginLeft: 10 }}>
                    {aTalk.location.address &&
                    <span>
                      <strong>报告地点:&nbsp;</strong>
                      <span>{aTalk.location.address}</span>
                    </span>}
                  </span>}
                </p>}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  // flexWrap: 'wrap',
                }}>
                  <div className={styles.speakerAvatar}>
                    {aTalk.speaker.aid ?
                      <Link to={`/person/${aTalk.speaker.aid}`}>
                        <img
                          src={profileUtils.getAvatar(aTalk.speaker.img, aTalk.speaker.aid, 90)}
                          alt={aTalk.speaker.name} />
                      </Link> :
                      <img src={aTalk.speaker.img} alt={aTalk.speaker.name} />}
                  </div>
                  <div>
                    <ul className={styles.messages}>
                      <span>
                        {aTalk.speaker &&
                        <div>
                          {aTalk.speaker.name && <li>
                            <p>
                              <Icon type="user" />
                              <strong>姓名:&nbsp;</strong>
                              {aTalk.speaker.aid ?
                                <Link to={`/person/${aTalk.speaker.aid}`}>
                                  <span>{aTalk.speaker.name}</span>
                                </Link> : <span>{aTalk.speaker.name}</span>}
                            </p>
                          </li>}
                          <li>
                            {aTalk.speaker.position && aTalk.speaker.position !== ' ' &&
                            <p><Icon type="medicine-box" />
                              <strong>职称:&nbsp;</strong>
                              <span>{aTalk.speaker.position}</span></p>}
                          </li>
                          <li>
                            {aTalk.speaker.affiliation &&
                            <p>
                              <Icon type="environment-o" />
                              <strong>单位:&nbsp;</strong>
                              <span>{aTalk.speaker.affiliation}</span>
                            </p>}
                          </li>
                        </div>}
                      </span>
                      <span>
                        {aTalk.speaker.phone &&
                        <li>
                          <p>
                            <Icon type="phone" />
                            <strong>电话:&nbsp;</strong>
                            <span>{aTalk.speaker.phone}</span>
                          </p>
                        </li>}
                      </span>
                      <span>
                        {aTalk.speaker.email &&
                        <li>
                          <p>
                            <Icon type="mail" />
                            <strong>邮箱:&nbsp;</strong>
                            <span>{aTalk.speaker.email}</span>
                          </p>
                        </li>}
                      </span>
                    </ul>
                    <div className={styles.bio}>
                      {aTalk.speaker.bio ? <div>
                        <h5>个人简介:</h5>
                        <div className={styles.center}>
                          <p className="rdw-justify-aligned-block">{ aTalk.speaker.bio }</p>
                        </div>
                      </div> : ''}
                    </div>

                    {!aTalk.speaker.role.includes('president') &&
                    <div className={styles.abstract}>
                      {aTalk.abstract ? <div>
                        <h5>主题简介:</h5>
                        <div className={styles.center}>
                          <p className="rdw-justify-aligned-block">{aTalk.abstract}</p>
                        </div>
                      </div> : ''}
                    </div>}
                  </div>
                </div>
              </div>

              {/*<hr />*/}
            </div>
          );
        })}
      </div>
    );
  }
}

export default (ExpertAllInfo);
