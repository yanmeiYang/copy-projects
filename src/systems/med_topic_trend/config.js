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
  HeaderSearch_TextNavi: ['ExpertBase', 'TrendPrediction'],

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

  // Topic Trend
  TopicTrend_HotTopics: [
    { term: 'Mobile Health', term_zh: '移动健康' },
    { term: 'Tumor epidemiology', term_zh: '肿瘤流行病学' },
    { term: 'Synthetic biology technology', term_zh: '合成生物学技术' },
    { term: 'Genome of esophageal cancer', term_zh: '食管癌基因组' },
    { term: 'Environmental health', term_zh: '环境健康' },
    { term: 'Cardiovascular', term_zh: '心血管' },
    { term: 'Targeted poverty alleviation', term_zh: '精准扶贫' },
    { term: 'Healthcare reform', term_zh: '医疗改革' },
    { term: 'Grading diagnosis and treatment', term_zh: '分级诊疗' },
    { term: 'Medical Biotechnology', term_zh: '医药生物技术' },
    { term: 'Diabetes', term_zh: '糖尿病' },
    { term: 'Oncology/tumor/cancer', term_zh: '肿瘤' },
  ],

};
