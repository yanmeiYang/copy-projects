/**
 *  Created by BoGao on 2017-12-19;
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router';
import styles from './ACMForecastLabel.less';

@connect(({ acmforecast }, { person }) => ({
  pubs: person.attached && person.attached.two_top_cited_paper
  && acmforecast && acmforecast.pubsMap
  && person.attached.two_top_cited_paper.map(pid => acmforecast.pubsMap.get(pid)),
}))
@withRouter
export default class ACMForecastLabel extends Component {
  render() {
    const { person, pubs } = this.props;
    return (
      <div style={{ order: 10 }} className={styles.highCitedPaper}>
        High Cited Papers:
        {pubs && pubs.map((pub) => {
          console.log('pub: ', pub);
          const title = pub && pub.title;
          return (
            <div key={pub.id}>
              {title}, {pub.year} (cited by: {pub.num_citation})
            </div>
          );
        })}
      </div>
    );
  }
}
