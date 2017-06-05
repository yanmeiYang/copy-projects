import React from 'react';
import { Badge } from 'antd';
import styles from './publication-list.less';
import * as personService from '../../services/person';
import * as pubService from '../../services/publication';

class PublicationList extends React.Component {
  state = {};

  render() {
    const pubs = this.props.pubs;
    const MaxAuthorNumber = 10;

    return (
      <div className={styles.publist}>
        <ul>{pubs && pubs.map((item, pubindex) => {
          const labels = pubService.getPubLabels(item);
          const venue = pubService.getVenueName(item.venue);

          return item &&
            (<li key={item.id}>
              <div className={styles.title_line}>
                <span className={styles.title}>
                  <a
                    href={pubService.getArchiveUrlByPub(item)}
                    target="_blank" rel="noopener noreferrer"
                  >
                    {item.pdf && item.pdf.length > 0 && (
                      <i className="fa fa-file-pdf-o fa-fw" style={{ color: '#a94442' }} />
                    )}
                    {((item.lang === 'zh') ? item.title_zh : item.title) }
                  </a>
                </span>
                <div className={styles.labels}>
                  {labels && labels.map((label, index) => {
                    return (<span key={index}>
                      <Badge
                        count={label}
                        style={{
                          borderColor: 'darkred',
                          backgroundColor: 'rgba(132,0,0,0.8)',
                          color: '#fff',
                          borderRadius: '5px',
                        }}
                      />&nbsp;</span>
                    );
                  })}
                </div>

              </div>

              <div className={styles.authors}>
                {
                  item.authors && item.authors.slice(0, MaxAuthorNumber).map((author, index) => {
                    // const authorUniqueKey = `${item.id}-${author.id}-${author.name}`;
                    const authorUniqueKey = `${pubindex}-${index}`;
                    return (
                      <span key={authorUniqueKey}>
                        {author.id &&
                        <a href={personService.getProfileUrl(author.name, author.id)}>
                          {author.name}
                        </a>
                        }
                        {!author.id && author.name}
                        {item.authors.length - 1 > index ? ', ' : ''}
                        {index === MaxAuthorNumber - 1 && item.authors.length > MaxAuthorNumber ? '...' : ''}
                      </span>
                    );
                  })
                }
              </div>

              {venue && <div className="">{venue} { item.year && <span>({item.year})</span>}</div>}

              {item.num_citation > 0 && <div className={styles.citedby}>
                <a href={item.urls[item.urls.length - 1]} target="_blank" rel="noopener noreferrer">
                  <span>Cited by: {item.num_citation}</span>
                </a>
              </div>}

            </li>);
        })}
        </ul>
      </div>

    );
  }
}

export default PublicationList;
