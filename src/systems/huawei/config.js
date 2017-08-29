/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { IndexInfoBox, PersonLabel } from './components';
import { toIDDotString, TopExpertBase } from '../../utils/expert-base';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'HUAWEI 知识洞察系统',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowSideMenu: false,
  ShowRegisteredRole: false,

  UserAuthSystem: 'huawei', // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: <IndexInfoBox />,

  Header_SubTextLogo: '知识洞察系统',
  Header_SubTextStyle: { width: 128 },
  Header_LogoStyle: {
    top: '-10px',
    width: '60px',
    height: '36px',
    backgroundSize: 'auto 56px',
    backgroundPosition: '0px -10px',
  },
  Header_LogoWidth: 214,
  Header_UserPageURL: '/user-info',
  // Footer_Content: '',
  ShowHelpDoc: true,

  // Functionality
  Enable_Export: false,
  Search_EnablePin: true,
  // 地图中心点
  CentralPosition: { lat: 37.09024, lng: -95.712891 },
  Person_PersonLabelBlock: person => <PersonLabel person={person} />,

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    {
      id: toIDDotString(TopExpertBase.ACMFellow),
      name: 'ACM Fellow',
      nperson: 53 + 809,
    },
    {
      id: '595208bd9ed5dbf9cd563c60.593e4ac29ed5db77fc7be728.593beddb9ed5db23ccac7dbf.593b7c889ed5db23ccac68e6',
      name: 'IEEE Fellow(2013-2016)',
      nperson: 0,
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
    {
      id: '590fcaa59ed5db67cf85a129',
      name: '美国科学院',
      nperson: 2206,
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
  ],


  // 特殊配置，这里是System的自己的配置


};
