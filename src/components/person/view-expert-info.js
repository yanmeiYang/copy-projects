/**
 * Created by yangyanmei on 17/9/5.
 */
import React from 'react';
import QRCode from 'qrcode.react';
import { Tooltip } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import styles from './view-expert-info.less';
// import * as personService from '../../services/person';

export default class ViewExpertInfo extends React.PureComponent {
  // TODO 发送邮件先注释掉
  // getEmail = (id) => {
  //   const suggestPromise = personService.personEmailStr(id);
  //   suggestPromise.then(
  //     (data) => {
  //       this.setState({ loading: false });
  //       const email = data.data.email;
  //       this.refs[`mail_${id}`].href = `mailto:${email}`;
  //       this.refs[`mail_${id}`].click();
  //     },
  //     (err) => {
  //       console.log('failed', err);
  //     },
  //   ).catch((error) => {
  //     console.error(error);
  //   });
  // };

  render() {
    const person = this.props.person;
    if (!person) {
      return false;
    }
    return (
      <div className={styles.right_zone}>
        {person.num_viewed > 0 &&
        <p className={styles.views}>
          <i className="fa fa-eye fa-fw" />&nbsp;
          <span className={styles.views_count}>{person.num_viewed}</span>&nbsp;
          <FM id="com.PersonList.label.views" defaultMessage="views" />
        </p>}

        {person.contact && person.contact.homepage &&
        <p>
          <a href={person.contact.homepage}>
            <i className="fa fa-home" />&nbsp;
            <FM id="com.PersonList.label.homepage" defaultMessage="Homepage" />
          </a>
        </p>}

        {/*{person.contact && person.contact.has_email &&*/}
        {/*<p>*/}
        {/*<a onClick={this.getEmail.bind(this, person.id)}>*/}
        {/*<i className="fa fa-envelope" />&nbsp;*/}
        {/*<FM id="com.PersonList.label.sendEmail" defaultMessage="Send Email" />*/}
        {/*</a>*/}
        {/*<a ref={`mail_${person.id}`} style={{ display: 'none' }} />*/}
        {/*</p>}*/}

        {person.id &&
        <Tooltip placement="left" title={
          <QRCode value={`https://aminer.org/profile_mobile/${person.id}`} size={90} />
        }>
          <p className={styles.container_qrCode}>
            <i className="fa fa-qrcode" />&nbsp;
            <FM id="com.PersonList.label.qrcode" defaultMessage="QR Code" />
          </p>
        </Tooltip>}
      </div>
    );
  }
}
