/**
 * Created by ranyanchuan on 2017/11/9.
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table } from 'antd';
import { Auth } from 'hoc';
import { Layout } from 'components/layout';
import { applyTheme } from 'themes';
import { PersonList } from 'components/person';
import { PublicationList } from 'components/publication/index';
import { Spinner } from 'components';
import { loadHtml2canvas, loadJquery, loadSaveAs } from 'utils/requirejs';
import bridge from 'utils/next-bridge';

import BarChart from '../components/bar-chart/index';
import HeatTable from '../components/heat-table/index';
import History from '../components/line-chart/index';
import styles from './index.less';

const tc = applyTheme(styles);
const objTxt = {
  copyright1: 'AMiner咨询产品版权为AMiner团队独家所有，拥有唯一著作权。AMiner咨询产品是AMiner团队的研究与统计成果，其性质是供客户内部参考的商业资料。',
  copyright2: 'AMiner咨询产品为有偿提供给购买该产品的客户使用，并仅限于该客户内部使用。未获得AMiner团队' +
  '书面授权，任何人不得以任何方式在任何媒体上(包括互联网)公开发布、复制，且不得以任何方式将本产' +
  '品的内容提供给其他单位或个人使用。如引用、刊发，需注明出处为“AMiner.org”，且不得对本报告进行' +
  '有悖原意的删节与修改。否则引起的一切法律后果由该客户自行承担，同时AMiner团队亦认为其行为侵犯了' +
  'AMiner团队著作权，AMiner团队有权依法追究其法律责任',
  copyright3: 'AMiner咨询产品是基于AMiner团队及其研究员认为可信的公开资料，但AMiner团队及其研究员均不保证' +
  '所使用的公开资料的准确性和完整性，也不承担任何投资者因使用本产品与服务而产生的任何责任。',
  copyright4: '行业研究报告是AMiner团队智能服务体系的重要组成部分。如对有关信息或问题有深入需求的客户，欢迎使用AMiner团队专项研究智能服务。',
  linkman: '垂询及订阅请联系：',
  team: 'AMiner团队： Ingrid@tsinghua.edu.cn',
  cross1: '通过对两个领域的知识图谱的计算，再对两领域的细分子领域进行笛卡尔乘积热点挖掘，本研究报告挖掘了历史数据分析和未来' +
  '趋势预测两部分。其中但本报告主要探讨2007年至今的研究状况；趋势预测仅以未来3年为周期来探讨。',
  cross2: '领域交叉热力值由交叉研究的论文的citation等数据加权计算得出，热力值越高，表明这个两个交叉子领域交叉研究的越深入和广泛。',
  cross3: '每个交叉热点中的研究学者，发表论文，中外学者和论文对比等数据均可以获得。用作展示时，研究学者和论文分别按照交叉领域研究影响度和论文相关度作为默认排序。',
  cross4: '学者研究影响度由交叉领域内论文量，h-index等计算得出；论文相关度由交叉领域内论文的关联程度和引用数量等计算得出。',
  cross5: '对比分析中“中外研究人员对比”和“中外研究论文对比”是专家数量和论文数量的直接对比；而“中外论文影响对比”是论文citation值的对比。',
};

@connect(({ app, loading, crossHeat }) => ({ app, loading, crossHeat }))
@Auth
export default class ReportDemo extends React.Component {
  state = {
    loadWord: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({ type: 'crossHeat/getCrossFieldById', payload: { id } });
  }

  componentWillUpdate(nextProps, nextState) {
    const { crossTree, crossInfo } = this.props.crossHeat;
    const nCrossTree = nextProps.crossHeat.crossTree;
    if (nCrossTree !== crossTree) { // 树
      const { crossList } = nCrossTree;
      this.getDomainInfo([2007, 2017], crossList);
      this.getPredict([2018, 2021], crossList);
    }
    const nCrossInfo = nextProps.crossHeat.crossInfo;
    if (nCrossInfo !== crossInfo) {
      this.getTopInfo([2007, 2017], nCrossInfo.top.slice(0, 5));
    }
  }

  // 获取 DomainInfo
  getDomainInfo = (yearData, crossingFields) => { // 获取 DomainInfo
    const yearList = this.getYearList(yearData[0], yearData[1]);
    const dt = { years: yearList, crossingFields, withCache: false, op: 'meta' };
    this.getAggregate('overview', dt);
  };
  getYearList = (sY, eY) => { // 获取日期数组
    const yearList = [];
    for (let item = sY; item < eY; item++) {
      yearList.push(item);
    }
    return yearList;
  }

  getPredict = (yearData, crossingFields) => { // 获取预测数据
    const yearList = this.getYearList(yearData[0], yearData[1]);
    const dt = { years: yearList, crossingFields, withCache: true, op: 'meta' };
    this.getAggregate('predict', dt);
  };
  getTopInfo = (yearData, crossingFieldsList) => {
    const yearList = this.getYearList(yearData[0], yearData[1]);
    const topDetailList = [];
    const topHistoryList = [];
    for (const item of crossingFieldsList) {
      const temp = item.split('&');
      const crossingFields = [{ _1: temp[0].trim(), _2: temp[1].trim() }];
      const dt = { years: yearList, crossingFields, withCache: true };
      topDetailList.push({ method: 'detail', dt });
      topHistoryList.push({ method: 'meta', dt });
    }
    this.props.dispatch({
      type: 'crossHeat/getTopInfo', payload: { topDetailList, topHistoryList },
    });
  }
  // 执行 getAggregate 方法
  getAggregate = (method, dt) => {
    this.props.dispatch({ type: 'crossHeat/getAggregate', payload: { method, dt } });
  };
  // todo 优化
  exportWord = () => {
    this.setState({ loadWord: true });
    const that = this;
    loadJquery((jQuery) => {
        const $ = jQuery;
        loadHtml2canvas((html2canvas) => {
          loadSaveAs((saveAs) => {
            const imgIds = ['heat', 'publine0', 'expertline0', 'pub0', 'expert0', 'citation0', 'publine1', 'expertline1', 'pub1', 'expert1', 'citation1', 'publine2', 'expertline2', 'pub2', 'expert2', 'citation2', 'publine3', 'expertline3', 'pub3', 'expert3', 'citation3', 'publine4', 'expertline4', 'pub4', 'expert4', 'citation4', 'predict'];

            getCanvasNew(imgIds, this.props.crossHeat);
            // getCan(imgIds, 0, [], [], this.props.crossHeat);

            function getCanvasNew(ids, crossHeat) {
              const idObj = {};
              let count = 0;
              ids.map((item) => {
                html2canvas(document.getElementById(item)).then((canvas) => {
                  const h = document.getElementById(item).offsetHeight; //高度
                  const w = document.getElementById(item).offsetWidth; //宽度
                  idObj[item] = { id: item, h, w, canvas: canvas.toDataURL() };
                  count += 1;
                  if (ids.length === count) {
                    changeCanvas(ids, idObj, crossHeat);
                  }
                });
                return true;
              });
            }

            function changeCanvas(idList, canvasList, crossHeat) {
              const { crossTree, crossInfo, topInfo } = crossHeat;
              const imgs = [];
              const imgHW = [];
              for (const item of idList) {
                const { h, w, canvas } = canvasList[item];
                imgHW.push({ h, w });
                imgs.push(canvas);
              }
              saveWord(imgs, imgHW, crossTree, crossInfo, topInfo);
            }


            function getTable(thData, tdData, title) { //获取table
              const $div = $('<div style="width: 1000px;"></div>');
              const $table = $('<table style="border-collapse: collapse;width: 1000px;"></table>');
              const $trTh = $('<tr></tr>');
              for (let a = 0; a < thData.length; a++) {
                $trTh.append($(`<td style="border: 1px solid black;background-color: #ccc;text-align: center">${thData[a]} </td>`));
              }
              $table.append($trTh);
              for (let b = 0; b < tdData.length; b++) {
                const $trTd = $('<tr></tr>');
                for (let c = 0; c < tdData[b].length; c++) {
                  $trTd.append($(`<td style="border: 1px solid black;text-align: center">${tdData[b][c]} </td>`));
                }
                $table.append($trTd);
              }
              const $p = $(`<div style="width: 1000px;text-align: center">${title}</div>`);
              return $div.append($table, $p);
            }

            function getImg(imgUrl) {
              return $(`<img src="${imgUrl}"/>`);
            }

            function getDiv() {
              return $('<div></div>');
            }

            function getH2(title) {
              return $(`<h2>${title}</h2>`);
            }

            function getH3(title) {
              return $(`<h3>${title}</h3>`);
            }

            function getAuthorTab(topInfo, title) {
              const authorTh = ['姓名', 'H-index', '学术活跃度', '引用数', '论文数', '职称', '单位', '研究兴趣'];
              const authorTd = [];
              for (const item of bridge.toNextPersons(topInfo.author)) {
                const { name, indices, profile, tags } = item;
                const { hindex, gindex, citations, pubs } = indices;
                const { position, affiliation } = profile;
                const interList = tags ? tags.slice(0, 3).toString() : '';
                authorTd.push([name, hindex, gindex, citations, pubs, position, affiliation, interList]);
              }
              return getTable(authorTh, authorTd, title);
            }

            function getPubTab(topInfo, title) {
              const pubTh = ['标题', '年份', 'Cited by', '作者', 'Venue'];
              const pubTd = [];
              for (const item of topInfo.pub) {
                const author = item.authors.map(it => it.name);
                pubTd.push([item.title, item.year, item.num_citation, author.toString(), item.venue.name]);
              }
              return getTable(pubTh, pubTd, title);
            }

            function getAnaTab(crossTree, crossInfo) {
              const $div = getDiv();
              const { result } = crossInfo;
              const tabIFoot = `表1 2007年至今 ${crossTree.yNode[0]}领域与${crossTree.xNode[0]}领域交叉研究学者H-index分布`;
              const tabCFoot = `表2 2007年至今 ${crossTree.yNode[0]}领域与${crossTree.xNode[0]}领域交叉研究论文Citation分布`;
              const authorTh = ['H-index', '专家人数', '分布占比'];
              const authorTd = [];
              const { autDis0, autDis0Pro, autDis1, autDis1Pro, autDis2, autDis2Pro, autDis3, autDis3Pro } = result;
              const { pubDis0, pubDis0Pro, pubDis1, pubDis1Pro, pubDis2, pubDis2Pro, pubDis3, pubDis3Pro, pubDis4, pubDis4Pro } = result;
              authorTd.push(
                ['小于10', autDis0, `${autDis0Pro}%`], ['10~20', autDis1, `${autDis1Pro}%`],
                ['20~40', autDis2, `${autDis2Pro}%`], ['大于40', autDis3, `${autDis3Pro}%`],
                ['总计', result.authors, '100%'],
              );
              const pubTh = ['Citation', '专家人数', '分布占比'];
              const pubTd = [];
              pubTd.push(
                ['小于10', pubDis0, `${pubDis0Pro}%`], ['1~10', pubDis1, `${pubDis1Pro}%`],
                ['10~100', pubDis2, `${pubDis2Pro}%`], ['100~200', pubDis3, `${pubDis3Pro}%`],
                ['大于200', pubDis4, `${pubDis4Pro}%`], ['总计', result.pubs, '100%'],
              );
              const $tableAuthor = getTable(authorTh, authorTd, tabIFoot);
              const $tablePub = getTable(pubTh, pubTd, tabCFoot);
              return $div.append($tableAuthor, $tablePub);
            }

            function getDoaminInfo(topInfo, imgs, num) {
              const title = getH2(topInfo.key);
              const $div = getDiv();
              const aTabTitle = getH3(`${topInfo.key}相关性最高的5位作者为：`);
              const author = getAuthorTab(topInfo, `表${num}-1${topInfo.key}相关性最高的5位作者`);
              const pTabTitle = getH3(`${topInfo.key}相关性最高的5篇论文为：`);
              const pub = getPubTab(topInfo, `表${num}-2${topInfo.key}相关性最高的5篇论文`);
              const hTitle = getH3(`${topInfo.key}历史对比`);
              const pubLine0 = getImg(imgs[0]);
              const expertLine0 = getImg(imgs[0]);
              const conTitle = getH3(`${topInfo.key}中美对比`);
              const pub0 = getImg(imgs[0]);
              const expert0 = getImg(imgs[0]);
              const citation0 = getImg(imgs[0]);
              const top = $('#top0').html();
              return $div.append(title, aTabTitle, author, pTabTitle, pub, hTitle, pubLine0, expertLine0, pub0, conTitle, expert0, expert0, citation0, top);
            }

            function saveWord(imgs, imgHW, crossTree, crossInfo, topInfo) {
              //虚拟创建各种需要的DOM内容，不加入文档流，但使用, style需要在节点中添加
              const $div = getDiv();
              const cHeat = getImg(imgs[0]);
              const pHeat = getImg(imgs[0]);
              const ana = getAnaTab(crossTree, crossInfo);
              const dInfo0 = getDoaminInfo(topInfo[0], imgs, 2);
              const dInfo1 = getDoaminInfo(topInfo[1], imgs, 3);
              const dInfo2 = getDoaminInfo(topInfo[2], imgs, 4);
              const dInfo3 = getDoaminInfo(topInfo[3], imgs, 5);
              const dInfo4 = getDoaminInfo(topInfo[4], imgs, 6);
              // 构造表格，structure table ,这里的data.length 需改为项目的表格内容，如requestData.ProblemList.length
              const firstTxt = $('#firstTxt').html().replace(/<p>/g, '<p style="text-indent: 30px;">');
              const alaysic = $('#static').html().replace(/<p>/g, '<p style="text-indent: 30px;">');
              const topDomain = $('#topDomain').html().replace(/<p>/g, '<p style="text-indent: 30px;">');
              const preTitle = $('#predictTitle').html().replace(/<p>/g, '<p style="text-indent: 30px;">');
              const preTop = $('#predictTop').html().replace(/<p>/g, '<p style="text-indent: 30px;">');
              $div.append(firstTxt, cHeat, alaysic, ana, topDomain, dInfo0, dInfo1, dInfo2, dInfo3, dInfo4, preTitle, pHeat, preTop);
              $.fn.wordExport = function () { //主体函数，即将内容加入到word中
                const fileName = 'report';
                const static1 = {
                  mhtml: {
                    top: 'Mime-Version: 1.0\nContent-Base:\nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset="utf-8"\nContent-Location:\n\n<!DOCTYPE html>\n<html>\n_html_</html>',
                    head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n+ '_styles_' + \n</style>\n</head>\n",
                    body: '<body>_body_</body>',
                  },
                };
                const markup = $(this).clone();
                markup.each(function () {
                  const self = $(this);
                  if (self.is(':hidden')) {
                    self.remove();
                  }
                });
                const images = [];
                const img = markup.find('img');
                for (let i = 0; i < imgs.length; i++) {
                  const uri = imgs[i];
                  $(img[i]).attr('src', imgs[i]);
                  img[i].width = imgHW[i].w;
                  img[i].height = imgHW[i].h;
                  images[i] = {
                    type: uri.substring(uri.indexOf(':') + 1, uri.indexOf(';')),
                    encoding: uri.substring(uri.indexOf(';') + 1, uri.indexOf(',')),
                    location: $(img[i]).attr('src'),
                    data: uri.substring(uri.indexOf(',') + 1),
                  };
                }
                let mhtmlBottom = '\n';
                for (let i = 0; i < images.length; i++) {
                  mhtmlBottom += '--NEXT.ITEM-BOUNDARY\n';
                  mhtmlBottom += `Content-Location: ${images[i].location}\n`;
                  mhtmlBottom += `Content-Type: ${images[i].type}\n`;
                  mhtmlBottom += `Content-Transfer-Encoding: ${images[i].encoding}\n\n`;
                  mhtmlBottom += `${images[i].data}\n\n`;
                }
                mhtmlBottom += '--NEXT.ITEM-BOUNDARY--';
                const fileContent = static1.mhtml.top.replace('_html_', static1.mhtml.head.replace('_styles_', styles) + static1.mhtml.body.replace('_body_', markup.html())) + mhtmlBottom;
                const blob = new Blob([fileContent], { type: 'application/msword;charset=utf-8' });
                saveAs(blob, `${fileName}.doc`);
              };
              $div.wordExport('docName');
              that.setState({ loadWord: false });
            }
          });
        });
      });
}

  render() {
    const { loadWord } = this.state;
    const { crossTree, crossInfo, predict, topInfo } = this.props.crossHeat;
    const authorCol = [{ title: ' H-index', width: 160, dataIndex: 'h_index' },
      { title: '专家人数', dataIndex: 'author' }, { title: '分布占比', dataIndex: 'pro' }];
    const pubCol = [{ title: 'Citation', width: 160, dataIndex: 'citation' },
      { title: '专家人数', dataIndex: 'author' }, { title: '分布占比', dataIndex: 'pro' }];
    const authorTable = [];
    const pubTable = [];
    if (crossInfo) {
      const { result } = crossInfo;
      authorTable.push(
        { key: '1', h_index: '小于10', author: result.autDis0, pro: `${result.autDis0Pro}%` },
        { key: '2', h_index: '10~20', author: result.autDis1, pro: `${result.autDis1Pro}%` },
        { key: '3', h_index: '20~40', author: result.autDis2, pro: `${result.autDis2Pro}%` },
        { key: '4', h_index: '大于40', author: result.autDis3, pro: `${result.autDis3Pro}%` },
        { key: '5', h_index: '总计', author: result.authors, pro: '100%' },
      );
      pubTable.push(
        { key: '1', citation: '小于10', author: result.pubDis0, pro: `${result.pubDis0Pro}%` },
        { key: '2', citation: '1~10', author: result.pubDis1, pro: `${result.pubDis1Pro}%` },
        { key: '3', citation: '10~100', author: result.pubDis2, pro: `${result.pubDis2Pro}%` },
        { key: '4', citation: '100~200', author: result.pubDis3, pro: `${result.pubDis3Pro}%` },
        { key: '5', citation: '大于200', author: result.pubDis4, pro: `${result.pubDis4Pro}%` },
        { key: '6', citation: '总计', author: result.pubs, pro: '100%' },
      );
    }
    const fObj = {};
    if (crossTree) {
      fObj.heatFoot = `图1-1 2007年至今 ${crossTree.yNode[0]}领域与${crossTree.xNode[0]}领域交叉分析`;
      fObj.preFoot = `图7-1 ${crossTree.yNode[0]}领域与${crossTree.xNode[0]}领域未来3年趋势`;
      fObj.tabIFoot = `表1-1 2007年至今 ${crossTree.yNode[0]}领域与${crossTree.xNode[0]}领域交叉研究学者H-index分布`;
      fObj.tabCFoot = `表1-2 2007年至今 ${crossTree.yNode[0]}领域与${crossTree.xNode[0]}领域交叉研究论文Citation分布`;
    }
    const isTrue = !(topInfo.length > 0);
    return (
      <Layout searchZone={[]} contentClass={tc(['export'])} showNavigator={false}>
        <Spinner loading={isTrue} size="large" />
        { crossTree && crossInfo && predict &&
        <div>
          <div className={styles.tabBtn}>
            <Button type="default" onClick={this.exportWord}>导出Word</Button>
          </div>
          { loadWord &&
          <div className={styles.empty}>正在下载WORD文件...</div>
          }
          <div className={styles.exportReport}>
            <div id="firstTxt">
              <h1>版权声明</h1>
              <p >{objTxt.copyright1}</p>
              <p >{objTxt.copyright2}</p>
              <p >{objTxt.copyright3}</p>
              <p >{objTxt.copyright4}</p>
              <p >{objTxt.linkman}</p>
              <div style={{ textIndent: 30 }}>{objTxt.team}</div>
              <h1>{crossTree.yNode[0]}</h1>
              <p>我们选取{crossTree.yNode[0]}域近期热度，全局热度最高，相关性最强的{crossTree.yNode.length}个相关领域作为研究对象，具体包括：</p>
              { crossTree.yNode.length > 0 &&
              crossTree.yNode.map((item, index) => {
                return (<p key={index.toString()}>{index + 1}. {item}</p>);
              })
              }
              <h1>{crossTree.xNode[0]}</h1>
              <p>我们选取{crossTree.xNode[0]}域近期热度，全局热度最高，相关性最强的{ crossTree.xNode.length}个相关领域作为研究对象，具体包括：</p>
              { crossTree.xNode.length > 0 &&
              crossTree.xNode.map((item, index) => {
                return (<p key={index.toString()}>{index + 1}. {item}</p>);
              })
              }
              <h1>{crossTree.yNode[0]}+{crossTree.xNode[0]}</h1>
              <h2>交叉创新笛卡尔智能分析</h2>
              <p>{objTxt.cross1}</p>
              <p>{objTxt.cross2}</p>
              <p>{objTxt.cross3}</p>
              <div className={styles.paddingLeft30}>{objTxt.cross4}</div>
              <p>{objTxt.cross5}</p>
              <h2>历史热点图</h2>
            </div>
            <HeatTable isHistory={false} crossInfo={crossInfo} id="heat" title={fObj.heatFoot}
                       crossTree={crossTree} />
            <div id="static">
              <h2>历史数据统计</h2>
              <p>2007年至今，全球共有{crossInfo.result.authors}位专家投入了
                {crossTree.yNode[0]}和{crossTree.xNode[0]}领域的交叉研究中，
                其中华人专家{crossInfo.result.ChinaAuthors}人，约占{crossInfo.result.ChinaPro}%,
                共产生交叉研究论{crossInfo.result.pubs}篇。学者H-index分布和Citation分布如下：
              </p>
            </div>
            <div className={styles.staTab}>
              <Table columns={authorCol} dataSource={authorTable} pagination={false} bordered />
              <div className={styles.tableFooter}>{fObj.tabIFoot}</div>
            </div>
            <div className={styles.staTab}>
              <Table columns={pubCol} dataSource={pubTable} pagination={false} bordered />
              <div className={styles.tableFooter}>{fObj.tabCFoot}</div>
            </div>
            <div id="topDomain">
              <h2>历史交叉领域TOP5</h2>
              { crossInfo &&
              crossInfo.top.slice(0, 5).map((item, index) => (
                <p key={index.toString()}>{index + 1}. {item} </p>))
              }
            </div>
            { topInfo &&
            topInfo.map((item, index) => {
              const rYear = this.getYearList(2007, 2017);
              const dataPub = [];
              const dataExpert = [];
              for (const it of item.history) {
                dataExpert.push(it.authorsCount);
                dataPub.push(it.pubsCount);
              }
              const pid = `pub${index.toString()}`;
              const aid = `expert${index.toString()}`;
              const cid = `citation${index.toString()}`;
              const pidLine = `publine${index.toString()}`;
              const aidline = `expertline${index.toString()}`;
              const topId = `top${index.toString()}`;
              const hPub = `图${index + 2}-1 ${item.key}历史论文数据`;
              const hAuthor = `图${index + 2}-2 ${item.key}历史专家数据`;
              const fAuthorCNUSA = `图${index + 2}-3 ${item.key}中美研究人员对比`;
              const fPubCNUSA = `图${index + 2}-4 ${item.key}中美论文对比`;
              const fCitCNUSA = `图${index + 2}-5 ${item.key}中美论文影响对比`;
              const { comPer, comPub, comCit } = item.contrast;
              return (
                <div key={index.toString()}>
                  <h2>{item.key}</h2>
                  <h3>{item.key}相关性最高的5位作者为：</h3>
                  <PersonList persons={bridge.toNextPersons(item.author)}
                              rightZoneFuncs={[]} PersonList_PersonLink_NewTab />
                  <h3>{item.key}相关性最高的5篇论文为：</h3>
                  <PublicationList pubs={item.pub} pubLinkTargle showLabels={false} />
                  <h3>{item.key}历史对比</h3>
                  <History id={pidLine} xAxis={rYear} data={dataPub} title={hPub} />
                  <History id={aidline} xAxis={rYear} data={dataExpert} title={hAuthor} />
                  <h3>{item.key}中美研究对比</h3>
                  <BarChart tid={aid} id={`${aid}t`} compareVal={comPer} title={fAuthorCNUSA} />
                  <BarChart tid={pid} id={`${pid}t`} compareVal={comPub} title={fPubCNUSA} />
                  <BarChart tid={cid} id={`${cid}t`} compareVal={comCit} title={fCitCNUSA} />
                  <div id={topId}>
                    <h3>{item.key}研究中，领先的国家分别是：</h3>
                    { crossInfo &&
                    item.detail.nations.slice(0, 10).map((nation, nIndex) => (
                      <p key={nIndex.toString()} style={{ textIndent: 30 }}
                         className={styles.ellipsis}>{nIndex + 1}. {`${nation._1}`}
                      </p>))}
                    <h3>{item.key}研究中，全球主要研究机构是：</h3>
                    { crossInfo &&
                    item.detail.orgs.slice(0, 10).map((org, oIndex) => (
                      <p key={oIndex.toString()} className={styles.ellipsis}
                         style={{ textIndent: 30 }}>{oIndex + 1}. {`${org._1}`}
                      </p>))
                    }
                  </div>
                </div>
              );
            })
            }
            <div id="predictTitle">
              <h2>趋势预测</h2>
              <h3>未来三年趋势预测图</h3>
            </div>
            <HeatTable isHistory={false} crossInfo={predict} id="predict" title={fObj.preFoot}
                       crossTree={crossTree} />
            <div id="predictTop">
              <h3>预测未来三年内运用交叉较高领域</h3>
              { predict &&
              predict.top.slice(0, 5).map((item, index) => (
                <p key={index.toString()}>{index + 1}. {item} </p>))
              }
            </div>
          </div>
        </div>
        }
      </Layout>
    );
  }
}
