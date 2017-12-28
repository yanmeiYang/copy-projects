import React from 'react';
import { connect } from 'dva';
import { RequireRes } from 'hoc';
import { ensure } from 'utils';
import styles from './index.less';

@RequireRes('d3')
class DisciplineTree extends React.Component {
  componentDidMount() {
    const { id, crossHeat } = this.props;
    const data = crossHeat[id];
    this.createD3(data);
  }

  createD3 = (iData) => {
    ensure('d3', (d3) => {
      const { id } = this.props;
      const height = 500;
      const width = 600;
      // 创建画板
      d3.select(`#${id}`).selectAll('g').remove();
      const svg = d3.select(`#${id}`)
        .append('svg')
        .attr('transform', 'translate(120,0)');

      const treemap = d3.tree().size([height, width]);
      const root = d3.hierarchy(iData, d => d.children);
      root.x0 = height / 2;
      root.y0 = 0;

      // 数据格式化
      const treeData = treemap(root);
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      nodes.forEach(d => d.y = d.depth * 150);
      // 添加线
      svg.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', styles.link)
        .attr('d', d => diagonal(d, d.parent));

      // 创建节点
      const node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', styles.node)
        .attr('transform', d => `translate(${d.y + 5},${d.x})`);

      // 给节点添加圆
      node.append('circle')
        .attr('r', 4.5)
        .style('stroke', 'steelblue');
      // 给节点添加文本
      node.append('text')
        .attr('dx', 8)
        .attr('dy', 3)
        .style('text-anchor', 'start')
        .text(d => d.data.name);
      // 对角线函数
      function diagonal(s, d) {
        const path =
          `M ${s.y} ${s.x}
           C ${(s.y + d.y) / 2} ${s.x},
             ${(s.y + d.y) / 2} ${d.x},
             ${d.y} ${d.x}`;
        return path;
      }
    });
  }

  render() {
    const { id } = this.props;
    return (
      <div className={styles.disciplineTree}>
        <svg id={id} height="500" width="600" />
      </div>);
  }
}
export default connect(({ crossHeat, loading }) => ({ crossHeat, loading }))(DisciplineTree);
