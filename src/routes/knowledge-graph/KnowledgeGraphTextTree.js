/**
 *  Created by BoGao on 2017-06-12;
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './KnowledgeGraphTextTree.less';
import * as kgService from '../../services/knoledge-graph-service';


/*
 * @params: lang: [en|cn]
 * @methods: onItemClick(name, level, node);
 */
class KnowledgeGraphTextTree extends React.Component {
  constructor(props) {
    super(props);
    this.onItemClick = props.onItemClick;
  }

  state = {
    tree: [],
  };

  componentDidMount() {
    console.log(this.props);
    this.updateD3(this.props.query);
  }

  componentDidUpdate(prevProps, prevState) {
    // this.emptyD3();
    if (prevProps.query === this.props.query) {
      return false;
    }
    this.updateD3(this.props.query);
  }

  updateD3(query) {
    kgService.getKGSuggest(query, (result) => {
      if (!result) {
        // this.emptyD3();
        this.setState({ tree: '' });
        return;
      }
      this.setState({ tree: result });
    });
  }

  showNode = (node, level) => {
    return (
      <div className="node" key={`${node.name}${level}`}>
        <div className={`name level_${level}`}>
          <span className="title">
            <Link
              activeClassName={styles.active}
              onClick={() => this.onItemClick(node.name, level, node)}
            >
              {level === 0 ? 'Computer Science' : `${node.name} (${node.zh})`}
            </Link>
            <Link className="search" to={`/search/${node.name}/0/20`}>
              SEARCH
            </Link>
          </span>
          {(node.children && node.children.length > 0) &&
          node.children.map((child) => {
            return this.showNode(child, level + 1);
          })
          }
        </div>
      </div>
    );
  }

  render() {
    let treeNode = '';
    if (this.state.tree) {
      treeNode = this.showNode(this.state.tree, 0);
    }
    return (
      <div className={styles.vis_container}>
        {treeNode}
      </div>
    );
  }

}

export default connect()(KnowledgeGraphTextTree);
