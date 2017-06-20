module.exports = [
  { id: 1, icon: 'laptop', name: '首页', router: '/' },
  { id: 2, bpid: 1, name: '学会活动', icon: 'api', router: '/seminar' },
  { id: 21, bpid: 1, name: '活动统计', icon: 'pie-chart', router: '/statistics' },

  { id: 3, bpid: 1, name: '专业委员会', icon: 'api', router: '/technical-committees' },

  { id: 4, bpid: 1, name: '设置', icon: 'camera-o' },
  { id: 41, bpid: 4, mpid: 4, name: '用户设置', icon: 'bar-chart', router: '/admin/users' },
  { id: 42, bpid: 4, mpid: 4, name: '系统设置', icon: 'bar-chart', router: '/admin/system-config' },

  { id: 6, bpid: 1, name: '专家地图', icon: 'environment', router: '/expert-map' },

  { id: 8, bpid: 1, name: '隐藏功能', icon: 'camera-o' },
  { id: 88, bpid: 8, mpid: 8, name: 'TEST', icon: 'user', router: '/hidden/testpage' },
  { id: 9, bpid: 1, name: '测试：知识图谱', icon: 'api', router: '/lab/knowledge-graph-widget' },

];
