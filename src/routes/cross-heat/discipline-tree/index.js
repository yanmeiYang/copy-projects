import React from 'react';
import { connect } from 'dva';
import { Icon, Input, Modal } from 'antd';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import styles from './index.less';

class DisciplineTree extends React.Component {
  state = {
    left: 0,
    top: 0,
    node: null,
    showTooltip: false,
  };

  componentWillMount() {
    const query = this.props.query;
    const params = {
      id: this.props.id,
      area: query.replace(/ /g, '_'),
      k: 4,
      depth: 2,
    };
    this.props.dispatch({ type: 'crossHeat/getDiscipline', payload: params });
  }

  componentWillReceiveProps() {
    const data = this.props.crossHeat[this.props.id];
    if (data) {
      this.createD3(data, false);
    }
  }

  createD3 = (iData, editContent) => {
    const height = 500;
    let width = 600;
    if (this.props.isEdit) {
      width = 800;
    }

    // 创建画板
    d3.select(`#${this.props.id}`).selectAll('svg').remove();
    const svg = d3.select(`#${this.props.id}`).append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(120,0)');

    const treemap = d3.tree().size([height, width]);

    const root = d3.hierarchy(iData, (d) => {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    // 数据格式化
    const treeData = treemap(root);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    nodes.forEach((d) => {
      d.y = d.depth * 120;
    });
    // 添加线
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', styles.link)
      .attr('d', (d) => {
        return diagonal(d, d.parent);
      });

    // 创建节点
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', styles.node)
      .attr('transform', (d) => {
        return `translate(${d.y},${d.x})`;
      });

    // 给节点添加圆
    node.append('circle')
      .attr('r', 4.5)
      .style('stroke', (d) => {
        let stroke = 'steelblue';
        if (editContent) {
          if (d.data.name === this.state.node.data.name) {
            stroke = '#fff';
          }
        }
        return stroke;
      });
    // 给节点添加文本
    node.append('text')
      .attr('dx', (d) => {
        return d.children ? -8 : 8;
      })
      .attr('dy', 3)
      .style('text-anchor', (d) => {
        return d.children ? 'end' : 'start';
      })
      .text((d) => {
        // 去掉 text
        let txt = d.data.name;
        if (editContent) {
          if (d.data.name === this.state.node.data.name) {
            txt = '';
          }
        }
        return txt;
      });
    // 添加鼠标事件
    svg.selectAll('circle')
      .on('mouseover', (d) => {
        if (this.props.isEdit) {
          this.setState({ name: d.data.name });
          svg.selectAll('circle').data(nodes)
            .style('stroke', (item) => {
              let fill = 'steelblue';
              if (item.x === d.x && item.y === d.y) {
                fill = '#fff';
              }
              return fill;
            });
          svg.selectAll('text').data(nodes)
            .text((item) => {
              let txt = item.data.name;
              if (item.x === d.x && item.y === d.y) {
                txt = '';
              }
              return txt;
            });
          const top = d.x + 60;
          const left = event.pageX - 5;
          this.setState({
            showTooltip: true,
            top,
            left,
            node: d,
          });
          ReactDOM.findDOMNode(this.refs.edit).value = d.data.name;
        }
      });
    // 对角线函数
    function diagonal(s, d) {
      const path =
        `M ${s.y} ${s.x}
           C ${(s.y + d.y) / 2} ${s.x},
             ${(s.y + d.y) / 2} ${d.x},
             ${d.y} ${d.x}`;
      return path;
    }
  }

  // 递归删除 节点
  delData = (dt, node) => {
    // todo 节点不唯一
    if (dt.children) {
      dt.children.map((item, i) => {
        if (item.name === node.data.name) {
          dt.children.splice(i, 1);
        } else {
          this.delData(item, node);
        }
        return true;
      });
    }
    return dt;
  }

  // 删除节点
  delNode = () => {
    const that = this;
    Modal.confirm({
      title: this.state.node.name,
      content: '您确定删除吗？',
      onOk() {
        const data = that.props.crossHeat[that.props.id];
        const dData = that.delData(data, that.state.node);
        that.createD3(dData, false);
        that.setState({ showTooltip: false });
        const params = {
          parents: that.state.node.parent.data.name,
          children: that.state.node.data.name,
          postive: 1,
        }
        that.props.dispatch({ type: 'crossHeat/delDiscipline', payload: params });
      },
      onCancel() {
      },
    });
  }

  addNode = () => {
    this.setState({ showTooltip: false });
    const data = this.props.crossHeat[this.props.id];
    const aData = this.addData(data, this.state.node);
    this.createD3(aData, false);
  }
  addData = (dt, node) => {
    // todo 节点不唯一
    if (dt.name === node.data.name) {
      if (dt.children === undefined) {
        dt.children = [];
      }
      dt.children.push({ name: '新节点' });
    } else if (dt.children) {
      dt.children.map((item) => {
        this.addData(item, node);
        return true;
      });
    }
    return dt;
  }


  // 编辑节点
  editNode = () => {
    const name = ReactDOM.findDOMNode(this.refs.edit).value;
    const data = this.props.crossHeat[this.props.id];
    const eData = this.editData(data, name);
    this.createD3(eData, true);
  };
  editData = (dt, name) => {
    if (dt.name === this.state.node.data.name) {
      dt.name = name;
    } else if (dt.children) {
      dt.children.map((item) => {
        this.editData(item, name);
        return true;
      });
    }
    return dt;
  }

  render() {
    return (
      <div>
        {this.state.showTooltip &&
        <div className={styles.tooltipDis}
             style={{ top: this.state.top, left: this.state.left }}>
          {this.state.node.depth > 0 &&
          <Icon type="close-circle-o" onClick={this.delNode}
                className={styles.close} />
          }
          <Input size="small" placeholder=""
                 onChange={this.editNode}
                 className={styles.input} ref="edit" />
          <Icon type="plus-circle-o" onClick={this.addNode}
                className={styles.plus} />
        </div>
        }
        <div id={this.props.id} />
      </div>);
  }
}
export default connect(({ crossHeat, loading }) => ({ crossHeat, loading }))(DisciplineTree);
