/**
 *  Created by BoGao on 2017-06-12;
 */
import React from 'react';
import { connect } from 'dva';
import styles from './KnowledgeGraphAll.less';
import * as d3 from '../../../public/d3/d3.min';
import * as kgService from '../../services/knoledge-graph-service';

const controlDivId = 'kgvis';


/*
 * @params: lang: [en|cn]
 */
class KnowledgeGraphSearchHelper extends React.Component {

  componentDidMount() {
    this.updateD3(this.props.query);
  }

  componentDidUpdate(prevProps, prevState) {
    this.emptyD3();
    if (prevProps.query === this.props.query) {
      return false;
    }
    this.updateD3(this.props.query);
  }

  updateD3(query) {
    kgService.getKGSuggest(query, (result) => {
      if (!result) {
        this.emptyD3();
        this.closeZone();
        return;
      }
      this.createD3(result);
    });
  }

  // If no suggestion, hide the whole div.
  showZone = () => {
    d3.select(`#${controlDivId}`)
      .style('width', 'calc(100vw - 220px)')
      .style('height', '80vh');
    // .style('width', '700px')
    // .style('height', '600px');
  };

  emptyD3 = () => {
    const a = document.getElementById(controlDivId);
    if (a) {
      a.innerHTML = '';
    }
  }

  closeZone = () => {
    d3.select(`#${controlDivId}`)
      .style('width', '0px')
      .style('height', '0px');
  };

  getDimension = () => {
    // const box = document.getElementById(`${controlDivId}`);
    // if (box) {
    //   return { width: box.offsetWidth, height: box.offsetHeight };
    // }
    return { width: 4000, height: 800 };
  };

  // Create D3 Object.
  createD3 = (data) => {
    // Set the dimensions and margins of the diagram
    const margin = { top: 28, right: 20, bottom: 30, left: 20 };
    let { width, height } = this.getDimension();
    console.log(width, height);
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;
    const lang = this.props.lang === 'cn' ? 'cn' : 'en';

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
    if (root.children) {
      root.children.forEach((d) => {
        if (d.children && d.children.length > 0) {
            d.children.forEach(collapse);
          // d.children.forEach((d) => {
          // });
        }
      });
    }

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
        if (d.data.level === 1) {
          d.y = d.depth * 60;
        } else if (d.data.level < 3) {
          d.y = d.depth * 60;
        } else {
          d.y = d.depth * 130;
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
          if (d.data.level < 3) {
            return d.children || d._children ? -18 : 18;
          } else {
            return d.children || d._children ? 8 : 8;
          }
        })
        .attr('text-anchor', (d) => {
          return d.data.level < 3 ? 'middle' : '';
        })
        .html((d) => {
          const name = lang === 'cn' ? d.data.zh : d.data.name;
          return `<a class="nodeLink" href="/search/${name}/0/30">${name}</a>`;
        })
        .attr('writing-mode', (d) => {
          return d.data.level >= 3 ? 'tb' : '';
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
        .style('left', `${d3.event.pageX + 2}px`)
        .style('top', `${d3.event.pageY - 28}px`);
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

export default connect()(KnowledgeGraphSearchHelper);
