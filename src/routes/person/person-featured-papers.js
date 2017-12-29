/**
 *  Created by BoGao on 2017-06-05;
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Radio, Spin } from 'antd';
import styles from './person-featured-papers';
import { PublicationList } from '../../components/publication';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const PUBLIST_DEFAULT_SIZE = 50;

class PersonFeaturedPapers extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.personId !== nextProps.personId) {
      if (nextProps.personId) {
        this.params.personId = nextProps.personId;
        // Call most cited papers. Top 5
        this.props.dispatch({
          type: 'publications/getPublications',
          payload: this.params,
        });
      }
    }
  }

  /** API Call,exactly the parameters used by publication service. and errects:getPublications. */
  params = {
    personId: '',
    orderBy: 'byCitation',
    offset: 0,
    size: 5,
  };

  render() {
    const { publications } = this.props;
    const { pubListInfo } = publications;
    const years = pubListInfo.years;
    const ncites = pubListInfo.ncites && pubListInfo.ncites;

    return (
      <div className={styles.person_featured_papers}>
        <PublicationList pubs={publications.resultsByCitation} />
      </div>
    );
  }
}

export default connect(({ publications }) => ({ publications }))(PersonFeaturedPapers);
