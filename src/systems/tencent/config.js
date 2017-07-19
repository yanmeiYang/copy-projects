/**
 * Created by BoGao on 2017/7/14.
 */
import React from 'react';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值。
  PageTitle: '腾讯人才智库',
  SearchPagePrefix: 'uniSearch',
  ShowSideMenu: false,

  Header_LogoStyle: { top: 2, width: '200px' },
  Header_SubTextLogo: '人才智库',
  Header_SubTextStyle: { paddingLeft: 12 },
  Header_UserPageURL: '',
  Footer_Content: '',

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />ALL</span>,
      nperson: 2871,
    },
    {
      id: '595208bd9ed5dbf9cd563c60.593e4ac29ed5db77fc7be728.593beddb9ed5db23ccac7dbf.593b7c889ed5db23ccac68e6',
      name: 'IEEE Fellow(2013-2016)',
      nperson: 12,
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


  SearchFilterExclude: '',
  UniSearch_Tabs: ['list', 'map'],


  // 特殊配置，这里是System的自己的配置


};