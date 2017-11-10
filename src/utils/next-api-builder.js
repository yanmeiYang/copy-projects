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

// Query api-builder.
const query = (action, eventName) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }

  const api = {
    action,
    eventName,
  };

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
    addParam: (params) => {
      if (!api.parameters) {
        api.parameters = {};
      }
      apiMerge(api.parameters, params);
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
    addSchema: (schema) => {
      if (!api.schema) {
        api.schema = {};
      }
      apiMerge(api.schema, schema);
      return chains;
    },
  };
  return chains;
};

// Alter api-builder.
const alter = (action) => {
  if (!action) {
    throw new ParamError('Parameter action can\'t be empty.');
  }

  const api = {
    action,
  };

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
    addParam: (params) => {
      if (!api.parameters) {
        api.parameters = {};
      }
      apiMerge(api.parameters, params);
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
    addSchema: (schema) => {
      if (!api.schema) {
        api.schema = {};
      }
      apiMerge(api.schema, schema);
      return chains;
    },
  };
  return chains;
};

// TODO alter, run.

const apiBuilder = {
  //
  // Query
  //
  query,

  alter,

  // alter: () => {},
  // run: () => {},
};

// Builtin Fields.
const F = {
  Type: { Query: 'query', Alter: 'alter' },

  // query related
  queries: { search: 'search' }, // query actions.
  searchType: { all: 'all', allb: 'allb' },
  params: {
    default_aggregation: ['gender', 'h_index', 'location', 'language'],
  },
  fields: {
    person: {
      indices_all: ['hindex', 'gindex', 'pubs',
        'citations', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'],
      // 'id', 'name', 'name_zh', 'avatar', 'tags', 'tags_translated_zh',
      // 'tags_zh',
      // 'org', 'org_zh', 'bio', 'email', 'edu' ', phone'
    },
  },

  // alter related
  alters: { alter: 'alter' }, // alter actions.
  alterop: { upsert: 'upsert', update: 'update', delete: 'delete' }, // alter operations

  Entities: { Person: 'person', Publication: 'pub', Venue: 'venue' },
};

// functions
const applyPlugin = (nextapi, pluginConfig) => {
  if (!nextapi || !pluginConfig) {
    return false;
  }
  nextapi.addParam(pluginConfig.parameters);
  nextapi.addSchema(pluginConfig.schema);
  // TODO ... merge filters, sorts, havings, etc...
  return nextapi;
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
      nextapi.addParam({ filters: { terms: { [key]: [filters[key]] } } });
    }
    return false;
  });
};

module.exports = {
  apiBuilder, F, applyPlugin, filtersToQuery,
};

//
// // TEST
//
// const q = apiBuilder.query(F.action.search)
//   .param({ query: 'data mining', offset: 0, size: 10 })
//   .param({ searchType: F.searchType.allb })
//   .param({ aggregation: ['gender', 'h_index', 'location', 'language'] })
//   .schema({
//     person: [
//       'id', 'name', 'name_zh', 'tags', // 'tags_zh', 'tags_trans_zh'
//       {
//         profile: [
//           'position', 'affiliation',
//           // 'org', 'org_zh', 'bio', 'email', 'edu' ', phone'
//         ],
//       },
//       { indices: F.fields.person.indices_all },
//     ],
//   });
// // .filters(),
//
// q.param({
//   filters: {
//     dims: {
//       title: ['sdfsdf'],
//     },
//   },
// });
//
// q.mergeParam({ filters: { dims: { title: ['234234'] } } });
//
// console.log(q.api);
// console.log('--------------------------');
// console.log(JSON.stringify(q.api));
