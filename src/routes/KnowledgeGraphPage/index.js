/*
 * created by BoGAo on 2017-06-27.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux, Link } from 'dva/router';
import { Radio } from 'antd';
import styles from './index.less';
import { KnowledgeGraphTextTree } from '../knowledge-graph';
import { PublicationList } from '../../components/publication';
import { PersonListTiny } from '../../components/person';

const RadioGroup = Radio.Group;

class KnowledgeGraphPage extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  state = {
    searchMethod: 'or2', // [direct, and2, or2 ]
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query) || '';
    this.props.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
      },
    });
    this.props.dispatch({ type: 'knowledgeGraph/setState', payload: { query } });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //
  // }

  componentDidUpdate(prevProps, prevState) {
    const kg = this.props.knowledgeGraph;
    if (kg.node && (
        kg.node !== prevProps.knowledgeGraph.node ||
        this.state.searchMethod !== prevState.searchMethod
      )) {
      this.searchExpertsAndPubs();
    }
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

  searchExpertsAndPubs = () => {
    const kg = this.props.knowledgeGraph;
    // special query.
    let query = kg.node.name && kg.node.name.trim();
    const nwords = query.split(' ').length;
    if (this.state.searchMethod !== 'direct') { // just use query
      const parent = kg.kgFetcher.getNode(kg.node.parent);
      console.log('>> parent is ', parent);
      if (parent && this.state.searchMethod === 'and2' && nwords <= 2) {
        query = `(& ${kg.node.name}) ${parent.name}`;
      } else if (parent && this.state.searchMethod === 'or2' && nwords <= 2) {
        query = `(& ${kg.node.name}) (| ${parent.name})`;
      }
    }
    console.log('Search Expert & Publications with query: >>> ', query, 'escaped:', encodeURI(query));
    query = encodeURIComponent(query);

    this.props.dispatch({
      type: 'knowledgeGraph/searchPubs',
      payload: { query, offset: 0, size: 10, sort: 'relevance' },
    });
    this.props.dispatch({
      type: 'knowledgeGraph/searchExperts',
      payload: { query, offset: 0, size: 10, sort: 'relevance' },
    });
  };

  render() {
    const kg = this.props.knowledgeGraph;

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
          <div className={styles.right}>
            <div className="card definition">
              <div className="header">
                <h2>Definition:</h2>
              </div>
              <div className="text">
                {this.state.node && this.state.node.definition}
              </div>
            </div>
            <div className="card experts">
              <div className="header">
                <h2>Experts:</h2>
              </div>
              <div className="text">
                <PersonListTiny persons={kg.experts} />
              </div>
            </div>
            <div className="card pubs">
              <div className="header">
                <h2>Publications:</h2>
              </div>
              <div className="text">
                <PublicationList pubs={kg.publications} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ knowledgeGraph }) => ({ knowledgeGraph }))(KnowledgeGraphPage);
