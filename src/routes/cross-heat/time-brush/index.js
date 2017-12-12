/**
 * Created by ranyanchuan on 2017/9/22.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Input, Modal } from 'antd';
import ReactDOM from 'react-dom';
import { loadD3 } from "utils";
import styles from './index.less';

let d3;

class TimeBrush extends React.Component {
  state = {
    date: [],
  };

  componentDidMount() {
    loadD3((ret) => {
      d3 = ret;
      const { xWidth, yearBuring, isAuto } = this.props;
      this.createBrush(xWidth, yearBuring, isAuto);
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const { yearBuring, isAuto, xWidth } = this.props;
    const { date } = this.state;
    if (date !== nextState.date) {
      this.props.getLocalYear(nextState.date);
    }
    if (xWidth !== nextProps.xWidth) {
      loadD3((ret) => {
        d3 = ret;
        this.createBrush(nextProps.xWidth, date, isAuto);
      });
    }
    if (yearBuring[1] !== nextProps.yearBuring[1]) {
      loadD3((ret) => {
        d3 = ret;
        this.createBrush(nextProps.xWidth, nextProps.yearBuring, isAuto);
        console.log(yearBuring);
      });
    }
  }


  createBrush = (xWidth, yearBuring, isAuto) => {
    const localDate = new Date();
    const dateYear = localDate.getFullYear();
    let timeAxis = [0, 0];
    const margin = { top: 9, right: 50, bottom: 214, left: 50 };
    const width = xWidth > 806 ? xWidth : 806;
    const height = 20;
    d3.select('#brush').selectAll('g').remove();
    const svg = d3.selectAll('#brush').append('g')
      .attr('transform', `translate(340,${margin.top})`);
    const beginYear = new Date(dateYear - 10, 0, 1);
    const endYear = new Date(dateYear, 0, 1);
    const x = d3.scaleTime().domain([beginYear, endYear]).range([0, width]);
    const brush = d3.brushX()
      .extent([[0, 0], [width, height + 1]])
      .on('start brush', brushmoved)
      .on('end', brushEnd);
    const that = this;

    const x3 = d3.scaleLinear().domain([0, 10]).range([0, width]);
    const tmp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rangeList = tmp.map(item => x3(item));
    const domainList = tmp.map(item => (dateYear + item - 10));
    const x2 = d3.scaleOrdinal().range(rangeList);
    const xScale2 = x2.domain(domainList);

    //刻度轴
    svg.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0,${height})`)
      .attr('fill', '#000')
      .call(d3.axisBottom(xScale2));

    svg.append('g')
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
    gBrush.call(brush.move, [new Date(yearBuring[0], 0, 1), new Date(yearBuring[1], 0, 1)].map(x));

    function brushEnd() {
      const s = timeAxis;
      let sYear = dateYear - 10;
      let eYear = dateYear;
      if (s) {
        const sx = s.map(x.invert);
        sYear = sx[0].getFullYear();
        eYear = sx[1].getFullYear();
        // 对开始年和结束年相等进行处理
        if (sYear === eYear) {
          eYear += 1;
        }
      }
      d3.selectAll('.overlay').attr('fill', '#ccc').attr('cursor', 'pointer');
      d3.selectAll('.selection').attr('fill', '#00FF23');
      let yDate = [sYear, eYear];
      if (!isAuto) {
        yDate = yearBuring;
      }
      that.setState({ date: yDate });
      const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('start brush', brushmoved);
      gBrush.call(brush.move, [new Date(yDate[0], 0, 1), new Date(yDate[1], 0, 1)].map(x));
    }

    function brushmoved() {
      timeAxis = d3.event.selection;
      if (timeAxis) {
        handle.attr('display', null).attr('transform', (d, i) => {
          return `translate(${timeAxis[i]},${height / 2})`;
        });
      }
    }
  };

  render() {
    const width = this.props.xWidth > 806 ? this.props.xWidth : 806;
    return (
      <div className={styles.brushTime}>
        <svg id="brush" width={width + 365} height="50" />
      </div>);
  }
}

export default connect(({ crossHeat, loading }) => ({ crossHeat, loading }))(TimeBrush);

