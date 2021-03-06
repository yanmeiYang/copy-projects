/* eslint-disable no-param-reassign */
import { mergeWith, isArray } from 'lodash';

/**
 *  Created by BoGao on 2017-10-25;
 *
 *  Note: Next API QueryBuilder
 */
class ParamError extends Error {
  constructor(message) {
    super();
    this.name = 'ParamError';
  }
}

function apiMerge(obj, source) {
  mergeWith(obj, source, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
}

// basic chains
const createBasicChains = (api) => {
  const chains = {
    api,
    param: (params, config) => {
      if (!config || config.when) {
        if (params) {
          if (!api.parameters) {
            api.parameters = {};
          }
          Object.keys(params).map((key) => {
            api.parameters[key] = params[key];
            return false;
          });
        }
      }
      return chains;
    },
    addParam: (params, config) => {
      if (!config || config.when) {
        if (!api.parameters) {
          api.parameters = {};
        }
        apiMerge(api.parameters, params);
      }
      return chains;
    },
    addFilter: (filterType, params, config) => {
      if (!config || config.when) {
        if (!api.parameters) {
          api.parameters = {};
        }
        api.parameters.filters = api.parameters.filters || {};
        if (!api.parameters.filters[filterType]) {
          api.parameters.filters[filterType] = {}
        }
        apiMerge(api.parameters.filters[filterType], params);
      }
      return chains;
    },
    schema: (schema, config) => {
      if (!config || config.when) {
        if (!api.schema) {
          api.schema = {};
        }
        api.schema = schema;
      }
      return chains;
    },
    addSchema: (schema, config) => {
      if (!config || config.when) {
        if (!api.schema) {
          api.schema = {};
        }
        apiMerge(api.schema, schema);
      }
      return chains;
    },
  };
  return chains;
};

// Query api-builder.
const query = (action, eventName) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }

  const api = {
    // type: 'query',
    action,
    eventName,
  };

  const chains = createBasicChains(api);
  return chains;
};

// Alter api-builder.
const alter = (action, eventName) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }
  return createBasicChains({ action, eventName });
};

const notify = (action, eventName) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }
  return createBasicChains({ action, eventName });
};

const create = (action, eventName) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }
  return createBasicChains({ action, eventName });
};

/**
 * NEXT-API Query Builder
 */
const apiBuilder = {
  //
  // Query
  //
  query,

  alter,

  notify,

  create,

  // alter: () => {},
  // run: () => {},
};


// ------------------ Builtin Fields --------------------------
const fseg = {
  indices_all: ['hindex', 'gindex', 'pubs',
    'citations', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'],
  // 'id', 'name', 'name_zh', 'avatar', 'tags', 'tags_translated_zh',
  // 'tags_zh', 'org', 'org_zh', 'bio', 'email', 'edu' ', phone'
};

const F = {
  // Helper Options.

  // Type: { Query: 'query', Alter: 'alter', Magic: 'magic' },

  // all available entities in system.
  Entities: { Person: 'person', Publication: 'pub', Venue: 'venue' },

  // available person's tags.
  Tags: { systag: 'systag' },

  // query related // TODO @xiaobei 这些都是啥呀？？？
  queries: {
    search: 'search',
    RevieweRreport: 'RevieweRreport', // TODO @xiaobei ?????????,
    ReviewerQuery: 'ReviewerQuery',
    ReviewerDownloadCSV: 'ReviewerDownloadCSV',
    ReviewerClickPersons: 'ReviewerClickPersons',
  }, // query actions.
  alter: {
    alter: 'alter',
    ReviewerProject: 'ReviewerProject',
  },
  notify: { feedback: 'feedback' },

  searchType: { all: 'all', allb: 'allb' },

  // 预置的一些默认词
  params: {
    default_aggregation: ['gender', 'h_index', 'nation', 'lang'],
  },

  // all available alter operations.
  opts: { upsert: 'upsert', update: 'update', delete: 'delete' },
  // alter operations, TODO this will be replaced by opts.
  alterop: { upsert: 'upsert', update: 'update', delete: 'delete' },

  alters: { alter: 'alter', dims: 'dims' }, // alter actions.


  // Available Fields

  fields: {
    person: {
      indices_all: fseg.indices_all,
    },
    person_in_PersonList: [
      'id', 'name', 'name_zh', 'avatar', 'tags',
      { profile: ['position', 'affiliation', 'org'] },
      { indices: fseg.indices_all },
    ],
    eb: {
      forTree: {
        expertbase: ['name', 'name_zh', 'logo', 'type', 'stats', 'is_deleted', 'parents']
      },
      full: {
        expertbase: ['name', 'name_zh', 'logo', 'desc', 'type', 'stats', 'desc_zh',
          'created_time', 'updated_time', 'is_deleted', 'parents', 'creator']
      },
    },
  },
};

const Action = {
  search: {
    search: 'search.search',
  },
  person_eb: {
    alter: 'person_eb.alter',
  },
  dm_intellwords: {
    expand: 'dm_intellwords.expand',
  },
  reviewer: {
    ListProject: 'reviewer.ListProject',
    GetProject: 'reviewer.GetProject',
    CreateProject: 'reviewer.CreateProject',
    UpdateProject: 'reviewer.UpdateProject',
    DeleteProject: 'reviewer.DeleteProject',
    UploadPDF: 'reviewer.UploadPDF',
    GetReport: 'reviewer.GetReport',
    GetClickPersons: 'reviewer.GetClickPersons',
    DownloadCSV: 'reviewer.DownloadCSV',
    RequestCrawlList: 'reviewer.RequestCrawlList',
    ReviewerQuery: 'reviewer.ReviewerQuery',
    SendTestMail: 'reviewer.SendTestMail',
    ConfirmTestMail: 'reviewer.ConfirmTestMail',
    SendMail: 'reviewer.SendMail',
    RevieweOrg: 'reviewer.RevieweOrg',
    StartCrawl: 'reviewer.StartCrawl',
    CountProject: 'reviewer.CountProject',
    GetCrawlProgress: 'reviewer.GetCrawlProgress',
    CopyProject: 'reviewer.CopyProject',
  },
  organization: {
    Search: 'search.Search',
    Alter: 'organization.Alter',
    Delete: 'organization.Delete',
    search: 'search.search', // todo delete

  },
  expertbase: {
    Alter: 'expertbase.Alter',
    Move: 'expertbase.Move',
    Delete: 'expertbase.Delete',
  },
  tob: {
    permission: 'tob.auth.functionpermission',
    roles: 'tob.auth.roles',
    Schema: 'tob.permission.Schema',
    getRole: 'tob.permission.GetRole',
  },
};

// ------------------ Helper Functions --------------------------
//
// const applyPlugin = (nextapi, pluginConfig) => {
//   if (!nextapi || !pluginConfig) {
//     return false;
//   }
//   nextapi.addParam(pluginConfig.parameters);
//   nextapi.addSchema(pluginConfig.schema);
//   // TODO ... merge filters, sorts, havings, etc...
//   return nextapi;
// };


const filterByEBs = (nextapi, ebs) => {
  nextapi.addParam({ filters: { dims: { eb: ebs } } });
};

const filtersToQuery = (nextapi, searchFiltersFromAggregation) => {
  const filters = searchFiltersFromAggregation;
  Object.keys(filters).map((key) => {
    const filter = filters[key];
    if (key === 'eb') {
      if (filter && filter.id) {
        // const ebLabel = bridge.toNextCCFLabelFromEBID(filters.eb.id);
        nextapi.addParam({ filters: { dims: { eb: [filter.id] } } });
      }
    } else if (key === 'h_index') {
      // console.log('TODO filter by h_index 这里暂时是用解析的方式获取数据的。');
      const splits = filter.split('-');
      if (splits && splits.length === 2) {
        const from = parseInt(splits[0]);
        const to = parseInt(splits[1]);
        nextapi.addParam({
          filters: {
            ranges: {
              h_index: [
                isNaN(from) ? '' : from.toString(),
                isNaN(to) ? '' : to.toString(),
              ],
            },
          },
        });
      }
    } else if (key.startsWith('dims.')) {
      const newKey = key.replace(/^dims\./, '');
      nextapi.addParam({ filters: { dims: { [newKey]: [filters[key]] } } });
    } else {
      // NOTE 这里是传统的 aggregation，查询值需要是小写的。和es匹配，但是nation咋办？
      const value = filters[key] && filters[key].toLowerCase();
      nextapi.addParam({ filters: { terms: { [key]: [value] } } });
    }
    return false;
  });
};
const createFieldsArray = (data) => {
 return Object.keys(data).map((field) => {
    return { 'field': field, 'value': data[field] };
  })
};

const H = { filtersToQuery, filterByEBs, createFieldsArray };

export { apiBuilder, Action, F, H };
