import React from 'react';
import styles from './information.less';
import classnames from 'classnames';
import * as profileUtils from '../../utils/profile-utils';
import { Button, Modal } from 'antd';
import * as personService from '../../services/person';

class Information extends React.Component {
  state = { visible: false };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.profile && this.props.profile) {
      if (nextProps.profile.id === this.props.profile.id) {
        return false;
      }
    }
    return true;
  }
  info = () => {
    Modal.info({
      title: 'This is a notification message',
      content: (
        <div>
          <p>some messages...some messages...</p>
          <p>some messages...some messages...</p>
        </div>
      ),
      onOk() {},
    });
  };

  render() {
    const profile = this.props.profile;
    const name = profile.name;
    const nameZh = profile.name_zh;
    const pos = profileUtils.displayPosition(profile.pos);
    const aff = profileUtils.displayAff(profile);
    const phone = profile.contact && profile.contact.phone;
    const fax = profile.contact && profile.contact.fax;
    const address = profile.contact && profile.contact.address;
    const email = profileUtils.displayEmailSrc(profile);
    const homepage = profile.contact && profile.contact.homepage;

    return (
      <div className={classnames(styles.profile_info, 'container-wrong')}>

        <div className={styles.info_zone}>
          <div className={styles.title}><h2><i className="fa fa-archive fa-fw" /> Information</h2>
            <span className={styles.rank}>
              <Button shape="circle" size="small" onClick={this.info}>
                <i className="fa fa-edit fa-fw" />
              </Button>
            </span>
          </div>
          <div className={styles.spliter} />
          <div className={styles.expert_basic_info}>
            <div className={styles.expert_basic_info_left}>
              {name && <p> <i className="fa fa-user fa-fw" /><span className={styles.description}>Name:</span> {name}</p>}
              {nameZh && <p> <i className="fa fa-user fa-fw" /><span className={styles.description}>名字(Chinese Name):</span>  {nameZh}</p>}
              {pos && <p> <i className="fa fa-briefcase fa-fw" /><span className={styles.description}> Position: </span>{pos}</p>}
              {phone && <p> <i className="fa fa-phone fa-fw" /><span className={styles.description}> Phone: </span>{phone}</p>}
              {fax && <p> <i className="fa fa-fax fa-fw" /><span className={styles.description}> Fax:</span> {fax}</p>}
              {email &&
              <p>
                <i className="fa fa-envelope fa-fw" />
                 <span className={styles.description}> Email:
                   <img className="emailImg" src={`https://api.aminer.org/api/${email}`} alt="email"
                     style={{ verticalAlign: 'middle' }} />
                 </span>
              </p>}
              {aff && <p> <i className="fa fa-institution fa-fw" /><span className={styles.description}> Affiliation: </span>{aff}</p>}
              {address && <p> <i className="fa fa-building fa-fw" /><span className={styles.description}> Address: </span>{address}</p>}
              {homepage &&
              <p className="hp">
                <a href={homepage} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-globe fa-fw" /><span className={styles.description}> Homepage:</span> {homepage}
                </a>
              </p>
              }
              <span style={{ marginTop: 16 }} />
            </div>
          </div>
          {/* TODO 这里放一个可以手工添加修改的tabs. */}

        </div>
        {/*{console.log('=========', profile)}*/}
        {false && <div>
          <div>Radar</div>
          <div>Tags</div>
        </div>
        }

      </div>
    );
  }

}
export default Information;
