/**
 *  Created by BoGao on 2017-06-05;
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Radio, Spin, Button } from 'antd';
import styles from './aminer-publications.less';
import { PublicationList } from '../../components/publication';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const PUBLIST_DEFAULT_SIZE = 50;
const pubSize = 20;
const operations =
  <span>
    <span>
      <ButtonGroup>
        <Button type="primary"><i className="fa fa-search-plus fa-lg" /></Button>
        <Button>Add Paper</Button>
      </ButtonGroup>
    </span>
    <span>
      <ButtonGroup>
        <Button type="primary"><i className="fa fa-gear fa-lg" /></Button>
        <Button>Remove Paper</Button>
      </ButtonGroup>
    </span>
  </span>;

class AminerPublications extends React.Component {

  state={};
  componentDidMount() {
    this.getPubsByCitation();
    this.getPubsByYearAll();
    this.getPublistInfoByID();
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { personId } = this.props;
    const nextPersonId = nextProps.personId;
    if (personId && nextPersonId) {
      if (personId !== nextPersonId) {
        return true;
      }
    }
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    const { personId } = this.props;
    const prevPersonId = prevProps.personId;
    if (personId && prevPersonId) {
      if (personId !== prevPersonId) {
        this.getPubsByCitation();
        this.getPubsByYearAll();
        this.getPublistInfoByID();
      }
    }
  }
  getPublistInfoByID = () => {
    const { personId } = this.props;
    const { dispatch } = this.props;
    const payload = {
      personId: personId,
    };
    dispatch({
      type: 'publications/getPublistInfo',
      payload,
    });
  };

  getPubsByYearAll = () => {
    const { personId } = this.props;
    const { dispatch } = this.props;
    const payload = {
      personId: personId,
      orderBy: 'byYear',
      offset: 0,
      size: pubSize,
      year: 'all',
    };
    dispatch({
      type: 'publications/getPublications',
      payload,
    });
  };
  getPubsByYear = (year, size) => {
    const { personId } = this.props;
    const { dispatch } = this.props;
    const payload = {
      personId: personId,
      orderBy: 'byYear',
      offset: 0,
      size: size,
      year: year,
    };
    dispatch({
      type: 'publications/getPublications',
      payload,
    });
  };

  getPubsByCitation = () => {
    const { personId } = this.props;
    const { dispatch } = this.props;
    const payload = {
      personId: personId,
      orderBy: 'byCitation',
      offset: 0,
      size: pubSize,
      citedTab: 'all',
    };
    dispatch({
      type: 'publications/getPublications',
      payload,
    });
  };
  getPubsByCit = (nc_lo, nc_hi, size) => {
    const { personId } = this.props;
    const { dispatch } = this.props;
    const citedTab = { nc_lo, nc_hi, size };
    const payload = {
      personId: personId,
      orderBy: 'byCitation',
      offset: 0,
      size: size,
      citedTab: citedTab,
    };
    dispatch({
      type: 'publications/getPublications',
      payload,
    });
  };
  /** API Call,exactly the parameters used by publication service. and errects:getPublications. */

  render() {
    const { publications, totalPubs } = this.props;
    const { pubListInfo } = publications;
    const years = pubListInfo.years;
    const ncites = pubListInfo.ncites && pubListInfo.ncites;

    return (
      <div className={styles.person_featured_papers}>
          <Tabs defaultActiveKey="1" type="card" tabBarExtraContent={operations}>
            <TabPane tab="By Year" key="1" onTabClick={this.getPubsByYearAll}>
              <span className={styles.button_zone} >
                  <ButtonGroup>
                    <Button size="large" onClick={this.getPubsByYearAll}>All<br />({totalPubs})</Button>
                    <Button size="large">Recent<br />{pubSize}</Button>
                    {years &&
                      <span>
                        {years.map((item) => {
                          return <Button size="small" onClick={this.getPubsByYear.bind(this, item.year, item.size)}>{item.year} </Button>;
                        })}
                      </span>
                    }
                  </ButtonGroup>
              </span>
              <div style={{ marginTop: 20 }} />
              <Spin spinning={publications.loading}>
                <PublicationList pubs={publications.resultsByYear} />
              </Spin>
            </TabPane>
            <TabPane tab="By Citation" key="2" onTabClick={this.getPubsByCitation}>
              <span className={styles.button_zone} >
                <ButtonGroup>
                  <Button size="large" onClick={this.getPubsByCitation}>All<br />({totalPubs})</Button>
                  <Button size="large">Top<br />{pubSize}</Button>
                  {ncites &&
                  <span>
                      {ncites.map((item) => {
                         if (item.nh) {
                          return <Button size="small" onClick={this.getPubsByCit.bind(this, item.nl, item.nh, item.size)}>{item.nl}~{item.nh} </Button>;
                        } else {
                          return <Button size="small" onClick={this.getPubsByCit.bind(this, item.nl, item.nh, item.size)}> >= {item.nl} </Button>;
                        }
                      })}
                    </span>
                  }
                </ButtonGroup>
              </span>
              <div style={{ marginTop: 20 }} />
              <Spin spinning={publications.loading}>
                <PublicationList pubs={publications.resultsByCitation} />
              </Spin>
            </TabPane>
          </Tabs>
      </div>
    );
  }
}

export default connect(({ publications }) => ({ publications }))(AminerPublications);
