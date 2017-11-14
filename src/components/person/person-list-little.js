import React from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import { config, compare, hole } from 'utils';
import { sysconfig } from 'systems';
import * as display from 'utils/display';
import { Indices } from 'components/widgets';
import PersonTags from 'components/person/PersonTags';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import styles from './person-list-little.less';
import * as profileUtils from '../../utils/profile-utils';


/**
 * @param param
 *
 */
class PersonListLittle extends React.PureComponent {
  constructor(props) {
    super(props);
    this.personLabel = props.personLabel;
  }

  onClick = (person) => {
    if (this.props.onClick) { // onClick是个参数，判断组件里面是否有这个对象
      this.props.onClick(person); //有的话将参数传递进去
    }
  };


  render() {
    const { persons } = this.props;
    console.log("person",persons)
    // let man = '';
    // if (typeof (persons.person.name_zh) !== undefined) {
    //   man = this.props.person.name_zh;
    // } else {
    //   man = 'Experts';
    // }
    return (
      <div className={styles.page}>
        <div className={styles.aaa}>
          <div calssName={styles.headline}>
            <h2 className={styles.h2}>
              <i className="fa fa-user" />
              <span className={styles.word}> Experts  </span>
            </h2>
          </div>
        </div>

        <div className={styles.personList}>
          {
            persons && persons.map((person) => {
              const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
              const indices = person.indices.h_index;
              const pos = profileUtils.displayPosition(person.pos);
              const aff = profileUtils.displayAff(person);

              return (
                <div key={person.id} role="presentation" className="item" onClick={this.onClick.bind(this, person)}>
                  <div className="avatar_zone">
                    <img
                      src={profileUtils.getAvatar(person.avatar, '', 90)}
                      className="avatar"
                      alt={name}
                      title={name}
                    />
                  </div>
                  <div>{name &&
                  <div>
                    <h2 className="section_header">
                      <Icon type="user" />
                      {name}
                      {false && <span className="rank">会士</span>}
                    </h2>
                    {this.personLabel && this.personLabel(person)}
                  </div>}
                    <div className="zone">
                      <div className="contact_zone">
                        <h3><Icon type="solution" /> h_index: {indices}</h3>
                      </div>
                    </div>
                    {pos && <span><i className="fa fa-briefcase fa-fw" /> {pos}</span>}
                    {pos && <br />}
                    {aff && <span><i className="fa fa-institution fa-fw" /> {aff}</span>}
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

    );
  }
}

export default PersonListLittle;
