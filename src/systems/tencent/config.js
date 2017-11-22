/**
 * Created by BoGao on 2017/7/14.
 */
import React from 'react';
import { toIDDotString, TopExpertBase as EB, TopNUniversity2015 } from '../../utils/expert-base';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值。
  PageTitle: '腾讯高校合作',
  SearchPagePrefix: 'uniSearch',

  // google analysis
  googleAnalytics: 'UA-107003102-1',

  EnableLocalLocale: true,
  Layout_HasNavigator: false,

  Header_UserPageURL: '',

  // > Search related
  HeaderSearch_TextNavi: [], // 'ExpertSearch', 'ExpertMap'

  AuthLoginUsingThird: true,
  AuthLoginUsingThirdPage: 'http://ucircle.oa.com/auth/aminer',

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />ALL</span>,
      nperson: 2871,
    },
    {
      id: '595efbda9ed5db252c2b9349',
      name: '腾讯合作者',
      nperson: 0,
      show: roles => roles.indexOf('管理员') >= 0 || roles.indexOf('超级管理员') >= 0,
    },
    /*
    高级专家人才
    美国、中国科学院/工程院院士；
    计算机学科全球Top 20大学Full Prof.；TODO 没分出 Full Prof.
    IEEE Fellow, ACM Fellow，
    TODO 以及H-index>45的专家学者
    */
    {
      id: toIDDotString(
        EB.IEEEFellow, EB.ACMFellow,
        EB.CAS, EB.NAS, EB.CAE, EB.NAE,
        TopNUniversity2015(20),
      ),
      name: '高级专家人才',
      nperson: 0,
    },
    /*
    专家人才
    TODO 活跃在科研一线，最近三年仍然在学术圈活跃（发文章），H-index>35；
    TODO 没分出: 全球Top 50大学的Associate Prof.；
    国内千人/长江学者/杰青
    */
    {
      id: toIDDotString(
        EB.ChangJiangXueZhe, EB.JieQing, EB.QingNianQianRen, EB.YouQing,
        TopNUniversity2015(50),
      ),
      name: '专家人才',
      nperson: 0,
    },
    /*
     青年人才 TODO
     计算机科学领域的博士毕业生，在读博士，博士后
     */

    {
      id: '59bf38e09ed5dbb384f6fa3f',
      name: '犀牛鸟海外专家',
      nperson: 4,
    },
    {
      id: '59bf38ce9ed5dbb384f6fa1e',
      name: '犀牛鸟基金专家',
      nperson: 31,
    },
  ],

  UniSearch_Tabs: ['list', 'map'],

};
