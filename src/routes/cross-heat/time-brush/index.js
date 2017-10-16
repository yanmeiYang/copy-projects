/**
 * Created by ranyanchuan on 2017/9/22.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Input, Modal } from 'antd';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import styles from './index.less';

class TimeBrush extends React.Component {

  state = {
    date: [],
  };

  componentDidMount() {
    this.createBrush();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.date !== nextState.date) {
      this.props.getLocalYear(nextState.date);
    }
  }

  createBrush = () => {
    const margin = { top: 10, right: 50, bottom: 214, left: 50 };
    const width = this.props.xWidth;
    const height = 20;
    const svg = d3.selectAll('#brush').append('g')
      .attr('transform', `translate(340,${margin.top})`);
    const localDate = new Date();
    const dateYear = localDate.getFullYear();
    const beginYear = new Date(dateYear - 10, 0, 1);
    const endYear = new Date(dateYear, 0, 1)
    const x = d3.scaleTime().domain([beginYear, endYear]).range([0, width]);
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('start brush', brushmoved)
      .on('end', brushEnd);
    const that = this;

    //刻度轴
    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .attr('fill', '#000')
      .call(d3.axisBottom(x));

    const circle = svg.append('g')
      .attr('class', 'circle');


    const gBrush = svg.append('g')
      .attr('class', 'brush')
      .call(brush);


    const handle = gBrush.selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter().append('path')
      .attr('class', 'handle--custom')
      .attr('class', styles.handleCircle)
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius((height - 2) / 2)
        .startAngle(0)
        .endAngle((d, i) => {
          return i ? Math.PI : -Math.PI;
        }));

    // 初始化默认区间
    gBrush.call(brush.move, [new Date(2013, 0, 1), new Date(2016, 0, 1)].map(x));

    // 横条背景色
    d3.selectAll('.overlay').attr('fill', '#ccc');
    d3.selectAll('.selection').attr('fill', '#00FF23');


    function brushEnd() {
      const s = d3.event.selection;
      const sx = s.map(x.invert);
      const sYear = sx[0].getFullYear();
      let eYear = sx[1].getFullYear();
      // 对开始年和结束年相等进行处理
      if (sYear === eYear) {
        eYear += 1;
      }
      const yDate = [sYear, eYear];
      that.setState({ date: yDate });
      const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('start brush', brushmoved);
      gBrush.call(brush.move, [new Date(yDate[0], 0, 1), new Date(yDate[1], 0, 1)].map(x));
    }

    function brushmoved() {
      const s = d3.event.selection;
      if (s == null) {
        handle.attr('display', 'none');
        circle.classed('active', false);
      } else {
        handle.attr('display', null).attr('transform', (d, i) => {
          return `translate(${s[i]},${height / 2})`;
        });
      }
    }
  };

  render() {
    const width = this.props.xWidth + 360;
    return (
      <div className={styles.brushTime}>
        <svg id="brush" width={width} height="50" />
      </div>);
  }
}
export default connect(({ crossHeat, loading }) => ({ crossHeat, loading }))(TimeBrush);

