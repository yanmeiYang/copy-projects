/*
 * created by BoGAo on 2017-06-27.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import * as bridge from 'utils/next-bridge';
import { Radio, Tabs, message } from 'antd';
import { Layout } from 'routes';
import { Spinner } from 'components';
import { Message } from 'components/ui';
import { PublicationList } from 'components/publication/index';
import { PersonList } from 'components/person';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { Auth } from 'hoc';

import styles from './KnowledgeGraphPage.less';
import { KnowledgeGraphTextTree } from './index';

const tc = applyTheme(styles);

const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

@connect(({ app, knowledgeGraph, loading }) => ({ app, knowledgeGraph, loading }))
@Auth
export default class KnowledgeGraphPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    // query: '',
    searchMethod: 'or2', // [direct, and2, or2 ]
    infoTab: 'experts',
    query: '',
  };

  componentWillMount() {
    let { query } = queryString.parse(location.search);
    query = query || '-';
    this.setState({ query });
    // if (query) {
    //   this.setState({ query });
    // }
    this.dispatch({ type: 'knowledgeGraph/setState', payload: { query } });
  }

  // componentDidMount() {
  //
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  // }

  // 最佳实践：实验1
  componentDidUpdate(prevProps, prevState) {
    const kg = this.props.knowledgeGraph;
    // 没有node，一切都是扯淡.
    if (kg.node) {
      let needEffects = false;
      let mustEffects = false;

      // 点击左侧node，并且换了新node，要清空右侧三个框的内容。
      if (kg.node !== prevProps.knowledgeGraph.node) {
        // this.props.dispatch({ type: 'knowledgeGraph/resetInfoBlock' });
        mustEffects = true;
      }
      // 之后去调用api取当前的。
      // 在同一个node下，点击右侧标签进来的node一致，不清空.
      // TODO call search based on info tab? and check if value changed.

      // if searchMethod changed.
      if (this.state.searchMethod !== prevState.searchMethod) {
        // this.props.dispatch({ type: 'knowledgeGraph/resetExpertsAndPublications' });
        mustEffects = true;
      }

      // if infoTab changed.
      if (this.state.infoTab !== prevState.infoTab) {
        needEffects = true;
      }

      if (needEffects || mustEffects) {
        // console.log('this.state.infoTab === \'experts\'', this.state.infoTab === 'experts');
        // console.log('', kg.experts);
        // console.log('', kg.publications);
        if (this.state.infoTab === 'info') {
          // TODO call node.
          // this.props.dispatch({
          //   type: 'knowledgeGraph/setState',
          //   payload: { fullNode: this.props.knowledgeGraph.node },
          // });
        } else if ((this.state.infoTab === 'experts')) {
          if (!kg.experts || mustEffects) {
            const query = this.getQuery();
            this.props.dispatch({
              type: 'knowledgeGraph/searchExperts',
              payload: { query, offset: 0, size: 10, sort: 'relevance' },
            });
          }
        } else if ((this.state.infoTab === 'publications')) {
          if (!kg.publications || mustEffects) {
            const query = this.getQuery();
            this.props.dispatch({
              type: 'knowledgeGraph/searchPubs',
              payload: { query, offset: 0, size: 10, sort: 'relevance' },
            });
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  }

  onSearch = ({ query }) => {
    const location = this.props.location;
    const pathname = location.pathname;
    this.props.dispatch({ type: 'knowledgeGraph/setState', payload: { query } });
    // const href = window.location.href.split('?query=')[0] + '?query=' + query;
    // window.location.href = href;

    // pathname, query: { ...location.query, query },
    this.props.dispatch(routerRedux.push({
      pathname,
      search: `?query=${query}`,
    }));
    this.setState({ query });
  };

  onItemClick = (node, level) => {
    this.props.dispatch({ type: 'knowledgeGraph/setState', payload: { node } });
  };

  onSearchMethodChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      searchMethod: e.target.value,
    });
  };

  onInfoTabChange = (e) => {
    this.setState({ infoTab: e });
  };

  getQuery = () => {
    // special query.
    const kg = this.props.knowledgeGraph;
    let query = kg.node.name && kg.node.name.trim();
    const nwords = query.split(' ').length;
    if (this.state.searchMethod !== 'direct') { // just use query
      const parent = kg.kgFetcher.getNode(kg.node.parent);
      if (parent && this.state.searchMethod === 'and2' && nwords <= 2) {
        query = `(& ${kg.node.name}) ${parent.name}`;
      } else if (parent && this.state.searchMethod === 'or2' && nwords <= 2) {
        query = `(& ${kg.node.name}) (| ${parent.name})`;
      }
    }
    // console.log('Search : >>> ', query, 'escaped:', encodeURI(query));
    // query = encodeURIComponent(query);
    return query;
  };

  searchExpertsAndPubs = () => {
    if (this.state.infoTab === 'info') {
      // TODO call node.
      // this.props.dispatch({
      //   type: 'knowledgeGraph/setState',
      //   payload: { fullNode: this.props.knowledgeGraph.node },
      // });
    } else if (this.state.infoTab === 'experts') {
      const query = this.getQuery();
      this.props.dispatch({
        type: 'knowledgeGraph/searchExperts',
        payload: { query, offset: 0, size: 10, sort: 'relevance' },
      });
    } else if (this.state.infoTab === 'publications') {
      const query = this.getQuery();
      this.props.dispatch({
        type: 'knowledgeGraph/searchPubs',
        payload: { query, offset: 0, size: 10, sort: 'relevance' },
      });
    }
  };

  EmptyBlock = <span className={styles.emptyBlock}>Please select a node</span>;

  render() {
    const load = this.props.loading.models.knowledgeGraph;
    const kg = this.props.knowledgeGraph;
    const { popupErrorMessage } = kg;

    let infoExtra;
    if (this.state.infoTab === 'experts' && kg.node) {
      infoExtra = (
        <a href={`http://aminer.org/search?t=b&q=${this.getQuery()}`}
           target="_blank" rel="noopener noreferrer"> MORE
          <i className="fa fa-chevron-right" aria-hidden />
        </a>
      );
    } else if (this.state.infoTab === 'publications' && kg.node) {
      infoExtra = (
        <a href={`http://aminer.org/search/pub?t=b&q=${this.getQuery()}`}
           target="_blank" rel="noopener noreferrer"> MORE
          <i className="fa fa-chevron-right" aria-hidden />
        </a>
      );
    }

    // const searchHeader=<div>search for: {kg.}</div>
    return (
      <Layout contentClass={tc(['knowledgeGraphPage'])} query={this.state.query}
              onSearch={this.onSearch}>

        <div className={classnames('content-inner', styles.page)}>
          <Message message={popupErrorMessage} />

          <div className={styles.title}>
            <h1>
              <FM id="com.searchTypeWidget.label.KnowledgeGraph"
                  defaultMessage="Knowledge Graph" />
            </h1>

            {process.env.NODE_ENV !== 'production' &&
            <div className="toolbox" style={{ border: 'dashed 1px green' }}>
              <span>DEV: Search Method:</span>
              <RadioGroup onChange={this.onSearchMethodChange} value={this.state.searchMethod}>
                <Radio value="direct">Direct</Radio>
                <Radio value="and2">AND&lt;2</Radio>
                <Radio value="or2">OR&lt;2</Radio>
              </RadioGroup>
            </div>
            }

          </div>

          <div className={styles.meat}>
            <div className={styles.left}>

              <KnowledgeGraphTextTree
                query={kg.query}
                lang="en"
                kgdata={kg.kgdata}
                kgindex={kg.kgindex}
                onItemClick={this.onItemClick}
              />

            </div>

            <div className={`${styles.right} card-container`}>
              <Tabs
                type="card"
                onChange={this.onInfoTabChange}
                activeKey={this.state.infoTab}
                tabBarExtraContent={infoExtra}
              >
                <TabPane tab="INFO" key="info">
                  <div>
                    {kg.node && kg.node.name}
                    {kg.node && kg.node.definition}
                    {!kg.node && this.EmptyBlock}
                  </div>
                </TabPane>
                <TabPane tab="EXPERTS" key="experts">
                  <Spinner loading={load} />
                  {kg.experts
                    ? <PersonList
                      persons={bridge.toNextPersons(kg.experts)}
                      type="tiny"
                    />
                    : this.EmptyBlock
                  }

                </TabPane>
                <TabPane tab="PUBLICATIONS" key="publications">
                  <Spinner loading={load} />
                  {kg.publications
                    ? <PublicationList pubs={kg.publications} showLabels={false} />
                    : this.EmptyBlock
                  }
                </TabPane>
              </Tabs>

              {/* <div className="tabContent"> */}
              {/* {this.state.view[this.state.infoTab]} */}
              {/* </div> */}
            </div>

          </div>
        </div>
      </Layout>
    );
  }
}
