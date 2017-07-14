import { core } from '../router';

const fullRouter = (app) => {
  return [
    core.IndexPage(app, [

      core.ExpertSearch(app),
      core.UniSearch(app),
      core.Experts(app),

      core.ExpertMap(app),
      core.ExpertMapGoogle(app),

      core.Person(app),

      core.Login(app),
      core.Register(app),
      core.User(app),
      core.ForgotPassword(app),
      core.ResetPassword(app),

      core.AdminUsers(app),
      core.AdminSystemConfig(app),
      core.AdminSystemConfigWithCategory(app),

      core.Seminar(app),
      core.SeminarWithId(app),
      core.SeminarMy(app),
      core.SeminarPost(app),
      core.SeminarRating(app),
      core.Statistic(app),

      core.RelationGraphPage(app),
      core.KnowledgeGraph(app),

      core.Default404(app),
    ]),
  ];
};

export default fullRouter;
