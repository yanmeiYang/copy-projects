/**
 * Created by ranyanchuan on 2017/10/12.
 */
import React from 'react';
import { connect } from 'dva';
import { RequireRes } from 'hoc';
import { ensure } from 'utils';
import styles from './index.less';

class HeatTable extends React.Component {
  state = {
    iShadow: -1,
    tShadow: '',
  }

  getCrossFieldNode(yNode, xNode) {
    const crossingFields = [];
    yNode.map((yVal) => {
      xNode.map((xVal) => {
        crossingFields.push({ _1: yVal, _2: xVal });
        return true;
      });
      return true;
    });
    return crossingFields;
  }

  getNodeChange = (y, x) => {
    const { crossInfo, crossTree } = this.props;
    return crossInfo.data[(crossTree.xNode.length * y) + x];
  };


  yMouseOver = (num, isHistory) => {
    if (isHistory) {
      this.setState({ iShadow: num, tShadow: 'y' });
    }
  }
  yMouseOut = () => {
    this.setState({ iShadow: -1, tShadow: '' });
  }

  xMouseOut = () => {
    this.setState({ iShadow: -1, tShadow: '' });
  }

  xMouseOver = (num, isHistory) => {
    if (isHistory) {
      this.setState({ iShadow: num, tShadow: 'x' });
    }
  }

  showModel = (type, indexY, indexX, isHistory, event) => {
    if (isHistory) {
      event.stopPropagation();
      const { crossTree } = this.props;
      const { xNode, yNode } = crossTree;
      const xTxt = xNode[indexX];
      const yTxt = yNode[indexY];
      const node = `${yTxt} & ${xTxt}`;
      const crossingFields = this.getCrossFieldNode([yTxt], [xTxt]);
      this.props.getModalContent(type, crossingFields, node);
    }
  }


  leafNodeClick = (type, node, isHistory) => {
    const { crossTree } = this.props;
    const { xNode, yNode } = crossTree;
    if (isHistory) {
      let crossingFields = this.getCrossFieldNode([node], yNode);
      if (type === 'y') { // y轴
        crossingFields = this.getCrossFieldNode(xNode, [node]);
      }
      this.props.getModalContent('history', crossingFields, node);
    }
  }

  render() {
    const { crossInfo, crossTree, isHistory } = this.props;
    const { iShadow, tShadow } = this.state;
    const id = this.props.id || 'heat';
    return (
      <div className={styles.tabHeat}>
        <div className={styles.heatLayout} id={id}>
          <div className={styles.yAxis}>
            { crossTree.yNode.map((item, index) => {
              return (
                <div className={styles.yVal} key={index.toString()}>
                  <span
                    onMouseOut={this.yMouseOut}
                    className={isHistory ? styles.yTiltle : styles.yTiltleDefault}
                    onClick={this.leafNodeClick.bind(this, 'y', item, isHistory)}
                    onMouseOver={this.yMouseOver.bind(this, index, isHistory)}>{item}
                  </span>
                </div>
              );
            })}
          </div>
          <div>
            { crossInfo.data.length > 0 &&
            <div className={styles.heat}>
              { crossTree.yNode.map((yNode, indexY) => {
                return (
                  <div className={styles.heatY}
                       key={indexY.toString()}>
                    { crossTree.xNode.map((xNode, indexX) => {
                      const { cHeat, cAuthor, cPub, authorsCount, pubsCount } = this.getNodeChange(indexY, indexX);
                      return (
                        <div
                          onClick={this.showModel.bind(this, 'history', indexY, indexX, isHistory)}
                          className={isHistory ? (tShadow === 'y' ? (iShadow === indexY ? styles.yShadow : styles.heatX) : (iShadow === indexX ? styles.xShadow : styles.heatX)) : styles.heatXDefault}
                          style={{ backgroundColor: cHeat }}
                          key={indexX.toString()}>
                          <div className={styles.author}
                               style={{ width: cAuthor }} alt="专家"
                               onClick={this.showModel.bind(this, 'author', indexY, indexX, isHistory)}
                          >
                            { authorsCount > 0 &&
                            <span>{authorsCount}</span>
                            }
                          </div>
                          <div className={styles.pub}
                               style={{ width: cPub }} alt="论文"
                               onClick={this.showModel.bind(this, 'pub', indexY, indexX, isHistory)}
                          >
                            { pubsCount > 0 &&
                            <span> {pubsCount}</span>
                            }
                          </div>
                        </div>
                      );
                    })
                    }
                  </div>
                );
              })}
            </div>
            }
            <div className={styles.xAxis}>
              {crossTree.xNode.map((item, index) => {
                return (
                  <div className={styles.titleLayout} key={index.toString()}>
                    <div className={isHistory ? styles.xTitle : styles.xTitleDefault}
                         onMouseOver={this.xMouseOver.bind(this, index, isHistory)}
                         onClick={this.leafNodeClick.bind(this, 'x', item, isHistory)}
                         onMouseOut={this.xMouseOut}>
                      {item.trim().length > 25 ? `${item.trim().slice(0, 25)}...` : item.trim()}
                    </div>
                  </div>
                );
              })}
            </div>
            { this.props.title &&
            <div className={styles.footer}>{this.props.title}</div>
            }
          </div>
        </div>
      </div>);
  }
}
export default connect(({ loading }) => ({ loading }))(HeatTable);

