const baseURL = 'https://api.aminer.org/api';
const apiDomain = 'https://api.aminer.org';
const nextAPIURL = 'http://localhost:4005/query';
// const nextAPIURL = 'http://e30c17034d854ef4b1dac3d7b5874d3b-cn-beijing.alicloudapi.com/query';

const param = (key, type, description) => {
  return { key, type, description };
};

module.exports = {
  // URLs
  basePageURL: 'https://aminer.org',
  baseURL,
  nextAPIURL,
  apiDomain,
  strict: false, // 如果是strict模式，所有向下兼容的东西都会报错。

  openPages: ['/login'],
  CORS: [
    'https://dc_api.aminer.org', 'http://localhost:4005',
    'https://cross1.aminer.org',
    'http://e30c17034d854ef4b1dac3d7b5874d3b-cn-beijing.alicloudapi.com/',
  ],
  YQL: [],

  name: '专家搜索', // TODO Don't use this.
  prefix: 'aminer', // ???
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  // apiPrefix: '/api/',


  // AMiner restful API.
  api: {
    // user system
    currentUser: `${baseURL}/user/me`,
    userLogin: `${baseURL}/auth/signin`,
    userLogout: `${baseURL}/auth/signout`,
    signup: `${baseURL}/auth/signup`,
    checkEmail: `${baseURL}/user/check/src/:src/email/:email`,
    updateProfile: `${baseURL}/user/:id`,
    forgot: `${baseURL}/auth/update/forgot`,
    // 重置密码
    retrieve: `${baseURL}/auth/update/token`,
    // 给user添加label {uid:'`,label:''}
    invoke: `${baseURL}/user/role/invoke`,
    // 删除user的label
    revoke: `${baseURL}/user/role/revoke`,
    listUsersByRole: `${baseURL}/user/role/list/:role/offset/:offset/size/:size`,
    // 创建邮件模板
    emailTemplate: `${baseURL}/user/mail/template/:src/:type`,
    getTemplate: `${baseURL}/user/mail/template/:src/:type`,

    // search
    searchPerson: `${baseURL}/search/person`, // pin=1 huawei mode.
    searchPersonAgg: `${baseURL}/search/person/agg`,
    searchPersonAdvanced: `${baseURL}/search/person/advanced`,
    searchPersonAdvancedAgg: `${baseURL}/search/person/advanced/agg`,
    searchPersonInBase: `${baseURL}/search/roster/:ebid/experts/advanced`,
    searchPersonInBaseAgg: `${baseURL}/search/roster/:ebid/experts/advanced/agg`,
    allPersonInBase: `${baseURL}/roster/:ebid/offset/:offset/size/:size`,
    allPersonInBaseWithSort: `${baseURL}/roster/:ebid/order-by/:sort/offset/:offset/size/:size`,
    allPersonInBaseAgg: `${baseURL}/roster/:ebid/agg?offset=&order=h_index&size=20`,
    // TODO agg

    searchMap: `${baseURL}/search/person/geo`, // ?query=:search
    searchExpertBaseMap: `${baseURL}/roster/:id/geo/offset/:offset/size/:size`,
    searchExpertNetWithDSL: `${baseURL}/search/person/ego`,

    searchPubs: `${baseURL}/search/pub`, // ?query=xxx&size=20&sort=relevance`,

    // search suggest
    searchSuggest: `${baseURL}/search/suggest/gen/:query`,

    // misc services
    translateTerm: `${baseURL}/abbreviation/mapping/:term`,

    // export roster
    rosterExportSimple: `${baseURL}/roster/:id/export/s/offset/:offset/size/:size/:name`,

    // seminar
    getSeminars: `${baseURL}/activity/list/offset/:offset/size/:size`, // src aid uid organizer type category stype
    getActivityById: `${baseURL}/activity/:id`,
    postActivity: `${baseURL}/activity/post_activity`,
    updateActivity: `${baseURL}/activity/update`,
    speakerSuggest: `${baseURL}/activity/speaker/suggest`,
    uploadActivityPosterImgFile: `${baseURL}/activity/img`,
    searchActivity: `${baseURL}/search/activity`,
    deleteActivity: `${baseURL}/activity/delete/:id`,
    getCommentFromActivity: `${baseURL}/comment/activity/:id/offset/:offset/size/:size`,
    addCommentToActivity: `${baseURL}/comment/activity/:id`,
    deleteCommentFromActivity: `${baseURL}/comment/activity/cmid/:id`,
    // score
    updateOrSaveActivityScore: `${baseURL}/activity/score/me/:src/:actid/:aid/:key/:score/:lvtime`,
    // 不知 key, 列出相关的 key 和 scores.
    listActivityScores: `${baseURL}/activity/score-list/:uid/:src/:actid`,
    // 已知 key 获取 一个 score
    getActivityScore: `${baseURL}/activity/score/:uid/:src/:actid/:aid/:key`,
    getStatsOfCcfActivities: `${baseURL}/activity/admin/stats`,
    keywordExtraction: `${baseURL}http://nlp.newsminer.net/rest/nlp/keywords`,
    getTopMentionedTags: `${baseURL}/activity/tags/:src/:num`,

    /* person */
    personProfile: `${baseURL}/person/summary/:id`,
    personEmailImg: `${baseURL}/person/email/i/`,
    personEmailStr: `${baseURL}/person/email/s/:id`,
    getEmailCrImage: `${baseURL}/person/email-cr/i/`,
    listPersonByIds: `${baseURL}/person/batch-list`,
    getActivityAvgScoresByPersonId: `${baseURL}/person/activity/:id/indices`,

    // merge
    tryToDoMerge: `${baseURL}/bifrost/person/merge/:mid`,

    // interests vis data
    interests: `${baseURL}/person/interests/:id`, // 这个是vis图中单独调用的。和人下面的可能不一样.

    /* publications */
    pubList: `${baseURL}/person/pubs/:id/all/year/:offset/:size`,
    pubListByCitation: `${baseURL}/person/pubs/:id/all/citation/:offset/:size`,
    pubListInfo: `${baseURL}/person/pubs/:id/stats`,
    pubListByYear: `${baseURL}/person/pubs/:id/range/year/:year/:offset/:size`,
    pubListLimited: `${baseURL}/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size`,
    pubById: `${baseURL}/pub/summary/:id`,

    // System config
    ucListByCategory: `${baseURL}/2b/config/:source/list?category=:category`,
    ucSetByKey: `${baseURL}/2b/config/:source/:category/:key`,
    ucDeleteByKey: `${baseURL}/2b/config/:source/:category/:key`,
    ucUpdateByKey: `${baseURL}/2b/config/:source/:category/rename/:key/:newKey`,
    getCategoriesHint: `${baseURL}/2b/config/:source/category/suggest/:category`,
    listConfigsByCategoryList: `${baseURL}/2b/config/:source/by-category`,

    // topic
    getTopicByMention: `${baseURL}/topic/summary/m/:mention`,

    // Recommendation APIs
    getAllOrgs: `${baseURL}/reviewer/orgs/get/all/:offset/:size`,
    // getOrgById: `${baseURL}/reviewer/org/get/:id`,

    // cross heat
    getDiscipline: 'https://cross1.aminer.org/topics?area=:area&k=:k&depth=:depth&context=',
    delDiscipline: 'https://cross1.aminer.org/feedback?parents=:parents&children=:children&postive=:postive',
    createDiscipline: `${baseURL}/cross-domain/query`,
    getTaskList: `${baseURL}/cross-domain/query/offset/:offset/size/:size`,
    getCrossTree: `${baseURL}/cross-domain/query/:id`,
    delTaskList: `${baseURL}/cross-domain/query/:id`,
    getDomainInfo: `${baseURL}/cross-domain/records/:beginYear/:endYear/:pubSkip/:pubLimit/:authorSkip/:authorLimit`,
    // getDomainAllInfo: 'http://166.111.7.173:15000/record/:domain1/:domain2/:begin/:end',
    getDomainAllInfo: `${baseURL}/cross-domain/record/:domain1/:domain2/:beginYear/:endYear/:summary/:pubSkip/:pubLimit/:authorSkip/:authorLimit`,
    getExpertByIds: `${baseURL}/person/batch-list`,
    getPubById: `${baseURL}/pub/:id`,
    getSuggest: `${baseURL}/search/suggest/gen/:query`,
    getCrossPredict: `${baseURL}/cross-domain/predict`,

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


    // userInfo: `${baseURL}/userInfo`,
    // users: `${baseURL}/users`,
    // dashboard: `${baseURL}/dashboard`,
    // expert info
    getExpertInfo: `${baseURL}/2b/profile/:src/offset/:offset/size/:size`,
    deleteItemByKey: `${baseURL}/2b/profile/:src/:id`,
    editItemByKey: `${baseURL}/2b/profile/:src/:id`,
    addExpertInfoApi: `${baseURL}/2b/profile/:src`,
    updateItemById: `${baseURL}/2b/profile/:src/:id`,
    searchItemByName: `${baseURL}/2b/profile/:src/offset/:offset/size/:size`,
    getToBProfileByAid: `${baseURL}/2b/profile/:src/aid/:id`,
    updateToBProfileExtra: `${baseURL}/2b/profile/:src/:id/extra`,

    getExpertBase: `${baseURL}/roster/list/:type/offset/:offset/size/:size`,
    addExpertBaseApi: `${baseURL}/roster`,
    addExpertToEB: `${baseURL}/roster/:ebid/a`,
    deleteExpertBaseApi: `${baseURL}/roster/:rid`,
    getExpertDetailList: `${baseURL}/roster/:ebid/order-by/h_index/offset/:offset/size/:size`,
    invokeRoster: `${baseURL}/roster/:id/members/u`,
    removeExpertsFromEBByPid: `${baseURL}/roster/:rid/d/:pid`,
    // getToBProfile: `${baseURL}/api/2b/profile/:src/:id`,
    getTrajectoryInfo: `${baseURL}/person/geo/trajectory/:id/year/:lo/:hi`,
    getHeatInfo: `${baseURL}/person/geo/trajectory/roster/:rid/year/:lo/:hi/size/:size`,

    // Knowledge Graph
    kgFind: {
      api: `${baseURL}/knowledge-graph/:entry`,
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
      api: `${baseURL}/knowledge-graph/:id_chain`,
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

  },
};
