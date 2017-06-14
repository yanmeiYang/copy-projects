/**
 * Created by yangyanmei on 17/6/9.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import TimeFormat from './time-format';
import styles from './workshop.less'

class WorkShop extends React.Component {
  render() {
    const aTalk = this.props;
    return (
      <div className={styles.workshopDetail}>
        {aTalk.title && <h5 className={styles.talkTitle}>{aTalk.title}</h5>}
        <div>
          <div className={styles.speakerAvatar}>
            <img src={aTalk.speaker.img} alt={aTalk.speaker.name}/>
          </div>
        </div>
        <ul className={styles.messages}>
          <span>
            {aTalk.speaker &&
            <div>
              <li>
                <p>
                  <Icon type='user'/>
                  <strong>Name:&nbsp;</strong>
                  <span>{aTalk.speaker.name}</span>
                </p>
              </li>
              <li>
                {aTalk.speaker.position &&
                <p><Icon type="medicine-box"/>
                  <strong>Position:&nbsp;</strong>
                  <span>{aTalk.speaker.position}</span></p>}
              </li>
              <li>
                {aTalk.speaker.affiliation &&
                <p><Icon type="environment-o"/>
                  <strong>Affiliation:&nbsp;</strong>
                  <span>{aTalk.speaker.affiliation}</span></p>}
              </li>
            </div>}
            </span>
          <span>
              {aTalk.time ? <li><p>
                <Icon type="clock-circle-o"/>
                <strong>Time:&nbsp;</strong>
                <TimeFormat {...aTalk.time} />
              </p></li> : ''}
            </span>
          <span>
              {aTalk.location ? <span>
                  {aTalk.location.address ? <li><p>
                    <Icon type="environment-o"/>
                    <strong>Time:&nbsp;</strong>
                    <TimeFormat {...aTalk.time} />
                  </p></li> : ''}</span> : ''}
            </span>
        </ul>
        <div>
          {aTalk.abstract ? <div>
            <h5>Abstract:</h5>
            <div className={styles.center}>
              <p className='rdw-justify-aligned-block'>{aTalk.abstract}</p>
            </div>
          </div> : ''}
        </div>
        <div>
          {aTalk.speaker.bio ? <div>
            <h5>Bio:</h5>
            <div className={styles.center}>
              <p className='rdw-justify-aligned-block'>{ aTalk.speaker.bio }</p>
            </div>
          </div> : ''}
        </div>
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(WorkShop);
