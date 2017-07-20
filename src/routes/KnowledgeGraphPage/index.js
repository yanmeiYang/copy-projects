/*
 * created by BoGAo on 2017-06-27.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux, Link } from 'dva/router';
import styles from './index.less';
import { KnowledgeGraphTextTree } from '../knowledge-graph';
import { sysconfig } from '../../systems';

class KnowledgeGraphPage extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  state = {
    node: {},
    experts: {},
    publications: {},
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

  onSearch = ({ query }) => {
    const location = this.props.location;
    const pathname = location.pathname;
    this.props.dispatch({ type: 'knowledgeGraph/setState', payload: { query } });
    this.props.dispatch(routerRedux.push({
      pathname, query: { ...location.query, query },
    }));
  };

  onItemClick = (node, level) => {
    this.setState({ node });

  };

  render() {
    const kg = this.props.knowledgeGraph;
    return (
      <div className={classnames('content-inner', styles.page)}>
        <div className={styles.title}>
          <h1> 知识图谱 </h1>
          <div className="toolbox">TODO这里放一些工具</div>
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
              </div>
            </div>
            <div className="card pubs">
              <div className="header">
                <h2>Publications:</h2>
              </div>
              <div className="text">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ knowledgeGraph }) => ({ knowledgeGraph }))(KnowledgeGraphPage);
