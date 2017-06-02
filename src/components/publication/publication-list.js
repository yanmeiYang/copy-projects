import React from 'react';
import styles from './publication-list.less';
import * as profileUtils from '../../utils/profile_utils';
import * as pubService from '../../services/publication';

class PublicationList extends React.Component {
  state = {};

  render() {
    const pubs = this.props.pubs;
    return (
      <div className={styles.publist}>
        <ul>{pubs && pubs.map((item) => {
          return item &&
            (<li key={item.id}>
              <a
                href={pubService.getArchiveUrlByPub(item)} target="_blank"
                rel="noopener noreferrer"
              >{item.title}</a>
            </li>);
        })}
        </ul>
      </div>

    );
  }
}

export default PublicationList;
