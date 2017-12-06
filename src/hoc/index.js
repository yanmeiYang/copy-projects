import { Auth, RequireLogin, RequireAdmin, RequireGod } from './auth-hoc';
import { RequireRes } from './helper-hoc';
import { Profiling } from './hoc-profiling';

module.exports = {
  Auth, RequireLogin, RequireAdmin, RequireGod,

  RequireRes,

  Profiling,
};
