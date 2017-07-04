/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'CCF 专家云智库',

  Language: 'cn', // options [cn|en]
  PreferredLanguage: 'cn', // 默认语言

  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  DEFAULT_EXPERT_BASE: '5949c2f99ed5dbc2147fd854', // CCF会员
  DEFAULT_EXPERT_BASE_NAME: 'CCF会员',

  ExpertBases: [
    {
      id: '5949c2f99ed5dbc2147fd854',
      name: 'CCF会员',
      nperson: 2871,
    },
    {
      id: '592f8af69ed5db8bb68d713b',
      name: '会士(F)',
      nperson: 79,
    },
    {
      id: '58ddbc229ed5db001ceac2a4',
      name: '杰出会员(D)',
      nperson: 182,
    },
    {
      id: '592f6d219ed5dbf59c1b76d4',
      name: '高级会员(S)',
      nperson: 2246,
    },
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    // 数据标注未找到的人的库。
    // {
    //   id: '58e462db9ed5db3b45bad77e',
    //   name: '杰出会员(D)-2',
    //   nperson: 6,
    // },
    // {
    //   id: '593a6dab9ed5db23ccac5689',
    //   name: '高级会员(S)-2',
    //   nperson: 610,
    // },
  ],

  PersonList_PersonLink: personId => `/person/${personId}`,
  PersonList_PersonLink_NewTab: false,

  CCF_activityTypes: [
    { name: '专委活动', dataIndex: 'special-committee' },
    { name: 'CNCC', dataIndex: 'cncc' },
    { name: 'ADL78', dataIndex: 'adl' },
    { name: 'CCF@U100(走进高校)', dataIndex: 'ccf' },
    { name: 'YOCSEF', dataIndex: 'yocsef' },
    { name: '论坛', dataIndex: 'forum' },
    { name: '报告会', dataIndex: 'report-meeting' },
    { name: 'NOI讲座', dataIndex: 'noi' },
    { name: '分部活动', dataIndex: 'division-activity' },
    { name: '精英大会', dataIndex: 'elite-meeting' },
    { name: '女性大会', dataIndex: 'female-meeting' },
    { name: 'TF', dataIndex: 'tf' },
  ],

  CCF_userPosition: [
    { name: '教授', value: '1' },
    { name: '副教授', value: '2' },
    { name: '助理教授', value: '3' },
    { name: '研究院', value: '4' },
    { name: '博士后', value: '5' },
    { name: '博士生', value: '6' },
    { name: '研究生', value: '7' },
    { name: '其他', value: '8' },
  ],

  SysconfigDefaultCategory: 'activity_type',
  SysConfigTabs: [
    {
      category: 'user_roles',
      label: '用户角色列表',
      desc: 'CCF 用户角色列表',
    },
    {
      category: 'activity_organizer_options',
      label: '活动承办单位',
      desc: 'CCF 活动的承办单位，包括专委/分部/项目等。',
    },
    {
      category: 'activity_type',
      label: '活动类型',
      desc: 'CCF 活动的类型。',
    },
  ],


  // 特殊配置，这里是System的自己的配置


};
