/**
 * Created by ranyanchuan on 2017/10/12.
 */
import React from 'react';
import { connect } from 'dva';
import { loadD3 } from 'utils/requirejs';
import styles from './index.less';

class BarChart extends React.Component {
  componentDidMount() {
    if (this.props.compareVal.title) {
      loadD3((d3) => {
        this.createBar(this.props.compareVal, d3);
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.compareVal !== nextProps.compareVal) {
      loadD3((d3) => {
        this.createBar(nextProps.compareVal, d3);
      });
    }
  }

  createBar = (barInfo, d3) => {
    d3.selectAll(`#${this.props.id}`).selectAll('g').remove();
    const svg = d3.selectAll(`#${this.props.id}`);
    const width = 200;
    const height = 100;
    const titleList = barInfo.title;
    const numList = barInfo.num.map(item => item * 1);

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.3);
    const y = d3.scaleLinear().rangeRound([height, 0]);

    const g = svg.append('g')
      .attr('transform', 'translate(40,20)');
    const barData = titleList.map((item, i) => {
      return { title: item, num: numList[i].toFixed(0) };
    });

    x.domain(barData.map(d => d.title));
    y.domain([0, d3.max(numList)]);

    // 添加x 轴
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // 添加y轴
    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(5));

    // 添加条形图
    g.selectAll('.bar')
      .data(barData)
      .enter().append('rect')
    // .attr('class', styles.bar)
      .attr('fill', d => (d.title === '中国' ? '#4472C4' : (d.title === '美国' ? '#ED7D31' : '#A5A5A5')))
      .attr('x', d => x(d.title))
      .attr('y', d => y(d.num))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.num));
    // 添加文字
    g.selectAll('.bar')
      .data(barData)
      .enter().append('text')
      .attr('x', d => x(d.title) + (x.bandwidth() / 2))
      .attr('y', d => y(d.num) - 5)
      .style('text-anchor', 'middle')
      .text(d => d.num)
      .attr('fill', '#000');
  }

  render() {
    return (
      <div className={styles.barChart}>
        <div id={this.props.tid}>
          <svg id={this.props.id} height="150" width="300" />
          { this.props.title &&
          <div className={styles.footer}>{this.props.title}</div>
          }
        </div>
      </div>);
  }
}
export default connect(({ loading }) => ({ loading }))(BarChart);

