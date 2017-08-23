import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { FormattedMessage } from 'react-intl';
import styles from './index.less';
import { sysconfig } from '../../systems';
import { KgSearchBox } from '../../components/search';
import { Auth } from '../../hoc';

// function IndexPage({ dispatch, search }) {
@connect(({ app }) => ({ app }))
@Auth
export default class IndexPage extends React.Component {
  static displayName = 'IndexPage';

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  componentWillMount() {
    console.log('Enter IndexPage');
    this.dispatch({ type: 'app/layout', payload: { headerSearchBox: null } });
  }

  // componentWillUnmount() {
  //   this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  // };

  onSearch = ({ query }) => {
    if (query && query.trim() !== '') {
      this.dispatch(routerRedux.push({
        pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/20`,
      }));
    }
  };

  // function goToDetail(id) {
  //   dispatch(routerRedux.push({
  //     pathname: `/seminar/${id}`,
  //   }));
  // }
  //
  // function getMoreSeminard() {
  //   dispatch(routerRedux.push({
  //     pathname: `/seminar`,
  //   }));
  // }

  render() {
    // const { seminars } = search;
    const commonSearch = sysconfig.IndexPage_QuickSearchList;

    return (
      <div>
        <div className={styles.normal}>
          <h1 className={styles.title}>
            <FormattedMessage id="index.title" defaultMessage="Expert Search" />
          </h1>

          <KgSearchBox
            size="large" onSearch={this.onSearch}
            style={{ width: 500, boxShadow: '0 0 8px 0px rgba(99, 99, 99, 0.5)' }} />

          {/* <SearchBox size="large" style={{ width: 500 }} onSearch={this.onSearch} /> */}

          {/* 常用搜索 */}
          <p className={styles.commonSearch}>
            {
              commonSearch.map((query, index) => {
                return (
                  <span key={query}>
                    <Link
                      to={`/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
                    >{query}</Link>
                    <span>{(index === commonSearch.length - 1) ? '' : ', '}</span>
                  </span>
                );
              })
            }
          </p>

          {/* Insert Blocks in Config file. */}
          {sysconfig.IndexPage_InfoBlocks}

        </div>
        {/*
        <div className={styles.container}>
          <Row type='flex' justify='center'>
            协会组织
            <Col span='10'>
              <div className={styles.headline}>
                <h3>协会组织</h3>
              </div>
              <Row className={styles.orgList}>
                <Col>
                  {
                    organization.map((org) => {
                      return (
                        <Card className={styles.orgCard} title={
                          <span>
        <h3 className='ant-card-head-title'>{org.title}</h3>
        <span>&nbsp;({org.total})</span>
        </span>
                        } style={{ width: '80%' }} key={org.title}>
                          <ul>
                            <li>
                              {
                                org.avatars.map((avatar, index) => {
                                  return (<img src={avatar.avatar} key={index} />)
                                })
                              }
                            </li>
                          </ul>
                        </Card>
                      )
                    })
                  }
                  <div className={styles.footer} style={{ width: '80%' }}>更多协会
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span='12'>
              <div className={styles.headline}>
                <h3>协会活动</h3>
              </div>
              <div className={styles.seminar}>
                {
                  seminars.slice(0, 3).map((seminar) => {
                    const time = seminar.time.from.split('-');
                    return (
                      <li key={seminar.id}>
                        <div className={styles.time}>
                          <em>{time[1]}月</em>
                          <div className={styles.bot}>
                            <span><b>{time[2].split('T')[0]}</b>日</span>
                            <strong>{seminar.location.city}</strong>
                          </div>
                        </div>
                        <div className={styles.con}>
                          <h3>
                            <a href='javascript:void(0)'
                               onClick={goToDetail.bind(this, seminar.id)}>{seminar.title}</a>
                          </h3>
                          <div className={styles.info}>
                            <p>
        <span className={styles.type}>
        活动类型：{seminar.type === 0 ? 'seminar' : 'workshop'}
        </span>
                              <span>
        <em>关键字：</em>
        数据挖掘 机器学习 人工智能
        </span>
                            </p>
                            <p className={styles.location}>活动地点：{seminar.location.address}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })
                }
                <div className={styles.footer}>
                  <a href='javascript:void(0)' onClick={getMoreSeminard.bind()}>更多活动</a>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </Col>
          </Row>
        </div> */}
      </div>
    );
  }
}
