/**
 * Created by yangyanmei on 17/11/15.
 */

import React from 'react';

export default {

  // 通用配置。所有System的配置文件必须全部包含这部分的值。
  PageTitle: 'YOCSEF 智库管理',
  SearchPagePrefix: 'uniSearch',

  EnableLocalLocale: true,
  Layout_HasNavigator: true,

  Header_UserPageURL: '',

  Search_CheckEB: true, // Check ExpertBase.

  // > Search related
  HeaderSearch_TextNavi: ['ACM_ExpertSearch'], // 'ExpertSearch', 'ExpertMap'
  HeaderSearch_DropDown: true,

  Search_FixedExpertBase: { id: 'aminer', name: '全球专家' },

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />ALL</span>,
      nperson: 2871,
    },
  ],

  UniSearch_Tabs: ['list', 'map'],

  MyExpert_List: [
    { id: '59c870199ed5db7081dffd27', title: 'YOCSEF 荣誉委员' },
    { id: '59c870159ed5db7081dffd26', title: 'YOCSEF 学术委员会' },
    { id: '59c8700e9ed5db7081dffd17', title: 'YOCSEF 总部' },
    { id: '59c8700b9ed5db7081dffd14', title: 'YOCSEF 福州' },
    { id: '59c870069ed5db7081dffd05', title: 'YOCSEF 无锡' },
    { id: '59c870039ed5db7081dffd04', title: 'YOCSEF 长春' },
    { id: '59c86ffe9ed5db7081dffd03', title: 'YOCSEF 桂林' },
    { id: '59c86ffb9ed5db7081dffcfa', title: 'YOCSEF 昆明' },
    { id: '59c86ff79ed5db7081dffcf9', title: 'YOCSEF 厦门' },
    { id: '59c86ff29ed5db7081dffcf5', title: 'YOCSEF 兰州' },
    { id: '59c86fee9ed5db7081dffceb', title: 'YOCSEF 太原' },
    { id: '59c86fea9ed5db7081dffce6', title: 'YOCSEF 合肥' },
    { id: '59c86fe69ed5db7081dffce1', title: 'YOCSEF 南京' },
    { id: '59c86fe39ed5db7081dffcd8', title: 'YOCSEF 天津' },
    { id: '59c86fde9ed5db7081dffcd6', title: 'YOCSEF 深圳' },
    { id: '59c86fda9ed5db7081dffcd1', title: 'YOCSEF 青岛' },
    { id: '59c86fd59ed5db7081dffccc', title: 'YOCSEF 西安' },
    { id: '59c86fd19ed5db7081dffccb', title: 'YOCSEF 大连' },
    { id: '59c86fcc9ed5db7081dffcc2', title: 'YOCSEF 苏州' },
    { id: '59c86fc79ed5db7081dffcbd', title: 'YOCSEF 郑州' },
    { id: '59c86fc29ed5db7081dffcbc', title: 'YOCSEF 成都' },
    { id: '59c86fbd9ed5db7081dffcb7', title: 'YOCSEF 武汉' },
    { id: '59c86fb79ed5db7081dffcb2', title: 'YOCSEF 重庆' },
    { id: '59c86fb39ed5db7081dffca5', title: 'YOCSEF 广州' },
    { id: '59c86fad9ed5db7081dffc9e', title: 'YOCSEF 济南' },
    { id: '59c86f8f9ed5db7081dffc7f', title: 'YOCSEF 哈尔滨' },
    { id: '59c86f7b9ed5db7081dffc61', title: 'YOCSEF 沈阳' },
    { id: '59c86f719ed5db7081dffc4a', title: 'YOCSEF 长沙' },
    { id: '59c86f5b9ed5db7081dffc16', title: 'YOCSEF 上海' },
    { id: '59c86f339ed5db7081dffbd7', title: 'YOCSEF 杭州' },
  ],
};
