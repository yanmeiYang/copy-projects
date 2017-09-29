/**
 * Created by ranyanchuan on 2017/9/22.
 */
import React from 'react';
import { connect } from 'dva';
import * as d3 from 'd3';
class GroupedBar extends React.Component {

  componentDidMount() {
    this.createBar(this.props.compareVal);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.compareVal[0].one !== this.props.compareVal[0].one) {
      this.createBar(nextProps.compareVal);
      return true;
    }
    return false;
  }

  createBar = (compareVal) => {
    d3.selectAll('#' + this.props.id).selectAll("g").remove();
    const svg = d3.selectAll('#' + this.props.id);
    const margin = { top: 20, right: 40, bottom: 30, left: 160 };
    const width = svg.attr('width') - margin.left - margin.right;
    const height = svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.4);

    const x1 = d3.scaleBand()
      .padding(1.5);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    const z = d3.scaleOrdinal() // bar 对应的颜色
      .range(['#98abc5', '#ff8c00']);

    // x轴坐标值
    // x0.domain(['USA',''CHI]);
    const keys = ['one', 'two'];
    x0.domain([]);
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);

    // y最大值
    const one = compareVal[0].one;
    const two = compareVal[0].two;
    const max = one > two ? one : two;
    y.domain([0, max]).nice();

    g.append('g')
      .selectAll('g')
      .data(compareVal)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return 'translate(0, 0)';
      })
      .selectAll('rect')
      .data((d) => {
        return keys.map((key) => {
          return { key, value: d[key] };
        });
      })
      .enter()
      .append('rect')
      .attr('x', (d) => {
        return x1(d.key);
      })
      .attr('y', (d) => {
        return y(d.value);
      })
      // .attr('width', x1.bandwidth()) // 自动宽
      .attr('width', 20)
      .attr('height', (d) => {
        return height - y(d.value);
      })
      .attr('fill', (d) => {
        return z(d.key);
      })


    g.append('g')
      .selectAll('g')
      .data(compareVal)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return 'translate(0, 0)';
      })
      .selectAll('text')
      .data((d) => {
        return keys.map((key) => {
          return { key, value: d[key] };
        });
      })
      .enter()
      .append('text')
      .attr('x', (d) => {
        return x1(d.key) + 10;
      })
      .attr('y', (d) => {
        return y(d.value);
      })
      .style('text-anchor', 'middle')
      .text((d) => {
        return d.value;
      })
      .attr('fill', 'none')
      .attr('stroke', '#ff1591')

    // x 轴
    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0));
    // y 轴
    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(2, 's'))
      .append('text')
      .attr('x', 2)
      .attr('y', y(y.ticks().pop()) + 0.5)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')


    // 图例
    const legend = g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(['USA-IN', 'CHN-IN'])
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        return 'translate(' + (60 * i) + ',-20)';
      });

    legend.append('rect')
      .attr('x', (width / 2) - 40)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', z);

    legend.append('text')
      .attr('x', (width / 2) - 20)
      .attr('y', 6.5)
      .attr('dy', '0.32em')
      .text((d) => {
        return d;
      });
  }

  render() {
    return (
      <div>
        <svg id={this.props.id} height="150" width="300" />
      </div>);
  }
}
export default connect(({ loading }) => ({ loading }))(GroupedBar);

