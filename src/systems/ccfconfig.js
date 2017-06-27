/**
 * Created by BoGao on 2017/6/20.
 */
module.exports = {

  DEFAULT_EXPERT_BASE: '5949c2f99ed5dbc2147fd854', // CCF会员
  CCF_expertBases: [
    {
      id: 'aminer',
      name: '全球专家',
      nperson: 2871,
    },
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
  CCF_activityTypes: [
    { name: '专委活动' },
    { name: 'CNCC' },
    { name: 'ADL78' },
    { name: 'CCF@U100(走进高校)' },
    { name: 'YOCSEF' },
    { name: '论坛' },
    { name: '报告会' },
    { name: 'NOI讲座' },
    { name: '分部活动' },
    { name: '精英大会' },
    { name: '女性大会' },
    { name: 'TF' },
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


};
