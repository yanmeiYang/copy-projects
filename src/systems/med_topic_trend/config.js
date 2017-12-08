import React from 'react';
import { authenticateExpertBase } from 'hooks';
import defaults from '../utils';

const ExpertBase = '5a24b1389ed5db4a6289ae85';

module.exports = {

  Use_CDN: true,
  EnableLocalLocale: true,
  GLOBAL_ENABLE_FEEDBACK: false,

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'MedTopicTrend',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowRegisteredRole: false,
  Register_AddPrivilegesToExpertBaseIDs: [ExpertBase],
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,
  Header_UserPageURL: '/user-info',
  // Functionality
  Enable_Export: true,
  Enable_Export_EB_IF_EXIST: true,
  Search_EnablePin: false,
  // > Search related
  HeaderSearch_TextNavi: ['ACMFellowExpertBase', 'TrendPrediction'],

  ExpertBases: [
    {
      id: '5a24b1389ed5db4a6289ae85',
      name: '医药卫生领域专家',
      nperson: 1822,
    },
  ],
  ExpertBase,
  // 不显示Filter,sort,header,footer,login
  Search_SortOptions: [],
  Search_DisableFilter: true,
  Layout_ShowHeader: false,
  GLOBAL_ENABLE_HOC: false,

};
