import React from 'react';
import { connect } from 'dva';
import { Icon, message, Input, Modal } from 'antd';
import { RequireRes } from 'hoc';
import { ensure } from 'utils';
// import * as d3 from 'd3';
import { Spinner } from 'components';
import styles from './index.less';

const errorInfo = ['学科树的深度不能超过3层', '学科数量必须在3～20之间，请删减后再添加', '同一学科不能有两个相同的学科'];
@RequireRes('d3')
class DisciplineTree extends React.Component {
  state = {
    showTooltip: false,
    node: null,
    name: '',
  };
  initData = null;
  timeoutId = 0;
  mouseOut = false;
  tooltipLeft = 0;
  tooltipTop = 0;

  componentDidMount() {
    this.getDiscipline();
  }

  componentWillUpdate(nextProps, nextState) {
    const data = nextProps.crossHeat[this.props.id];
    if (data && this.props.crossHeat[this.props.id] !== data) {
      this.initData = this.addId(data);
      this.createD3(this.initData);
    }
  }

  // 获取领域树
  getDiscipline = () => {
    const id = this.props.id;
    const data = this.props.crossHeat[id];
    if (!this.props.isSearch && data) {
      this.initData = this.addId(data);
      this.createD3(this.initData);
    } else {
      const area = this.props.query.replace(/ /g, '_');
      const params = { id, area, k: 4, depth: 2 };
      this.props.dispatch({ type: 'crossHeat/getDiscipline', payload: params });
    }
  }

  addId = (iData) => {
    iData.id = this.guid();
    if (iData.children) {
      iData.children.map(item => this.addId(item));
    }
    return iData;
  }

  // delMoreNode = (data) => {
  //   const ids = [];
  //   const listNode = this.getNode(data, []);
  //   if (listNode.length > maxNodeNum) {
  //     ids.push(listNode.id);
  //   }
  //   if (ids.length > 20) {
  //     ids.slice(20, ids.length).map((item) => {
  //       this.delNodeById(data, item.id);
  //       return true;
  //     });
  //   }
  //   return data;
  // }
  //
  // delNodeById = (dt, id) => {
  //   if (dt.children) {
  //     dt.children.map((item, i) => {
  //       item.id === id ? dt.children.splice(i, 1) : this.delNodeById(item, id);
  //       return true;
  //     });
  //   }
  //   return dt;
  // }


  guid = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + S4());
  }
  createD3 = (iData) => {
    ensure('d3', (d3) => {
      const height = 500;
      const width = this.props.isEdit ? 800 : 600;
      // 创建画板
      d3.select(`#${this.props.id}`).selectAll('svg').remove();
      const svg = d3.select(`#${this.props.id}`).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(120,0)');

      const treemap = d3.tree().size([height, width]);
      const root = d3.hierarchy(iData, d => d.children);
      root.x0 = height / 2;
      root.y0 = 0;

      // 数据格式化
      const treeData = treemap(root);
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1);

      nodes.forEach((d) => {
        d.y = d.depth * 150;
      });
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
        .attr('transform', d => `translate(${d.y},${d.x})`);

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

      // 添加鼠标事件
      svg.selectAll('circle')
        .on('dragover', () => event.preventDefault())
        .on('drop', (node) => {
          event.preventDefault();
          const name = event.dataTransfer.getData('Text');
          this.drop(node, name);
        })
        .on('mouseover', (node) => {
          mouserOver(this, node);
        });

      // 添加鼠标事件
      svg.selectAll('text')
        .on('dragover', () => event.preventDefault())
        .on('drop', (node) => {
          event.preventDefault();
          const name = event.dataTransfer.getData('Text');
          this.drop(node, name);
        })
        .on('mouseover', (node) => {
          mouserOver(this, node);
        });


      function mouserOver(that, node) {
        if (that.props.isEdit) {
          // 圈变成背景色
          svg.selectAll('circle').data(nodes)
            .style('stroke', item => (node.data.id === item.data.id ? '#fff' : 'steelblue'));
          // 字体变成背景色
          svg.selectAll('text').data(nodes)
            .style('fill', item => (node.data.id === item.data.id ? '#fff' : '#000'))
            .attr('opacity', item => (node.data.id === item.data.id ? 0 : 1))
          // 判断是不是说子节点
          // const sWidth = (document.body.offsetWidth - width - 40) / 2;
          that.tooltipTop = node.x + 110;
          that.tooltipLeft = node.y + 120;
          // that.tooltipLeft = event.clientX - 5;
          const name = node.data.name;
          that.setState({ showTooltip: true, node, name });
        }
      }
    });
  }

  drop = (node, name) => {
    const data = this.props.crossHeat[this.props.id];
    if (this.isAllow(node)) {
      event.target.appendChild(document.getElementById(name));
      const aData = this.addData(data, node, name);
      this.createD3(aData);
    }
  }

  // 判断是否让添加
  isAllow = (node) => {
    let isOk = true;
    const data = this.props.crossHeat[this.props.id];
    const level = this.getTreeLevel(data, node, 0, []);
    const noedeNum = this.getNode(data, []).length;
    if (level[0] > 2) { // 树的深度
      message.error(errorInfo[0]);
      isOk = false;
    }
    if (noedeNum > 20) { // 节点树
      message.error(errorInfo[1]);
      isOk = false;
    }
    return isOk;
  }


  getNode = (tree, list) => {
    if (tree && tree.name) {
      list.push({ id: tree.id, name: tree.name });
    }
    if (tree && tree.children && tree.children.length > 0) {
      tree.children.map(item => this.getNode(item, list));
    }
    return list;
  }

  getTreeLevel = (tree, node, num, list) => {
    num += 1;
    const isTrue = ((node.data && tree.id === node.data.id) || tree.id === node.id);
    if (isTrue) {
      list.push(num);
    } else if (tree.children) {
      tree.children.map(item => this.getTreeLevel(item, node, num, list));
    }
    return list;
  }
  // 递归删除 节点
  delData = (dt, node) => {
    if (dt.children) {
      dt.children.map((item, i) => {
        item.id === node.data.id ? dt.children.splice(i, 1) : this.delData(item, node);
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
        that.props.delTreeNode();
        const dData = that.delData(data, that.state.node);
        that.createD3(dData);
      },
      onCancel() {
        that.setState({ showTooltip: false });
      },
    });
  };

  addNode = () => {
    this.setState({ showTooltip: false });
    const data = this.props.crossHeat[this.props.id];
    if (this.isAllow(data)) {
      const aData = this.addData(data, this.state.node, '新节点');
      this.createD3(aData);
    }
  }
  addData = (data, node, name) => {
    const dt = data;
    if (dt.id === node.data.id) {
      dt.children = dt.children || [];
      dt.children.push({ name, id: this.guid(), children: [] });
    } else if (dt.children) {
      dt.children.map(item => this.addData(item, node, name));
    }
    return dt;
  }
  editData = (data, name) => {
    const dt = data;
    if (dt.id === this.state.node.data.id) {
      dt.name = name;
    } else if (dt.children) {
      dt.children.map(item => this.editData(item, name));
    }
    return dt;
  };

  onChangeName = () => {
    const name = this.refs.edit.refs.input.value;
    this.setState({ name });
    this.editData(this.initData, name);
  }

  // 展示可以编辑页面
  onMouseOut = () => {
    this.timeoutId = setTimeout(() => {
      if (!this.mouseOut) {
        this.createD3(this.initData);
        this.setState({ showTooltip: this.mouseOut });
      }
    }, 50);
  }
  onMouseOver = () => {
    this.mouseOut = false;
    clearTimeout(this.timeoutId);
  }

  render() {
    const loadTree = this.props.loading.effects['crossHeat/getDiscipline'];
    const inputVal = this.state.node ? this.state.name : '';
    const addonBefore = (
      <Icon type="close-circle-o"
            onClick={this.delNode}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            className={styles.close} />
    );
    const addonAfter = (
      <Icon type="plus-circle-o"
            onClick={this.addNode}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            className={styles.plus} />
    );
    return (
      <div className={styles.disciplineTree}>
        {this.state.showTooltip &&
        <div className={styles.tooltipDis}
             style={{
               top: this.tooltipTop,
               left: this.tooltipLeft,
             }}>
          <Input
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            autoFocus
            addonBefore={this.state.node.depth > 0 && addonBefore}
            addonAfter={this.state.node.depth < 2 && addonAfter}
            value={inputVal}
            onChange={this.onChangeName}
            ref="edit" />
        </div>
        }
        <Spinner className={styles.heatSpinner} loading={loadTree} size="large" />
        <div id={this.props.id} />
      </div>);
  }
}
export default connect(({ crossHeat, loading }) => ({ crossHeat, loading }))(DisciplineTree);
