/**
 * Created by yutao on 2017/5/22.
 */
const param = (key, type, description) => {
  return { key, type, description };
};

module.exports = {
  // URLs
  basePageURL: 'https://aminer.org',
  baseURL: 'https://api.aminer.org/api',
  nextAPIURL: 'http://localhost:4005/query',
  // nextAPIURL: 'http://e30c17034d854ef4b1dac3d7b5874d3b-cn-beijing.alicloudapi.com/query',

  openPages: ['/login'],

  name: '专家搜索', // TODO Don't use this.
  prefix: 'aminer', // ???
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  // apiPrefix: '/api/',


  // AMiner restful API.
  api: {
    // user system
    currentUser: '/user/me',
    userLogin: '/auth/signin',
    userLogout: '/auth/signout',
    signup: '/auth/signup',
    checkEmail: '/user/check/src/:src/email/:email',
    updateProfile: '/user/:id',
    forgot: '/auth/update/forgot',
    // 重置密码
    retrieve: '/auth/update/token',
    // 给user添加label {uid:'',label:''}
    invoke: '/user/role/invoke',
    // 删除user的label
    revoke: '/user/role/revoke',
    listUsersByRole: '/user/role/list/:role/offset/:offset/size/:size',
    // 创建邮件模板
    emailTemplate: '/user/mail/template/:src/:type',
    getTemplate: '/user/mail/template/:src/:type ',

    // search
    searchPerson: '/search/person', // pin=1 huawei mode.
    searchPersonAgg: '/search/person/agg',
    searchPersonAdvanced: '/search/person/advanced',
    searchPersonAdvancedAgg: '/search/person/advanced/agg',
    searchPersonInBase: '/search/roster/:ebid/experts/advanced',
    searchPersonInBaseAgg: '/search/roster/:ebid/experts/advanced/agg',
    allPersonInBase: '/roster/:ebid/offset/:offset/size/:size',
    allPersonInBaseWithSort: '/roster/:ebid/order-by/:sort/offset/:offset/size/:size',
    allPersonInBaseAgg: '/roster/:ebid/agg?offset=&order=h_index&size=20',
    // TODO agg

    searchMap: '/search/person/geo', // ?query=:search
    searchExpertBaseMap: '/roster/:id/geo/offset/:offset/size/:size',
    searchExpertNetWithDSL: '/search/person/ego',

    searchPubs: '/search/pub', // ?query=xxx&size=20&sort=relevance',

    // search suggest
    searchSuggest: '/search/suggest/gen/:query',

    // misc services
    translateTerm: '/abbreviation/mapping/:term',

    // export roster
    rosterExportSimple: '/roster/:id/export/s/offset/:offset/size/:size/:name',

    // seminar
    getSeminars: '/activity/list/offset/:offset/size/:size', // src aid uid organizer type category stype
    getActivityById: '/activity/:id',
    postActivity: '/activity/post_activity',
    updateActivity: '/activity/update',
    speakerSuggest: '/activity/speaker/suggest',
    uploadActivityPosterImgFile: '/activity/img',
    searchActivity: '/search/activity',
    deleteActivity: '/activity/delete/:id',
    getCommentFromActivity: '/comment/activity/:id/offset/:offset/size/:size',
    addCommentToActivity: '/comment/activity/:id',
    deleteCommentFromActivity: '/comment/activity/cmid/:id',
    // score
    updateOrSaveActivityScore: '/activity/score/me/:src/:actid/:aid/:key/:score/:lvtime',
    // 不知 key, 列出相关的 key 和 scores.
    listActivityScores: '/activity/score-list/:uid/:src/:actid',
    // 已知 key 获取 一个 score
    getActivityScore: '/activity/score/:uid/:src/:actid/:aid/:key',
    getStatsOfCcfActivities: '/activity/admin/stats',
    keywordExtraction: 'http://nlp.newsminer.net/rest/nlp/keywords',
    getTopMentionedTags: '/activity/tags/:src/:num',

    /* person */
    personProfile: '/person/summary/:id',
    personEmailImg: '/person/email/i/',
    personEmailStr: '/person/email/s/:id',
    getEmailCrImage: '/person/email-cr/i/',
    listPersonByIds: '/person/batch-list',
    getActivityAvgScoresByPersonId: '/person/activity/:id/indices',

    // merge
    tryToDoMerge: '/bifrost/person/merge/:mid',

    // interests vis data
    interests: '/person/interests/:id', // 这个是vis图中单独调用的。和人下面的可能不一样.

    /* publications */
    pubList: '/person/pubs/:id/all/year/:offset/:size',
    pubListByCitation: '/person/pubs/:id/all/citation/:offset/:size',
    pubListInfo: '/person/pubs/:id/stats',
    pubListByYear: '/person/pubs/:id/range/year/:year/:offset/:size',
    pubListLimited: '/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size',
    pubById: '/pub/summary/:id',

    // System config
    ucListByCategory: '/2b/config/:source/list?category=:category',
    ucSetByKey: '/2b/config/:source/:category/:key',
    ucDeleteByKey: '/2b/config/:source/:category/:key',
    ucUpdateByKey: '/2b/config/:source/:category/rename/:key/:newKey',
    getCategoriesHint: '/2b/config/:source/category/suggest/:category',
    listConfigsByCategoryList: '/2b/config/:source/by-category',

    // topic
    getTopicByMention: '/topic/summary/m/:mention',

    // Recommendation APIs
    getAllOrgs: '/reviewer/orgs/get/all/:offset/:size',
    // getOrgById: '/reviewer/org/get/:id',

    // cross heat
    getDiscipline: '//cross1.aminer.org/topics?area=:area&k=:k&depth=:depth&context=',
    delDiscipline: '//cross1.aminer.org/feedback?parents=:parents&children=:children&postive=:postive',
    createDiscipline: '//cross2.aminer.org/query',
    getUserQuerys: '//cross2.aminer.org/cross-domain/query/offset/:offset/size/:size',
    getCrossTree: '//cross2.aminer.org/query/:id',
    delUserQuery: '/cross-domain/query/:id',
    getDomainInfo: '//cross2.aminer.org/records/:begin/:end',
    getDomainAllInfo: '//cross2.aminer.org/record/:domain1/:domain2/:begin/:end',
    getExpertByIds: '/person/batch-list',
    getPubById: '/pub/:id',

    // getProjects: API_BASE+"reviewer/projects/get/:offset/:size"
    // addProject: API_BASE+"reviewer/project/add"
    // getProjectById: API_BASE+"reviewer/project/get/:id"

    // getTaskById: API_BASE+"reviewer/task/get/:id"
    // recommend: API_BASE+"reviewer/recommend"
    // addExpertIDtoTask: API_BASE+"reviewer/addExpertIDtoTask"
    // getExpertsOfTask: API_BASE+"reviewer/getExpertsOfTask"
    //
    // listOrgs: API_BASE+"reviewer/orgs/get/:offset/:size"
    // addOrg: API_BASE+"reviewer/org/add"
    // getAllOrgs: API_BASE+"reviewer/orgs/get/all/:offset/:size"
    // removeOrgById: API_BASE+"reviewer/org/remove/:id"
    // addUserToOrg: API_BASE+"reviewer/user/add"npmn
    // SearchUserByEmail:API_BASE+"reviewer/user/get/:email"
    //
    // onlineSearch:API_BASE+"search/person"
    //
    // searchReviewer: "https://api.aminer.org/api/"+"reviewer/search"
    // searchRosterAdvc: API_BASE+"search/roster/:id/experts/advanced"
    //
    // removeTaskById: API_BASE+"reviewer/task/remove/:id"
    // removeProjectById: API_BASE+"reviewer/project/remove/:id"
    //
    // addTaskToProject: API_BASE+"reviewer/task/add/:pid"
    // saveTask: API_BASE+"reviewer/task/save/:tid"
    // # Protected
    // addInstAsProtectedByIid: API_BASE + "aff/person/protected/:iid"


    // Knowledge Graph
    kgFind: {
      api: '/knowledge-graph/:entry',
      param: [ // means param in path.
        param('entry', 'string', 'query that matches name, name_zh, alias, in kgNode.'),
      ],
      query: {
        rich: param('rich', '1 or others', 'Returns simple result, 1 for all doc, others simple.'),
        dp: param('dp', 'int', 'depth of parents'),
        dc: param('dc', 'int', 'depth of children'),
        ns: param('ns', 'int', 'number of sibling'),
        nc: param('nc', 'int', 'number of children'),
      },
    },
    kgGetByIds: {
      api: '/knowledge-graph/:id_chain',
      param: [
        param('id_chain', 'string', 'e.g.: id1.id2.id3'),
      ],
      query: {
        rich: param('rich', '1 or others', 'Returns simple result, 1 for all doc, others simple.'),
        dp: param('dp', 'int', 'depth of parents'),
        dc: param('dc', 'int', 'depth of children'),
        ns: param('ns', 'int', 'number of sibling'),
        nc: param('nc', 'int', 'number of children'),
      },
    },

    // userInfo: '/userInfo',
    // users: '/users',
    // dashboard: '/dashboard',
    // expert info
    getExpertInfo: '/2b/profile/:src/offset/:offset/size/:size',
    deleteItemByKey: '/2b/profile/:src/:id',
    editItemByKey: '/2b/profile/:src/:id',
    addExpertInfoApi: '/2b/profile/:src',
    updateItemById: '/2b/profile/:src/:id',
    searchItemByName: '/2b/profile/:src/offset/:offset/size/:size',
    getToBProfileByAid: '/2b/profile/:src/aid/:id',
    updateToBProfileExtra: '/2b/profile/:src/:id/extra ',

    getExpertBase: '/roster/list/:type/offset/:offset/size/:size',
    addExpertBaseApi: '/roster',
    addExpertToEB: '/roster/:ebid/a',
    deleteExpertBaseApi: '/roster/:rid',
    getExpertDetailList: '/roster/:ebid/order-by/h_index/offset/:offset/size/:size',
    invokeRoster: '/roster/:id/members/u',
    removeExpertsFromEBByPid: '/roster/:rid/d/:pid',
    // getToBProfile: '/api/2b/profile/:src/:id',
    getTrajectoryInfo: '/person/geo/trajectory/:id/year/:lo/:hi',
    getHeatInfo: '/person/geo/trajectory/roster/:rid/year/:lo/:hi/size/:size',
  },
};
