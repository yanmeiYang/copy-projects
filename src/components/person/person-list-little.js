import React from 'react';
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.persons === this.props.persons) {
      return false;
    }
    return true;
  }

  onClick = (id) => {
    // alert(id);
    if( this.props.onClick){
      this.props.onClick(id);
    }
  }

  render() {
    const { persons } = this.props;
    return (
      <div className={styles.personList}>
        {
          persons && persons.map((person) => {
            const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
            const indices = person.indices.h_index;

            return (
              <div key={person.id} className="item" onClick={this.onClick.bind(this, person.id)}>
                <div className="avatar_zone">
                  <img
                    src={profileUtils.getAvatar(person.avatar, '', 90)}
                    className="avatar"
                    alt={name}
                    title={name}
                  />
                </div>

                <div className="info_zone">
                  {name &&
                  <div className="title">
                    <h2 className="section_header">
                      {name}
                      {false && <span className="rank">会士</span>}
                    </h2>
                    {this.personLabel && this.personLabel(person)}
                  </div>}
                  <div className="zone">
                    <div className="contact_zone">
                      <h3>h_index: {indices}</h3>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        }
      </div>
    );

    // console.log("persons is ", this.props.persons);
  }
}

export default PersonListLittle;
