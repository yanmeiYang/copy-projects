module.exports = [
  { id: 1, icon: 'laptop', name: '首页', router: '/' },
  { id: 2, bpid: 1, name: '学会活动', icon: 'api', router: '/seminar' },
  { id: 21, bpid: 1, name: '活动统计', icon: 'pie-chart', router: '/statistics' },


  { id: 4, bpid: 1, name: '设置', icon: 'camera-o' },
  { id: 41, bpid: 4, mpid: 4, name: '用户设置', icon: 'bar-chart', router: '/admin/users' },
  {
    id: 42, bpid: 4, mpid: 4, name: '用户角色设置', icon: 'bar-chart',
    router: '/admin/system-config/user_roles',
  },
  {
    id: 43, bpid: 4, mpid: 4, name: '活动承办单位', icon: 'api',
    router: '/admin/system-config/activity_organizer_options',
  },
  {
    id: 44, bpid: 4, mpid: 4, name: '活动类型', icon: 'api',
    router: '/admin/system-config/activity_type',
  },
  { id: 48, bpid: 4, mpid: 4, name: '专业委员会', icon: 'api', router: '/technical-committees' },
  { id: 49, bpid: 4, mpid: 4, name: '系统设置', icon: 'bar-chart', router: '/admin/system-config' },

  { id: 6, bpid: 1, name: '专家地图', icon: 'environment', router: '/expert-map' },
  { id: 7, bpid: 1, name: '关系地图', icon: 'environment', router: 'https://cn.aminer.org/ego' },

  // { id: 8, bpid: 1, name: '隐藏功能', icon: 'camera-o' },
  // { id: 88, bpid: 8, mpid: 8, name: 'TEST', icon: 'user', router: '/hidden/testpage' },
  { id: 9, bpid: 1, name: '测试：知识图谱', icon: 'api', router: '/lab/knowledge-graph-widget' },

];
