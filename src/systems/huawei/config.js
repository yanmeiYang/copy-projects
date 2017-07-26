/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { IndexInfoBox } from './components';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'HUAWEI 知识洞察系统',
  SearchPagePrefix: 'uniSearch',
  ShowSideMenu: false,

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: <IndexInfoBox />,

  Header_SubTextLogo: '知识洞察系统',
  Header_LogoStyle: {
    top: '-10px',
    width: '75px',
    backgroundSize: 'auto 75px',
    backgroundPosition: '0px -10px',
  },
  Header_LogoWidth: 194,
  Header_UserPageURL: '',
  Footer_Content: '',

  // Functionality
  Enable_Export: false,

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />ALL</span>,
      nperson: 2871,
    },
    {
      id: '595208bd9ed5dbf9cd563c60.593e4ac29ed5db77fc7be728.593beddb9ed5db23ccac7dbf.593b7c889ed5db23ccac68e6',
      name: 'IEEE Fellow(2013-2016)',
      nperson: 0,
    },
    {
      id: '596c130f9ed5db449d3fbe83',
      name: 'ACM Fellow',
      nperson: 53,
    },
    {
      id: '5923c0829ed5db1600b942db',
      name: '英国皇家科学院－Research Fellows Directory',
      nperson: 976,
    },
    {
      id: '5923bfee9ed5db1600b941f2',
      name: '英国皇家科学院－Fellows Directory',
      nperson: 287,
    },
    {
      id: '55ebd8b945cea17ff0c53d5a',
      name: '中国科学院院士',
      nperson: 287,
    },
    {
      id: '5912aa3a9ed5db655182ffde',
      name: '美国科学院外国专家',
      nperson: 287,
    },
  ],


  // 特殊配置，这里是System的自己的配置


};
