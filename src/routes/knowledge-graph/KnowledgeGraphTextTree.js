/**
 *  Created by BoGao on 2017-06-12;
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { classnames } from 'utils/index';
import styles from './KnowledgeGraphTextTree.less';
import { sysconfig } from 'systems';
import * as kgService from '../../services/knoledge-graph-service';
import { kgFetcher } from "../../services/knoledge-graph-service";


/*
 * @params: lang: [en|cn]
 * @methods: onItemClick(name, level, node);
 */
class KnowledgeGraphTextTree extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onItemClickCallback = props.onItemClick;
  }

  state = {// TODO remove
    tree: [],
  };

  componentDidMount() {
    this.queryKG(this.props.query);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.query !== this.props.query) {
      return true;
    }
    if (nextProps.kgdata !== this.props.kgdata) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.query && this.props.query !== prevProps.query) {
      console.log('matches?');
      this.queryKG(this.props.query);
    }
  }

  onItemClick = (e, node, level) => {
    // add class to element;
    if (this.selected) {
      this.selected.className = this.selected.className.replace(` ${styles.select}`, '');
    }
    e.currentTarget.className += ` ${styles.select}`;
    this.selected = e.currentTarget;

    if (this.onItemClickCallback) {
      this.onItemClickCallback(node, level);
    }
  };

  queryKG(query) {
    if (query) {
      this.props.dispatch({
        type: 'knowledgeGraph/kgFind',
        payload: { query, rich: 1, dp: 3, dc: 2, ns: 4, nc: 10000 },
      });
    }
  }


  showNode = (node, level) => {
    if (!node) {
      return;
    }
    const nameZH = node.name_zh ? `(${node.name_zh})` : '';
    const name = node.name === '_root' ? 'Computer Science' : `${node.name} ${nameZH}`;
    const childs = this.kgFetcher.getChildNode(node);
    const nameIcon = node.hit ?
      <i className={classnames('fa', 'fa-circle', styles.orange)} aria-hidden /> :
      <i className={classnames('fa', 'fa-circle-thin', styles.orange)} aria-hidden />;

    return (
      <div className={styles.node} key={node.id}>
        <div className={styles[`level_${level}`]}>

          {/*`item ${node.hit ? 'current' : ''}`*/}
          <div
            className={classnames(styles.item, node.hit ? styles.current : '')}
            onClick={e => this.onItemClick(e, node, level)}
          >
            <span className={styles.title}>
              <span>{nameIcon} <span className={styles.level}> {`L${level}`}</span> {name}
              </span>
              <div className={styles.tools}>
                {node.child_nodes.length > 0 && (
                  <div className={styles.tool}>
                    <i className="fa fa-plus-square-o" aria-hidden="true" />
                    {node.child_nodes.length}
                  </div>
                )}
              </div>
            </span>
            <div className={styles.tools}>
              {node.alias && node.alias.length > 0 &&
              <div className={styles.tool}>
                <span className={styles.label}>ALIAS: </span>
                {node.alias.map(a => <span key={a}>{a}, </span>)}
              </div>
              }
            </div>
          </div>
          {childs && childs.length > 0 &&
          childs.map((child) => {
            return this.showNode(child, level + 1);
          })
          }
        </div>

      </div>
    );
  };

  render() {
    const { query, kgdata, kgindex } = this.props;
    this.kgFetcher = kgService.kgFetcher(kgdata, kgindex);

    const tops = this.kgFetcher.findTops();
    return (
      <div className={styles.kgContainer}>
        {/* Search for: {query} */}

        {!tops &&
        <div>
          <span className={styles.emptyBlock}>Please input a keyword above</span>
        </div>}

        {tops && tops.map((node) => {
          return <div key={node.id}> {this.showNode(node, 0)} </div>;
        })}

      </div>
    );
  }

}

export default connect()(KnowledgeGraphTextTree);
