/**
 *  Created by BoGao on 2017-07-14;
 */
import { registerModel } from '../../utils';

export default {

  Person: app => ({
    path: 'person/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        registerModel(app, require('../../models/seminar'));// 跨命名空间调用有在依赖注册时有先后顺序
        registerModel(app, require('../../models/person'));
        registerModel(app, require('../../models/publications'));
        registerModel(app, require('../../models/vis/vis-research-interest'));
        cb(null, require('./'));
      }, 'person');
    },
  }),

};
