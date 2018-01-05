/* eslint-disable no-restricted-globals*/

/**
 * Created by ranyanchuan on 2017/12/11.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, Button, message, Input, Modal } from 'antd';
import { RequireRes } from 'hoc';
import { ensure } from 'utils';
import { Spinner } from 'components';
import styles from './index.less';

const ButtonGroup = Button.Group;
const errorInfo = ['学科树的深度不能超过2层', '学科数量必须在3～20之间，请删减后再添加', '同一学科不能有两个相同的学科'];
@RequireRes('d3')
class EditDomain extends React.Component {
  state = {
    showTooltip: false,
    node: null,
    candidate: [],
    name: '',
  };
  timeoutId = 0;
  mouseOut = false;

  componentDidMount() {
    const { isSearch, source } = this.props;
    this.getDiscipline(isSearch, source);
  }

  componentWillUpdate(nextProps) {
    const { id, crossHeat } = this.props;
    const query = crossHeat[id];
    const nextQuery = nextProps.crossHeat[id];
    if (query !== nextQuery) {
      const can = id === 'queryOne' ? 'candidateOne' : 'candidateTwo';
      this.updateBasicData(nextQuery, nextProps.crossHeat[can]);
    }
  }

  updateBasicData = (query, candidate) => {
    const { id } = this.props;
    this.createEidtTree(id, this.addId(query));
    this.setState({ candidate: this.changeCadidate(candidate, query) });
  }

  // getNde
  getNodeName = (tree, temp) => {
    if (tree && tree.name) {
      temp.push(tree.name);
    }
    if (tree && tree.children && tree.children.length > 1) {
      tree.children.map((item) => {
        this.getNodeName(item, temp);
        return true;
      });
    }
    return temp;
  }

  changeCadidate = (candidate, queryData) => {
    const key = this.getNodeName(candidate, []);
    const tree = this.getNodeName(queryData, []);
    const differenceABSet = key.filter(x => ![...tree].find(n => n === x));
    return differenceABSet.slice(0, 40);
  }

  // 获取领域树
  getDiscipline = (isSearch, source) => {
    const { query, id, crossHeat } = this.props;
    if (isSearch) {
      if (source === 'wiki') {
        const area = query.replace(/ /g, '_');
        const wiki = [{ area, k: 4, depth: 2 }, { area, k: 5, depth: 4 }];
        const param = { source, id, wiki, query };
        this.props.dispatch({ type: 'crossHeat/getDiscipline', payload: param });
      }
      if (source === 'acm') {
        const acm = [
          { entry: query, rich: 1, dp: 1, dc: 2, ns: 4, nc: 4 },
          { entry: query, rich: 1, dp: 1, dc: 3, ns: 5, nc: 5 }];
        const param = { source, id, query, acm };
        this.props.dispatch({ type: 'crossHeat/getACMDiscipline', payload: param });
      }
    } else {
      const can = id === 'queryOne' ? 'candidateOne' : 'candidateTwo';
      this.updateBasicData(crossHeat[id], crossHeat[can]);
    }
  }
  addId = (iData) => {
    iData.id = this.guid();
    if (iData.children) {
      iData.children.map(item => this.addId(item));
    }
    return iData;
  }

  guid = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + S4());
  }

  createEidtTree = (id, iData) => {
    ensure('d3', (d3) => {
      const height = 500;
      const width = 600;
      d3.select(`#${id}`).selectAll('g').remove();
      const svg = d3.select(`#${id}`)
        .append('g')
        .attr('transform', 'translate(120,0)');
      const treemap = d3.tree().size([height, width]);
      const root = d3.hierarchy(iData, d => d.children);
      root.x0 = 20;
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
        .on('drop', (nd) => {
          event.preventDefault();
          const name = event.dataTransfer.getData('Text');
          this.drop(nd, name);
        })
        .on('mouseover', nd => mouserOver(this, nd));
      // 添加鼠标事件
      svg.selectAll('text')
        .on('dragover', () => event.preventDefault())
        .on('drop', (nd) => {
          event.preventDefault();
          const name = event.dataTransfer.getData('Text');
          this.drop(nd, name);
        })
        .on('mouseover', nd => mouserOver(this, nd));
      function mouserOver(that, nd) {
        // 圈变成背景色
        svg.selectAll('circle').data(nodes)
          .style('stroke', item => (nd.data.id === item.data.id ? '#fff' : 'steelblue'));
        // 字体变成背景色
        svg.selectAll('text').data(nodes)
          .style('fill', item => (nd.data.id === item.data.id ? '#fff' : '#000'))
          .attr('opacity', item => (nd.data.id === item.data.id ? 0 : 1));
        const { x, y, data } = nd;
        that.tooltipTop = x + 140;
        that.tooltipLeft = y + 120;
        that.setState({ showTooltip: true, node: nd, name: data.name });
      }
    });
  }

  drop = (node, name) => {
    const { id, crossHeat } = this.props;
    if (this.isAllow(node)) {
      event.target.appendChild(document.getElementById(name));
      const aData = this.addData(crossHeat[id], node, name);
      this.createEidtTree(id, aData);
    }
  }
  changeSource = (value) => {
    this.getDiscipline(true, value);
  }
  onMouseOver = () => {
    this.mouseOut = false;
    clearTimeout(this.timeoutId);
  }
  // 展示可以编辑页面
  onMouseOut = () => {
    const { id, crossHeat } = this.props;
    this.timeoutId = setTimeout(() => {
      if (!this.mouseOut) {
        this.createEidtTree(id, crossHeat[id]);
        this.setState({ showTooltip: this.mouseOut });
      }
    }, 50);
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
    const { id, crossHeat } = this.props;
    const name = this.refs.edit.refs.input.value;
    this.setState({ name });
    const data = this.editData(crossHeat[id], name);
    this.createEidtTree(id, data);
  }

  addNode = () => {
    const { id, crossHeat } = this.props;
    const { node } = this.state;
    this.setState({ showTooltip: false });
    if (this.isAllow(node)) {
      const aData = this.addData(crossHeat[id], node, '新节点');
      this.createEidtTree(id, aData);
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
        const { crossHeat, id } = that.props;
        const dData = that.delData(crossHeat[id], that.state.node);
        that.createEidtTree(id, dData);
      },
      onCancel() {
        that.setState({ showTooltip: false });
      },
    });
  };

  dragCanStart = (event) => {
    event.dataTransfer.setData('Text', event.target.id);
  }

  dropCan = (event) => {
    event.preventDefault();
  }

  // 判断是否让添加
  isAllow = (node) => {
    const { crossHeat, id } = this.props;
    let isOk = true;
    const data = crossHeat[id];
    const level = this.getTreeLevel(data, node, 0, []);
    const noedeNum = this.getNode(data, []).length;
    if (level[0] > 1) { // 树的深度
      message.error(errorInfo[0]);
      isOk = false;
    }
    if (noedeNum > 20) { // 节点树
      message.error(errorInfo[1]);
      isOk = false;
    }
    return isOk;
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

  getNode = (tree, list) => {
    if (tree && tree.name) {
      list.push({ id: tree.id, name: tree.name });
    }
    if (tree && tree.children && tree.children.length > 0) {
      tree.children.map(item => this.getNode(item, list));
    }
    return list;
  }

  render() {
    const { node, candidate, showTooltip } = this.state;
    const { id, source, loading } = this.props;
    const inputVal = this.state.node ? this.state.name : '';
    const loadWiki = loading.effects['crossHeat/getDiscipline'];
    const loadAcm = loading.effects['crossHeat/getACMDiscipline'];
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
      <div className={styles.editDomain}>
        <Spinner loading={loadWiki || loadAcm} size="large" />
        <div className={styles.disciplineTree}>
          {showTooltip &&
          <div className={styles.tooltipDis}
               style={{
                 top: this.tooltipTop,
                 left: this.tooltipLeft,
               }}>
            <Input
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              autoFocus
              addonBefore={node.depth > 0 && addonBefore}
              addonAfter={node.depth < 1 && addonAfter}
              value={inputVal}
              onChange={this.onChangeName}
              ref="edit" />
          </div>
          }
        </div>
        <div>
          <ButtonGroup>
            <Button type={source === 'wiki' ? 'primary' : 'default'}
                    onClick={this.changeSource.bind(this, 'wiki')}>WIKI 知识图谱
            </Button>
            <Button type={source === 'acm' ? 'primary' : 'default'}
                    onClick={this.changeSource.bind(this, 'acm')}>ACM 知识图谱
            </Button>
          </ButtonGroup>
        </div>
        <div className={styles.edit}>
          <div>
            <svg id={id} height="500" width="600" />
          </div>
          <div className={styles.candidate}>
            <div draggable className={styles.drag}>
              {candidate.length > 0 && candidate.map((item, index) => {
                return (
                  <div draggable key={index.toString()} className={styles.drapItem}>
                    <span
                      draggable
                      onDrop={this.dropCan}
                      onDragStart={this.dragCanStart}
                      id={item}>{item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ loading, crossHeat }) => ({ loading, crossHeat }))(EditDomain);

