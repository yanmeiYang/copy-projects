/**
 *  Created by BoGao on 2017-06-12;
 */
import React from 'react';
import { connect } from 'dva';
import styles from './KnowledgeGraphSearchHelper.less';
import * as d3 from '../../../public/d3/d3.min';
import { sysconfig } from '../../systems';

const controlDivId = 'kgvis';

/*
 * @params: lang: [en|cn]
 */
class KnowledgeGraphSearchHelper extends React.PureComponent {
  componentDidMount() {
    this.searchKG(this.props.query);
  }

  shouldComponentUpdate(nextProps) {
    // console.log('-----', nextProps);
    if (this.props.query !== nextProps.query) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('KG: query updated to ', nextProps.query);
      }
      this.searchKG(nextProps.query);
      return false;
    }

    if (this.props.knowledgeGraph.kgdata !== nextProps.knowledgeGraph.kgdata) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    const { kgdata } = this.props.knowledgeGraph;

    if (process.env.NODE_ENV !== 'production') {
      console.log('KG: kgdata: ', kgdata);
    }
    if (!kgdata || (kgdata.status === false && !kgdata.hits)) {
      this.emptyD3();
      this.closeZone();
    } else {
      // TODO change mode
      const targetData = this.convertToHelperData();
      this.emptyD3();
      this.createD3(targetData);
    }
  }

  convertToHelperData = () => {
    const { kgdata, kgFetcher } = this.props.knowledgeGraph;
    if (kgdata && kgdata.hits && kgdata.hits.length > 0) {
      // TODO we need to find a high level node.
      // find node with score 0, this is root node.
      let rootNode;
      const rootNodes = kgdata.hits.filter(item => item.score === 0);
      if (rootNodes && rootNodes.length > 0) {
        rootNode = rootNodes[0];
      } else {
        // TODO sort and find node with highest score.
        rootNode = kgdata.hits[0]; // implement this.
      }
      // construct a target node.
      const topNode = kgFetcher.findTop(rootNode);
      console.log('topNode is ', topNode);
      let targetNode = this.createNode(topNode, null, 1);
      console.log(',,,', targetNode);
      return targetNode;
    }
  };

  maxLevel = 3;

  createNode = (node, targetNode, level) => {
    const { kgFetcher } = this.props.knowledgeGraph;
    // let tn = targetNode;
    const currentNode = {
      name: node.name,
      children: [],
      definition: node.definition,
      zh: node.name_zh,
      level,
    };
    if (targetNode) {
      targetNode.children.push(currentNode);
    }
    if (this.maxLevel > level
      && node.child_nodes && node.child_nodes.length > 0) {
      node.child_nodes.map((childId) => {
        const child = kgFetcher.getNode(childId);
        // console.log('>', childId, child);
        if (child) {
          this.createNode(child, currentNode, level ? level + 1 : 1);
        }
        return false;
      });
    }
    return currentNode;
  };

  searchKG = (query) => {
    this.props.dispatch({
      type: 'knowledgeGraph/kgFind',
      payload: { query, rich: 1, dp: 1, dc: 1, ns: 3, nc: 4 },
    });
  };

  // If no suggestion, hide the whole div.
  showZone = () => {
    d3.select(`#${controlDivId}`)
      .style('width', '452px')
      .style('height', '261px');
  };

  emptyD3 = () => {
    const a = document.getElementById(controlDivId);
    if (a) {
      a.innerHTML = '';
    }
  };

  closeZone = () => {
    d3.select(`#${controlDivId}`)
      .style('width', '0px')
      .style('height', '0px');
  };

  // Create D3 Object.
  createD3 = (data) => {
    // Set the dimensions and margins of the diagram
    const margin = { top: 28, right: 20, bottom: 30, left: 20 };
    const width = 452 - margin.left - margin.right;
    const height = 261 - margin.top - margin.bottom;

    let lang = sysconfig.Language;
    if (this.props.lang) {
      lang = this.props.lang === 'cn' ? 'cn' : 'en';
    }

    this.showZone();
    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select(`#${controlDivId}`).append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let i = 0;
    const duration = 400;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([width, height]);


    // Assigns parent, children, height, depth
    if (data == null) {
      data = {};
    }
    const root = d3.hierarchy(data, (d) => {
      return d.children;
    });
    root.x0 = width / 2;
    root.y0 = 0;

    // Collapse after the second level
    // root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    function update(source) {
      // Assigns the x and y position for the nodes
      const treeData = treemap(root);

      // Compute the new tree layout.
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      // Normalize for fixed-depth.
      nodes.forEach((d) => {
        if (d.data.level !== 3) {
          d.y = d.depth * 40;
        } else {
          d.y = d.depth * 60;
        }
      });

      // ****************** Nodes section ***************************

      // Update the nodes...
      const node = svg.selectAll('g.node')
        .data(nodes, (d) => {
          return d.id || (d.id = ++i);
        });

      // Enter any new modes at the parent's previous position.
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', (d) => {
          // return `translate(${source.y0},${source.x0})`;
          return `translate(${source.x},${source.y})`;
        })
        .on('click', click);

      // Add Circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style('fill', (d) => {
          return d.children || d._children ? 'lightsteelblue' : '#fff';
        });

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('y', (d) => {
          if (d.data.level !== 3) {
            if (d.data.level === 2 && !(d.children || d._children)) {
              return 8;
            }
            return d.children || d._children ? -18 : 18;
          } else {
            return d.children || d._children ? -18 : 8;
          }
        })
        .attr('text-anchor', (d) => {
          if (d.data.level === 2) {
            return d.children || d._children ? 'middle' : '';
          }
          if (d.data.level !== 3) {
            return 'middle';
          }
          return '';
        })
        .html((d) => {
          const name = lang === 'cn' ? d.data.zh : d.data.name;
          return `<a class="nodeLink" href="/${sysconfig.SearchPagePrefix}/${name}/0/${sysconfig.MainListSize}">${name}</a>`;
        })
        .attr('writing-mode', (d) => {
          return d.data.level === 3 || (d.data.level === 2 && !(d.children || d._children))
            ? 'tb' : '';
        })
        .on('mouseover', d => bindMouseOver(d))
        .on('mouseout', d => bindMouseOut(d));

      // UPDATE
      const nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr('transform', (d) => {
          return `translate(${d.x},${d.y})`;
        });

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 6)
        .style('fill', (d) => {
          return d._children ? 'lightsteelblue' : '#fff';
        })
        .attr('cursor', 'pointer');


      // Remove any exiting nodes
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', (d) => {
          return `translate(${source.x},${source.y})`;
        })
        .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      const link = svg.selectAll('path.link')
        .data(links, (d) => {
          return d.id;
        });

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal(o, o);
        });

      // UPDATE
      const linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
        .duration(duration)
        .attr('d', (d) => {
          return diagonal(d, d.parent);
        });

      // Remove any exiting links
      const linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal(o, o);
        })
        .remove();

      // Store the old positions for transition.
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
        const path =
          `M ${s.x} ${s.y} 
           C ${s.x} ${(s.y + d.y) / 2 },
             ${d.x} ${(s.y + d.y) / 2 },
             ${d.x} ${d.y}`;
        return path;
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }

    // popup window

    // let nodeId = '';
    let mouseOnDiv = false;

    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'd3mask')
      .style('opacity', 0)
      .on('mouseover', (d) => {
        mouseOnDiv = true;
      })
      .on('mouseout', (d) => {
        mouseOnDiv = false;
        hideMask();
      });

    function showMask(d) {
      div.transition()
        .duration(200)
        .style('opacity', 0.88)
        .style('display', '');
      div.html(`<span class="title">${d.data.name}</span><br/><span class="title">${d.data.zh}</span><br/>${d.data.definition}`)
        .style('left', `${d3.event.pageX + 16}px`)
        .style('top', `${d3.event.pageY - 2}px`);
    }

    function hideMask() {
      div.transition()
        .duration(300)
        .style('opacity', 0)
        .style('display', 'none');
    }

    // d3.select('#kgvis').on('click', (e) => {
    //   div.transition()
    //     .duration(500)
    //     .style('opacity', 0)
    //     .style('display', 'none');
    //   mouseOnDiv = false;
    // })

    function bindMouseOver(d) {
      showMask(d);
    }

    function bindMouseOut(d) {
      if (!mouseOnDiv) {
        setTimeout(() => {
          if (!mouseOnDiv) {
            hideMask();
          }
        }, 80);
      }
    }
  };

  render() {
    return (
      <div id={controlDivId} className={styles.vis_container} />
    );
  }

}

export default connect((knowledgeGraph) => (knowledgeGraph))(KnowledgeGraphSearchHelper);
