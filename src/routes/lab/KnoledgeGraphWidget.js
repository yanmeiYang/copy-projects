import React from 'react';
import { connect } from 'dva';
import styles from './KnoledgeGraphWidget.less';
import * as d3 from '../../../public/d3/d3.min';
import * as kgService from '../../services/knoledge-graph-service';

// TODO destory this page.
// Main content has moved to knowledge-graph/KnowledgeGraphSearchHelper Component.

class KnoledgeGraphWidget extends React.Component {

  state = {
    // treeData: {
    //   name: '信息系统',
    //   children: [
    //     {
    //       name: '万维网',
    //       children: [
    //         { name: 'Web Search and Application', level: 3 },
    //         { name: 'Web Search and Application', level: 3 },
    //         { name: 'Web Search and Application', level: 3 },
    //         { name: 'Web Search and Application', level: 3 },
    //         { name: '在线广告', level: 3 },
    //         { name: '在线广告', level: 3 },
    //         { name: '在线广告', level: 3 },
    //         { name: '在线广告', level: 3 },
    //         { name: '在线广告', level: 3 },
    //       ],
    //     },
    //     {
    //       name: '信息系统应用',
    //       children: [
    //         { name: '在线广告', level: 3 },
    //       ],
    //     }, {
    //       name: '信息系统应用',
    //       children: [],
    //     }, {
    //       name: '信息系统应用',
    //       children: [
    //         { name: '在线广告', level: 3 },
    //       ],
    //     },
    //   ],
    // },
  };


  componentDidMount() {
    // this.createD3();
    kgService.getKGSuggest('data mining', (result) => {
      this.createD3(result);
      return console.log('this is call back', result);
    });
  };


  createD3 = (data) => {
    // Set the dimensions and margins of the diagram
    const margin = { top: 28, right: 20, bottom: 30, left: 20 };
    const width = 452 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select('#kgvis').append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    let i = 0;
    const duration = 400;

    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([width, height]);


    // Assigns parent, children, height, depth
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
          return d._children ? 'lightsteelblue' : '#fff';
        });

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('y', (d) => {
          return d.children || d._children ? -18 : 18;
        })
        .attr('text-anchor', (d) => {
          return d.data.level != 3 ? 'middle' : '';
        })
        .text((d) => {
          return d.data.name;
        })
        .attr('writing-mode', (d) => {
          return d.data.level === 3 ? 'tb' : '';
        });

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
  };

  render() {
    return (
      <div className={styles.container}>
        <div id="kgvis" className={styles.vis_container} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(KnoledgeGraphWidget);
