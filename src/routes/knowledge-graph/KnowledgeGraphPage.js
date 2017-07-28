/*
 * created by BoGAo on 2017-06-27.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import { Radio, Tabs } from 'antd';
import { Spinner } from '../../components/index';
import styles from './KnowledgeGraphPage.less';
import { KnowledgeGraphTextTree } from './index';
import { PublicationList } from '../../components/publication/index';
import { PersonListTiny } from '../../components/person/index';

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

class KnowledgeGraphPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    searchMethod: 'or2', // [direct, and2, or2 ]
    infoTab: 'experts',
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query) || '';
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
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
    this.props.dispatch(routerRedux.push({
      pathname, query: { ...location.query, query },
    }));
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
    query = encodeURIComponent(query);
    return query;
  };

  searchExpertsAndPubs = () => {
    const kg = this.props.knowledgeGraph;

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

  EmptyBlock = <span className={styles.emptyBlock}>Please select a node!</span>;

  render() {
    const load = this.props.loading.models.knowledgeGraph;
    const kg = this.props.knowledgeGraph;

    let infoExtra;
    // <a href={`/${sysconfig.SearchPagePrefix}/${this.getQuery()}/0/30`}
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
      <div className={classnames('content-inner', styles.page)}>
        <div className={styles.title}>
          <h1> 知识图谱 </h1>
          <div className="toolbox">
            <span>Search Method:</span>
            <RadioGroup onChange={this.onSearchMethodChange} value={this.state.searchMethod}>
              <Radio value="direct">Direct</Radio>
              <Radio value="and2">AND&lt;2</Radio>
              <Radio value="or2">OR&lt;2</Radio>
            </RadioGroup>
          </div>
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
                  ? <PersonListTiny persons={kg.experts} />
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
    );
  }
}

export default connect(
  ({ knowledgeGraph, loading }) => ({ knowledgeGraph, loading }),
)(KnowledgeGraphPage);