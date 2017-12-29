/**
 * Created by ranyanchuan on 2017/11/9.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Steps } from 'antd';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import { PersonList } from 'components/person';
import { PublicationList } from '../../components/publication/index';
import bridge from 'utils/next-bridge';
import CrossContrast from './contrast/index';
import styles from './reportExport.less';

const tc = applyTheme(styles);
const domain = ['Artificial Intelligence', 'Health Care'];
const dateData = [2007, 2017];

@connect(({ app, loading, crossHeat }) => ({ app, loading, crossHeat }))
@Auth

export default class ReportDemo extends React.Component {
  state = {};

  nodeData = [];

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'crossHeat/getCrossFieldById',
      payload: { id },
    });
  }

  componentWillUpdate(nextProps, nextState,) {
    const { crossTree, exportList, experts, pubs } = this.props.crossHeat;
    const nCrossTree = nextProps.crossHeat.crossTree;
    if (nCrossTree !== crossTree) { // 树
      this.nodeData = this.getXY(nCrossTree).nodeData;
      this.getExportInfo(this.nodeData);
    }
    if (exportList.length !== nextProps.crossHeat.exportList.length) {
      const { expertsId, pubsId } = this.getIds(nextProps.crossHeat.exportList);
      this.getPubPerson(expertsId, pubsId);
    }
  }

  getIds = (exportList) => {
    const expertsId = [];
    const pubsId = [];
    exportList.map((item) => {
      expertsId.push(...item.authors.top10);
      pubsId.push(...item.pubs.top10);
      return true;
    })
    return { expertsId, pubsId };
  }

  getExportInfo = (nodeData) => {
    const years = [2010];
    const op = 'meta';
    const method = 'detail';
    const withCache = true;
    const exportList = [];
    nodeData.slice(0, 2).map((item) => {
      const param = { method, dt: { years, crossingFields: [item], withCache, op } };
      exportList.push(param);
      return true;
    });
    this.props.dispatch({
      type: 'crossHeat/getExportInfo',
      payload: { exportList },
    });
  }

  getPubPerson = (authorsIds, pubsIds) => {
    this.props.dispatch({
      type: 'crossHeat/getAuthorListInfo',
      payload: { idInfo: [{ ids: authorsIds }] },
    });
    this.props.dispatch({
      type: 'crossHeat/getPubListInfo',
      payload: { idInfo: [{ ids: pubsIds }] },
    });
  };

  changeKeyword = (num, expertList) => {
    expertList.map((item) => {
      item.tags = item.tags.slice(0, num);
      return true;
    })
    return expertList;
  }

  // 获取所有节点 扁平化
  getNodeChildren = (tree, children) => {
    if (tree.children && tree.children.length > 0) {
      tree.children.map((item) => {
        this.getNodeChildren(item, children);
        return true;
      });
    } else {
      children.push(tree.name);
    }
    return children;
  };
  getCrossFieldNode = (xNode, yNode) => {
    const crossList = [];
    xNode.map((xVal) => {
      yNode.map((yVal) => {
        crossList.push({ _1: yVal, _2: xVal, });
        return true;
      });
      return true;
    });
    return crossList;
  };

  getXY = (crossTree) => {
    const yNode = this.getNodeChildren(crossTree.queryTree1, []);
    const xNode = this.getNodeChildren(crossTree.queryTree2, []);
    const nodeData = this.getCrossFieldNode(xNode, yNode);
    return { nodeData };
  };

  render() {
    const { exportList, exportPubsList, exportAuthorsList } = this.props.crossHeat;
    const pubKey = Object.keys(exportPubsList);
    const authorKey = Object.keys(exportAuthorsList);
    return (
      <Layout searchZone={[]} contentClass={tc(['export'])} showNavigator={false}>
        <div>
          {exportList.length > 0 && pubKey.length > 0 && authorKey.length > 0 &&
          <div>
            <div className={styles.printTab}><Button type="primary" size="large">导出</Button></div>
            <div style={{ color: 'rgb(68,114,196)', fontSize: 27 }}>5. 交叉研究热点详细信息</div>
            {
              exportList.map((item, index) => {
                const pubs = item && item.pubs.top10.map(pid => exportPubsList[pid + '']);
                const authors = item && item.authors.top10.map(pid => exportAuthorsList[pid + '']);
                const keyString = "No." + (index + 1) + " " + this.nodeData[index]._1 + " & " + this.nodeData[index]._2;
                return (
                  <div key={index}>
                    <div style={{ fontSize: 15 }}>{keyString}</div>
                    <div style={{ fontSize: 15, marginBottom: 5 }}>研究学者TOP5：</div>
                    <PersonList rightZoneFuncs={[]}
                                persons={bridge.toNextPersons(authors)} />
                    {/*<div style={{ fontSize: 15, marginBottom: 5 }}>研究论文TOP5：</div>*/}
                    <PublicationList pubs={pubs} />
                    <CrossContrast compareData={item} />
                  </div>
                )
              })
            }
          </div>
          }
        </div>
      </Layout>
    )
  }

}
