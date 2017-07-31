/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { Link } from 'dva/router';
import TimeFormat from './time-format';
import styles from './workshop.less';
import * as profileUtils from '../../../utils/profile_utils';

class WorkShop extends React.Component {
  render() {
    // console.log(aTalk.speaker.position);
    const aTalk = this.props;
    return (
      <div className={styles.workshopDetail}>
        {aTalk.title && <h5 className={styles.talkTitle}>{aTalk.title}</h5>}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div>
            <div className={styles.speakerAvatar}>
              {aTalk.speaker.aid ? <Link to={`/person/${aTalk.speaker.aid}`}><img src={profileUtils.getAvatar(aTalk.speaker.img, aTalk.speaker.aid, 90)} alt={aTalk.speaker.name} /></Link> : <img src={aTalk.speaker.img} alt={aTalk.speaker.name} />}
            </div>
          </div>
          <ul className={styles.messages}>
            <span>
              {aTalk.speaker &&
              <div>
                <li>
                  <p>
                    <Icon type="user"  />
                    <strong>姓名:&nbsp;</strong>
                    {aTalk.speaker.aid ? <Link to={`/person/${aTalk.speaker.aid}`}><span>{aTalk.speaker.name}</span></Link> : <span>{aTalk.speaker.name}</span>}
                  </p>
                </li>
                <li>
                  {aTalk.speaker.position && aTalk.speaker.position !== ' ' &&
                  <p><Icon type="medicine-box" />
                    <strong>职称:&nbsp;</strong>
                    <span>{aTalk.speaker.position}</span></p>}
                </li>
                <li>
                  {aTalk.speaker.affiliation &&
                  <p><Icon type="environment-o" />
                    <strong>单位:&nbsp;</strong>
                    <span>{aTalk.speaker.affiliation}</span></p>}
                </li>
              </div>}
            </span>
            <span>
              {aTalk.time ? <li><p>
                <Icon type="clock-circle-o" />
                <strong>时间:&nbsp;</strong>
                <TimeFormat {...aTalk.time} />
              </p></li> : ''}
            </span>
            <span>
              {aTalk.location ? <span>
                {aTalk.location.address ? <li><p>
                  <Icon type="environment-o" />
                  <strong>时间:&nbsp;</strong>
                  <TimeFormat {...aTalk.time} />
                </p></li> : ''}</span> : ''}
            </span>
          </ul>
        </div>

        <div className={styles.abstract}>
          {aTalk.abstract ? <div>
            <h5>报告摘要:</h5>
            <div className={styles.center}>
              <p className="rdw-justify-aligned-block">{aTalk.abstract}</p>
            </div>
          </div> : ''}
        </div>
        <div className={styles.bio}>
          {aTalk.speaker.bio ? <div>
            <h5>报告人简介:</h5>
            <div className={styles.center}>
              <p className="rdw-justify-aligned-block">{ aTalk.speaker.bio }</p>
            </div>
          </div> : ''}
        </div>
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(WorkShop);
